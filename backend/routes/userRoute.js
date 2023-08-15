const express = require("express")
const { registerUser, loginUser, logoutUser } = require("../controller/userController")
const router = express.Router()

// post request to register user
router.route("/register").post(registerUser)

// post api to login user
router.route("/login").post(loginUser)

// get Api
router.route("/logout").get(logoutUser)

module.exports = router