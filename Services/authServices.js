const usermodel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../util/ApiErrors");
const crypto = require("crypto");
const sendEmail = require("../util/sendEmail");
const asyncHandler = require("express-async-handler");
exports.signup = async (req, res, next) => {
  const user = await usermodel.create(req.body);
  const token = jwt.sign({ 
      userId: user._id }, process.env.JWT_SECRECT_KEY, {expiresIn: "90d",
  });
  res.status(201).json({ data: user, token });
};

exports.login = async (req, res, next) => {
  const user = await usermodel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(403).send("Invalid email or password");
  } else {
    if (user.isblocked) {
      return res.status(403).send("Your account is blocked. You cannot log in.");
    }
    let isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      console.log(`Password doesn't match`);
      return res.status(403).send("Invalid email or password");
    } else {
      //generate JWT
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRECT_KEY,
        { expiresIn: "90d" }
      );
      delete user._doc.password;
      res.status(200).send({ data: user, token });
    }
  } 
};

//make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("You are not login, Please login to get access this route",401)
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY);

  // 3) Check if user exists
  const currentUser = await usermodel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("The user that belong to this token does no longer exist",401)
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError("User recently changed his password. please login again..",401));
    }
  }

  req.user = currentUser;
  console.log(req.user._id);
  next();
});

exports.allowedto = (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("you are not allowed", 403));
    }
    next();
  };

exports.forgetPassword = async (req, res, next) => {
  try {
    const user = await usermodel.findOne({ email: req.body.email });
    if (!user) {
      throw Error("Email Not Found");
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    user.passwordResetCode = hashResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    user.save();
    const message = `HI ${user.name},we recoved to rest the password on your graduation_Project account \n ${resetCode} thanks to me`;
    await sendEmail({
      email: user.email,
      subject: `your password reset code(valid for 10 min)`,
      text: message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    error.statusCode = 500;
    next(new ApiError(error));
  }
  res.status(200).json({ status: "Success", message: "mail sent" });
};

exports.verifyPassResetCode = async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await usermodel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({status: "Success",});
};

exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on email
  const user = await usermodel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRECT_KEY, {
    expiresIn: "90d",
  });
  res.status(200).json({ message: "success", token });
};

exports.logout = (req, res) => {
  // Clear the token from the client-side (e.g., remove it from local storage or cookies)
  // For example, if using cookies:
  res.clearCookie("jwtToken"); // Assuming your token is stored in a cookie named 'jwtToken'

  // Redirect the user to the login page or any other desired destination
  res.redirect("/login");
};
