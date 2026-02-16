const router = require("express").Router();

const { signup, login, loginPhone, signupPhone, signupEmail, verifyOtpPhone, verifyOtpEmail, checkEmail } = require("../controllers/authController");

// const { signup, login, loginPhone, signupPhone ,signupEmail,verifyOtpPhone,verifyOtpEmail} = require("../controllers/authController");
 
router.post("/signup", signup);
router.post("/login", login);
router.post("/login-phone", loginPhone);
router.post("/signup-email", signupEmail);
router.post("/signup-phone", signupPhone);
router.post("/verify-otp-email", verifyOtpEmail);
router.post("/verify-otp-phone", verifyOtpPhone);
router.post("/check-email", checkEmail);

 
 
 
module.exports = router;