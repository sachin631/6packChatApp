const jwt = require("jsonwebtoken");
exports.login_middleware = async (req, res, next) => {
  let token = await req?.cookies.access_token;
  if (!token) {
    return res.status(400).json({ message: "No Token Found" });
  }

  let verify_token = await jwt.verify(
    token,
    process.env.access_token_secret_key
  );
  if (!verify_token) {
    return res.status(400).json({ message: "token is not verified" });
  }

  req.loginUser = verify_token._id;
  next();
};
