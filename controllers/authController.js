const User = require("../models/User");
const Otp = require("../models/Otp");
 
exports.signup = async (req, res) => {
  const { email, phone, password } = req.body;
 
  const user = await User.create({
    email,
    phone,
    password,
    
  });
 
  res.json(user);
};
exports.signupEmail = async (req, res) => {
  const { name, email } = req.body;
 
  if (!name || !email) return res.status(400).json({ msg: "Name and email required" });
 
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });
 
    // Create new user
    user = await User.create({ name, email });
 
    // Generate OTP immediately after creating user
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 min
 
    await Otp.create({
      email,
      phone: null,
      otp: generatedOtp,
      expiresAt: expiryTime,
    });
 
    console.log("Generated OTP for email:", email, generatedOtp);
 
    res.json({ msg: "Signup successful, OTP sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
 
exports.signupPhone = async (req, res) => {
  const { phone, name } = req.body;
 
  if (!phone || !name) {
    return res.status(400).json({ msg: "Name and phone are required" });
  }
 
  try {
    // Check if user already exists
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
 
    // Create new user
    user = await User.create({ phone, name });
    console.log("New user created:", name, phone);
 
    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
 
    await Otp.create({
      email: null,
      phone,
      otp: generatedOtp,
      expiresAt: expiryTime,
    });
 
    console.log("Generated Phone OTP:", generatedOtp);
 
    res.json({ msg: "Signup successful, OTP sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.loginPhone = async (req, res) => {
  const { phone } = req.body;
 
  try {
    const user = await User.findOne({ phone });
 
    if (!user) {
      // New user → tell frontend to go signup-phone
      return res.status(400).json({ msg: "User not found" });
    }
 
    // Existing user → generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
 
    await Otp.create({
      email: null,
      phone,
      otp: generatedOtp,
      expiresAt: expiryTime,
    });
 
    console.log("Generated Phone OTP:", generatedOtp);
 
    res.json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
 
exports.login = async (req, res) => {
  const { email } = req.body;
 
  const user = await User.findOne({ email });
 
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }
 
  // Generate 6 digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
 
  // Expiry time (5 minutes)
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
 
  // Save OTP in DB
  await Otp.create({
    email,
    otp: generatedOtp,
    expiresAt: expiryTime,
  });
 
  console.log("Generated OTP:", generatedOtp); // For testing
 
  res.json({ msg: "OTP sent successfully" });
};
exports.verifyOtpPhone = async (req, res) => {
  const { phone, otp } = req.body;
 
  if (!phone || !otp) return res.status(400).json({ msg: "Phone and OTP required" });
 
  try {
    // Find OTP record for this phone
    const otpRecord = await Otp.findOne({ phone, otp });
 
    if (!otpRecord) {
      return res.status(400).json({ msg: "Wrong OTP" });
    }
 
    // Check expiry
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ msg: "OTP expired" });
    }
 
    // OTP is correct
    res.json({ msg: "OTP verified successfully" });
 
    // Optional: Delete OTP after verification
    await Otp.deleteOne({ _id: otpRecord._id });
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.verifyOtpEmail = async (req, res) => {
  const { email, otp } = req.body;
 
  if (!email || !otp) return res.status(400).json({ msg: "Email and OTP required" });
 
  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ msg: "Wrong OTP" });
 
    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ msg: "OTP expired" });
 
    // Success
    res.json({ msg: "OTP verified successfully" });
 
    // Optional: delete OTP
    await Otp.deleteOne({ _id: otpRecord._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};