const { default: mongoose } = require("mongoose");
const { ALERT, REFETCH_CHAT } = require("../constant/constant");
const userAuthModel = require("../models/user.auth.model");
const user_chat_model = require("../models/user.chat.model");
const message_model = require("../models/user.messages.model");
const emit_event = require("../utils/features");

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
        httpOnly: true,
      })
      .cookie("refresh_token", refresh_token, {
        expireIn: "10d",
        httpOnly: true,
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

  chatHistory: async (req, res) => {
    console.log("app is working here");
    try {
      const userId = req.params.userId;
      console.log(userId);
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

    console.log(my_chat, "my_chat");
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
    const {group_id,member_id}=req.body;
    const add_mem=await user_chat_model.findById({_id:group_id});
    if(!add_mem){
      return  res.status(400).json({ data: null, message: "updation failed" });
    }
    let is_mem=add_mem.members.find((curelem)=>{
       return curelem.equals(new mongoose.Types.ObjectId(member_id));
    });
    console.log(is_mem,'is__mem');
    if(is_mem){
        return res.status(400).json({ data: add_mem, message: "member already existed" });
    }
    add_mem.members.push(member_id);
    await add_mem.save();
   return res.status(200).json({ data: add_mem, message: "member added successfully" });
  },
};

module.exports = { ...userController };
