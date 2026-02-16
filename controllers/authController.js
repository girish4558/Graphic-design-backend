const User = require("../models/User");
const Otp = require("../models/Otp");

/* =========================
   Basic signup
========================= */
exports.signup = async (req, res) => {
  const { email, phone, password } = req.body;

  const user = await User.create({
    email,
    phone,
    password,
  });

  res.json(user);
};

/* =========================
   Dummy signup email
========================= */
exports.signupEmail = async (req, res) => {
  const { name, email } = req.body;

  console.log("Signup Email:", name, email);

  return res.status(200).json({
    msg: "Signup successful (dummy)",
    otp: "123456"
  });
};

/* =========================
   Dummy login email
========================= */
exports.login = async (req, res) => {
  const { email } = req.body;

  console.log("Login Email:", email);

  return res.status(200).json({
    msg: "OTP sent successfully (dummy)",
    otp: "123456"
  });
};

/* =========================
   Dummy verify email OTP
========================= */
exports.verifyOtpEmail = async (req, res) => {
  return res.status(200).json({
    msg: "OTP verified successfully (dummy)"
  });
};

/* =========================
   Dummy phone signup
========================= */
exports.signupPhone = async (req, res) => {
  res.json({ msg: "Phone signup working (dummy)" });
};

/* =========================
   Dummy phone login
========================= */
exports.loginPhone = async (req, res) => {
  res.json({ msg: "Phone login working (dummy)" });
};

/* =========================
   Dummy verify phone OTP
========================= */
exports.verifyOtpPhone = async (req, res) => {
  res.json({ msg: "Phone OTP verified (dummy)" });
};

/* =========================
   Check Email
========================= */
exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  console.log("Check email request:", email);

  res.json({ exists: true });
};

