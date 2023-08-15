

// nodemailer: If someone uses the option of forgot password, then reset password link(otp) should be sent to the user. Advantage: We donot have to type an email. It is done automatically by nodemailer

const User = require("../models/userModels")
const ErrorHander = require("../utils/errorHander")

// concising code
const sendToken = require("../utils/jwtToken");

// This will handle the error such as the required things(e.g email,name) are not provided by the user
const catchAsyncErrors = require("../middleware/catchAsyncError");

// post Api
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    // in case you want to take all the inputs
    // const user= await User.create(req.body)

    // in case you want to take specific inputs
    // what is destructuring? it a property used to extract values from from array and object and assign them to variable
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password, avatar: {
            public_id: "sample id",
            url: "sampleurl"
        }
    })

    const token = user.getJwtToken()

    sendToken(user, 201, res)

    // user can be created from this statement as well
    // const user = await User.create(req.body)

    // we are now minimizing the lines of code and adding this token in the cookie with the help pf new fucntion that we are creating
    // res.status(201).json({
    // success: true,
    // user'

    // rather then user jwt token will be returned
    // token
    // })
})

// login Api
// taking data from body storing in variables
// post Api
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    // picking value from body
    const { email, password } = req.body

    // what if user have not given both email and password
    // 400 means bad request
    if (!email || !password) {
        return next(new ErrorHander("Please enter Email & Password", 400))
    }

    // we have to find only one user that is why findOne method is used
    // we have to find email and password both
    // password "select" property is false therefore we have to specify its selection property seperately
    // if value and variable name are same like: {email:email} then we can write them once {email}, both give the same meaning
    const user = await User.findOne({ email: email }).select("+password")

    // what if user email is incorrect?
    // 401 means unauthorized response
    if (!user) {
        return next(new ErrorHander("Invalid Email Or Password", 401))
    }

    // making function to compare the password entered by user and the password stored in schema
    // we have made the comparePassword function/method in User's Schema
    // We are pasing the "password" entered by the user
    const isPasswordMatched = await user.comparePassword(password)

    // what if password does not match such that the user have entered the wrong password
    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid Email Or Password", 401))
    }

    sendToken(user, 200, res)

    // we are now minimizing the lines of code and adding this token in the cookie with the help pf new fucntion that we are creating
    // "user." because we need access to schema
    // const token = user.getJwtToken()

    // res.status(201).json({
    //     success: true,
    // user,
    // token
    // })
})

// logout user is a get api
// it deletes the jwt token from cookies showing that no user have logged in
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    // cookie takes input of token value at second and options at third
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(201).json({
        success: true,
        message: "Logged Out"
    })

})