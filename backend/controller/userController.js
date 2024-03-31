// nodemailer: If someone uses the option of forgot password, then reset password link(otp) should be sent to the user. Advantage: We donot have to type an email. It is done automatically by nodemailer

const User = require("../models/userModels");
const ErrorHander = require("../utils/errorHander");

// concising code
const sendToken = require("../utils/jwtToken");

// This will handle the error such as the required things(e.g email,name) are not provided by the user
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { sendEmail } = require("../utils/sendEmail");

// crypto:for generating reset password token
const crypto = require("crypto");

const cloudinary = require("cloudinary");

// post Api
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "resume",
    width: 150,
    crop: "scale",
  });

  // in case you want to take all the inputs
  // const user= await User.create(req.body)

  // in case you want to take specific inputs
  // what is destructuring? it a property used to extract values from from array and object and assign them to variable
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  const token = user.getJwtToken();

  sendToken(user, 201, res);

  // user can be created from this statement as well
  // const user = await User.create(req.body)

  // we are now minimizing the lines of code and adding this token in the cookie with the help pf new fucntion that we are creating
  // res.status(201).json({
  // success: true,
  // user'

  // rather then user jwt token will be returned
  // token
  // })
});

// login Api
// taking data from body storing in variables
// post Api
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  // picking value from body
  const { email, password } = req.body;

  // what if user have not given both email and password
  // 400 means bad request
  if (!email || !password) {
    return next(new ErrorHander("Please enter Email & Password", 400));
  }

  // we have to find only one user that is why findOne method is used
  // we have to find email and password both
  // password "select" property is false therefore we have to specify its selection property seperately
  // if value and variable name are same like: {email:email} then we can write them once {email}, both give the same meaning
  const user = await User.findOne({ email: email }).select("+password");

  // what if user email is incorrect?
  // 401 means unauthorized response
  if (!user) {
    return next(new ErrorHander("Invalid Email Or Password", 401));
  }

  // making function to compare the password entered by user and the password stored in schema
  // we have made the comparePassword function/method in User's Schema
  // We are pasing the "password" entered by the user
  const isPasswordMatched = await user.comparePassword(password);

  // what if password does not match such that the user have entered the wrong password
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid Email Or Password", 401));
  }

  sendToken(user, 200, res);

  // we are now minimizing the lines of code and adding this token in the cookie with the help pf new fucntion that we are creating
  // "user." because we need access to schema
  // const token = user.getJwtToken()

  // res.status(201).json({
  //     success: true,
  // user,
  // token
  // })
});

// logout user is a get api
// it deletes the jwt token from cookies showing that no user have logged in
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  // cookie takes input of token value at second and options at third
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(201).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password api
// user enter the "email" first
// cuz he forgot passowrd not email
// hence we search the email in the database
// what if user have entered wrong email that does not even exist in the database?
// what if the email have been found?
// 404:requested page is not available
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  if (!user) {
    next(new ErrorHander("User not found", 404));
  }

  // getResetPasswordToken returns the "resetToken" when called
  const resetToken = user.getResetPasswordToken();

  // we have recieved the token in the previous step now to save that in db
  await user.save({ validateBeforeSave: false });

  // we have to send a mail link to user
  // clicking on this link he/her can update the password
  // preparing the link
  // req.get("host")-> it is used to get the hostname
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  // preparing a message that we want to sent to customer
  // \n-> line break

  const message = `Your password reset token is:-\n\n ${resetPasswordUrl} \n\n If you have not expected this mail then please ignore it`;

  // try catch is used when you know that the error could arrive and you dont want to stop the execution of your code

  try {
    // sending email to user
    await sendEmail({
      // we will be using "await" to complete this part first rather then the catch block
      email: user.email,
      subject: "E commerce password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // agr fail ho jaye email na pohnchay then apka data save ha already bhai token aur expiry time usko undefine krkay dubara sa save krna hoga
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.save({ validateBeforeSave: false });

    // aur try catch kay error  me already error stored hota ha built in wohi pass kregay
    // 500-> internal server error
    next(new ErrorHander(error.message, 500));
  }
});

// update password Api
// it will take two inputs!
// password and confirmPassword
// This function will only work when the email of the user is correct in forgot password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // first we have to access the token using the link
  const token = req.params.token;

  // after that we have to hash this token using "crypto", why we have to hash?
  // because we have returned the "token" to the user not the hashed token
  // on the other hand we have stored the hashed token in database

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // finding that token in database. Also resetPasswordExpire is updated during the forgot function. We have to update that as well. It should be greater then the "current time" otherwise it means that your token is expired
  // $gt:mongodb operator greater then
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // what if the token is not matched or is expired

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is Invalid or has been Expired",
        400
      )
    );
  }

  // if the user is dumb and entered different value in password and confirmPassword
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not match", 400));
  }

  // what if both the passwords are matched
  // new password should be upadated in the database and should be saved
  // also now no need of resetPasswordToken & resetPasswordExpire so undefining them
  // also user should be logged in which means storing of the token in cookie(sendToken)
  user.password = req.body.password;

  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  // saving data in db
  await user.save();

  // logging in

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(201).cookie("token", token, options).json({
    success: true,
    message: "Logged in successfully",
    user,
    token,
  });

  // sendToken(user, 200, res)
});

// -----------These apis are used to update the password and profile of the user--------------
// Api similar to getProductDetails
// get Api
// using id stored in req.user during the log in function we will get the details of the user
// Note: The user is already logged in
// so we do not need to seperately make an if condition that if the user is not found then? Because this api can be accessed only when the user is already logged in
// question arises why we are searching for the user?
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  // "req.user" consist of decodedData of user we have assigned in "isAuthenticatedUser"
  // decoded data also has the id of user
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, user });
});

// update password put Api
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  // 3 thing required
  // existing password
  // new password
  // confirmation of new password

  const oldPassword = req.body.oldPassword;

  // we can not directly access the password of schema because its select property is false
  // user ki id se niaklna ha password
  // id kay liye pehlay login hona zaruri matla athentication bhi lagni ha

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  // if user is not saved then?
  await user.save();

  sendToken(user, 201, res);
});

// Api to update email and name
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  // we have to take the updated email and name of the user
  // note: user is already logged in
  // const email=req.body.email
  // const name=req.body.name

  // we also have to add "avatar" but we will add it when working with cloudinary

  const newUserData = { email: req.body.email, name: req.body.name };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
  });
});

// --------------------------------Admin Routes---------------------------------
// Admin can see all of the users created -- get request
// Admin can see a specific user with the help of id -- get request
// Admin should be able to update the role, name and email of any user -- put request
// Admin should be able to delete any user -- delete request

// get api
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// get api
// id of user is required
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User with the id ${req.params.id} not found`, 400)
    );
  }

  res.status(200).json({ success: true, user });
});

// updating user profile with the help of user id
exports.UpdateUserRole = catchAsyncErrors(async (req, res, next) => {
  // Admin should not be able to change the profile picture of user
  const newUserData = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  await user.save();
  res
    .status(201)
    .json({ success: true, message: "User upadated successfully" });
});

// admin deleting the user
// it also requires the "id"
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User with the id ${req.params.id} not found`, 400)
    );
  }

  await user.remove();

  res.status(201).json({ success: true, message: "User deleted successfully" });
});
