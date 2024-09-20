const { default: mongoose } = require("mongoose");
const { ALERT, REFETCH_CHAT, NEW_REQUEST } = require("../constant/constant");
const userAuthModel = require("../models/user.auth.model");
const user_chat_model = require("../models/user.chat.model");
const message_model = require("../models/user.messages.model");
const emit_event = require("../utils/features");
const user_request_model = require("../models/user.request.model");

const userController = {
  user_register: async (req, res) => {
    const { email, password, name, bio } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "PLEASE PROVIDE FULL DETAILS" });
    }

    const is_user = await userAuthModel.findOne({ email });
    if (is_user) {
      return res.status(400).json({ message: "user already existed" });
    }

    const user = await userAuthModel.create({
      name,
      email,
      password,
      bio,
    });

    if (!user) {
      return res
        .status(200)
        .json({ message: "user register failed", data: user });
    }
    return res.status(200).json({
      message: "user register successfully try to login..",
      data: user,
    });
  },

  user_login: async (req, res) => {
    //get data//check email exist or not //compare password //getreate token both//store token in cookie
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "please provide all required details" });
    }

    const user = await userAuthModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not exist " });
    }

    const compare_password = await user.compare_password(password);
    if (!compare_password) {
      return res.status(200).json({ message: "email or password is invalid" });
    }

    const access_token = await user.access_token();
    const refresh_token = await user.refresh_token();

    if (!access_token && !refresh_token) {
      return res.status(400).json({ message: "error while store token" });
    }

    res
      .cookie("access_token", access_token, {
        expireIn: "1d",
        httpOnly: false,
      })
      .cookie("refresh_token", refresh_token, {
        expireIn: "10d",
        httpOnly: false,
      });

    return res.status(200).json({ message: "login successfully", user: user });
  },

  user_logout: async (req, res) => {
    res.clearCookie("access_token").clearCookie("refresh_token");
    res.status(200).json({ message: "logot successfully" });
  },

  user_list: async (req, res) => {
    try {
      const users = await userAuthModel.find({});
      if (!users) {
        return res.status(400).json({ message: "user not found" });
      }
      return res.status(200).json({ data: users });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  user_details: async (req, res) => {
    try {
      let login_user_id = req.loginUser;

      const user = await userAuthModel.findOne({ _id: login_user_id });
      if (!user) {
        res.status(400).json({ message: "user not found or invalid _id" });
      }
      const user_details = await userAuthModel.findById({ _id: login_user_id });
      if (!user_details) {
        res.status(400).json({ message: "user not found " });
      }
      res
        .status(200)
        .json({ data: user, message: "user fetched successfully" });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  search_user: async (req, res) => {
    let name = req.query.name || "";
    const my_chat = await user_chat_model.find({
      is_group_chat: false,
      members: req.loginUser,
    });
    //all user from my chat
    const allUserFromMyChat = my_chat.map((curelem) => curelem.members).flat();
    //all users except me and friend
    const allUserExceptMeAndFriends = await userAuthModel.find({
      _id: { $nin: allUserFromMyChat },
      name: { $regex: name, $options: "i" },
    });

    return res.status(200).json({
      message: "fetched successfuly",
      data: allUserExceptMeAndFriends,
    });
  },

  send_friend_request: async (req, res) => {
    const sender_id = req.loginUser;

    const receiver_id = req.body.receiver_id;
    const isAlreadyRequest = await user_request_model.find({
      $or: [
        { sender: sender_id, receiver: receiver_id },
        { sender: receiver_id, receiver: sender_id },
      ],
    });

    if (isAlreadyRequest.length > 0) {
      return res
        .status(400)
        .json({ message: "request already sent", data: isAlreadyRequest });
    }
    let request = await user_request_model.create({
      sender: sender_id,
      receiver: receiver_id,
    });
    if (!request) {
      return res
        .status(400)
        .json({ message: "request send failed", data: null });
    }
    emit_event(req, NEW_REQUEST, [receiver_id]);
    return res //4:20 //7:20
      .status(200)
      .json({ message: "request send successfully", data: request });
  },
  accept_friend_request: async (req, res) => {
    const { req_id, req_status } = req.body;

    const request = await user_request_model.findById(req_id);
    if (!request) {
      return res.status(400).json({ message: "request not found", data: null });
    }

    const update_req = await user_request_model.findByIdAndUpdate(
      req_id,
      { status: req_status },
      { new: true }
    );

    const store_in_chat = await user_chat_model.create({
      creator: new mongoose.Types.ObjectId(req.loginUser),
      members: [req.loginUser, request.sender],
    });

    if (!update_req) {
      return res
        .status(400)
        .json({ message: "request update failed", data: null });
    }
    emit_event(req, REFETCH_CHAT, [update_req.receiver, update_req.sender]);
    return res
      .status(200)
      .json({ message: "request update successfully", data: update_req });
  },

  get_my_friends: async (req, res) => {
    const user_id = req.loginUser;
    const my_friends = await user_chat_model
      .find({ members: user_id, is_group_chat: false })
      .populate("members");
    if (my_friends.length === 0) {
      return res
        .status(400)
        .json({ message: "my friends not found", data: null });
    }
    return res
      .status(200)
      .json({ message: "my friends fetched successfully", data: my_friends });
  },

  getNotification: async (req, res) => {
    const user_id = req.loginUser;

    const notification = await user_request_model
      .find({ status: 3, receiver: user_id })
      .populate("sender");
    if (!notification) {
      return res
        .status(400)
        .json({ message: "notification not found", data: null });
    }
    return res.status(200).json({
      message: "notification fetched successfully",
      data: notification,
    });
  },

  chatHistory: async (req, res) => {
    try {
      const userId = req.params.userId;

      const messages = await message_model
        .find({
          $or: [{ sender_id: userId }, { receiver_id: userId }],
        })
        .populate("sender_id")
        .populate("receiver_id")
        .sort({ createdAt: 1 });

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  create_group: async (req, res) => {
    try {
      const { name, members } = req.body;

      if (!name || !members) {
        return res
          .status(400)
          .json({ message: "please enter group name and enter members" });
      }
      if (members.length < 2) {
        return res
          .status(400)
          .json({ message: "please enter more then 1 member" });
      }
      let allMembers = [...members, req.loginUser];

      let group = await user_chat_model.create({
        name,
        members: allMembers,
        is_group_chat: true,
        creator: req.loginUser,
      });
      if (!group) {
        return res.status(400).json({ message: "error while creating group" });
      }
      emit_event(req, ALERT, allMembers, `welcome to ${name} group`);
      emit_event(req, REFETCH_CHAT, members);

      return res
        .status(200)
        .json({ data: group, message: "group created successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  get_my_chat: async (req, res) => {
    const login_user = req.loginUser;
    // const my_chat = await user_chat_model.find({ members: login_user }).populate('members','name email');
    const my_chat = await user_chat_model.aggregate([
      {
        $match: {
          members: { $in: [new mongoose.Types.ObjectId(login_user)] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $addFields: {
          display_name: {
            $cond: {
              if: { $eq: ["$is_group_chat", true] },
              then: "$name",
              else: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$members",
                      as: "member",
                      cond: {
                        $ne: [
                          "$$member",
                          new mongoose.Types.ObjectId(login_user),
                        ],
                      }, // Exclude login_user from members
                    },
                  },
                  0, // Get the first member that is not login_user
                ],
              },
            },
          },
        },
      },
    ]);

    if (!my_chat) {
      return res.status(400).json({ data: my_chat, message: "chat not found" });
    }
    return res
      .status(200)
      .json({ data: my_chat, message: "chat fetched successfully" });
  },
  get_my_groups: async (req, res) => {
    const my_groups = await user_chat_model.aggregate([
      {
        $match: {
          creator: new mongoose.Types.ObjectId(req.loginUser),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
    ]);
    if (!my_groups) {
      return res
        .status(400)
        .json({ data: my_chat, message: "group not found" });
    }
    res
      .status(200)
      .json({ data: my_groups, message: "groups fetched successfully" });
  },

  add_member_to_group: async (req, res) => {
    const { group_id, member_id } = req.body;
    const add_mem = await user_chat_model.findById({ _id: group_id });
    if (!add_mem) {
      return res.status(400).json({ data: null, message: "updation failed" });
    }
    let is_mem = add_mem.members.find((curelem) => {
      return curelem.equals(new mongoose.Types.ObjectId(member_id));
    });

    if (is_mem) {
      return res
        .status(400)
        .json({ data: add_mem, message: "member already existed" });
    }
    add_mem.members.push(member_id);
    await add_mem.save();
    emit_event(
      req,
      ALERT,
      member_id,
      `${member_id} has been added to the group`
    );
    emit_event(req, REFETCH_CHAT, member_id);
    return res
      .status(200)
      .json({ data: add_mem, message: "member added successfully" });
  },

  remove_member: async (req, res) => {
    const { group_id, member_id } = req.body;
    const group = await user_chat_model.findById({ _id: group_id });
    if (!group) {
      return res
        .status(400)
        .json({ data: null, message: "groud not exit with given credentials" });
    }
    const rest_mem = group?.members.filter(
      (curelem) => !curelem.equals(new mongoose.Types.ObjectId(member_id))
    );

    group.members = rest_mem;
    await group.save();
    emit_event(
      req,
      ALERT,
      member_id,
      `${member_id} has been removed from the group`
    );
    emit_event(req, REFETCH_CHAT, member_id);
    return res
      .status(200)
      .json({ data: group, message: "user deleted successfully" });
  },

  leave_group: async (req, res) => {
    const group_id = req.params.group_id;
    //find group//remove login member from this group//is login mem is admin then make other creator
    let group = await user_chat_model.findById({ _id: group_id });
    if (!group) {
      return res
        .status(200)
        .json({ data: null, message: "group is not found" });
    }
    let members = group?.members;
    let leaving_member = req.loginUser;
    let res_mem = members.filter(
      (curelem) => !curelem.equals(new mongoose.Types.ObjectId(leaving_member))
    );
    if (req.loginUser.toString() == group.creator.toString()) {
      group.creator = res_mem[0];
    }
    group.members = res_mem;
    await group.save();
    emit_event(
      req,
      ALERT,
      group.members,
      `${group.name} has been removed from the group`
    );
    emit_event(req, REFETCH_CHAT, group.members);
    return res
      .status(200)
      .json({ data: group, message: "you leaved this group successfully" });
  },
  chatDetails: async (req, res) => {
    const chat_id = req.query.chat_id;
    console.log(chat_id, "chat_d.........................");
    const chat_detail = await user_chat_model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chat_id),
        },
      },
    ]);
    if (!chat_detail) {
      return res
        .status(400)
        .json({ data: null, message: "chat_details not found" });
    }
    return res
      .status(200)
      .json({ message: "chat fetched successfully", data: chat_detail });
  },

  delete_chat: async (req, res) => {
    //delete only if login_user is creator//delete itns all member
    const chat_id = req.params.chat_id;
    const loginUser = req.loginUser;
    const find_chat = await user_chat_model.findById({ _id: chat_id });
    if (!find_chat) {
      return res.status(400).json({ message: "chat not found", data: null });
    }
    let creator = find_chat.creator;
    if (loginUser.toString() == creator.toString()) {
      const delete_id = await user_chat_model.deleteOne({ _id: chat_id });
      if (!delete_id) {
        return res
          .status(400)
          .json({ message: "error while deletion", data: null });
      }
      emit_event(req, REFETCH_CHAT, find_chat.members);
      return res
        .status(400)
        .json({ message: "chat deleted successfully", data: null });
    } else {
      return res
        .status(200)
        .json({ message: "only admin can delete the group", data: null });
    }
    //also need to delete messgaes of this chat
  },
};

module.exports = { ...userController };
