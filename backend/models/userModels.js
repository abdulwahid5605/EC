// bcrypt: Anyone(including admin) can read the data(including user password) data from mongodb compass. bcrypt is used to hash the password

// jsonwebtoken: Used to generate token

// cookie-parser: jsonwebtoken is stored in cookie because it is not accessible to the user through frontend. If cookie parser is not used then token will be stored in "local storage" and anyone can access that which can be harmful

// validator: It checks that the user have entered the correct email or not

// We will encrypt the password before saving it in the user model

// updation of user email, name and avatar would be seperate from updation of password
// snario: what if the password is hashed once during the creation of the user and the user update the profile(except password) then hashed password will hash again(problem). Therefore we will apply the condition that if the password is not modified(e.g not updated) then no action will be performed otherwise it will be hashed 

const mongoose = require("mongoose")
// validator checks that the email is in correct format or not
const validator = require("validator")
// password hashing library
const bcrypt = require("bcryptjs")
// jwt token
const jwt = require("jsonwebtoken")
// crypto used to create the reset token again. It is a prebuilt js module not 
const crypto=require("crypto") 


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [30, "Name cannot exceed more then 30 characters"],
        minLength: [4, "Name should be more then 4 characters"]
    },
    email: {
        type: String,
        required: true,
        // unique must be true otherwise same emails would be registered!!!
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password should be greater then eight characters"],
        // password should be disappeared when anyone views the users even an admin
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },

    createdAt:{
        type:Date,
        default:Date.now
    },


    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

// password encryption
// userSchema.pre(save)-> it shows before we save the schema what to do
// we have not used the arrow function here because it do not take "this"
userSchema.pre("save", async function (next) {
    // password hased and "power 10" is given which shows  the strength
    // "password":it is the schema
    if (!this.isModified("password")) {
        // no hashing again if the password is not updated or modified
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// when the user registers then he should be directly logged. It will look foolish to seperately login yourself after regiter
// Jwt Token: Token will be generated and stored in cookies. it will help the user to access the routes(user will be having the power of login)
// JwtToken is the method of userScheme
// jwt.sign method will be used to create the token. It take user id, secret key and expiry time as a input
// what is the purpose of "secret key"? It should not be disclosed. If it is disclosed then any unauthencticated user will get access your id and can create fake accounts
// we can not use arrow function here as well because it do not take the value of this
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

// creating the function to match the password entered by user and stored password in schema
// bcrypt will be used it automatically compares the hashed and non hashed password
// can not use arrow function because "this" wont work
// in compare function of the bcrypt we write the user entered password first and then the hashed password

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Forgot password
// Working: We will generate a "token" again this will not be "jsonWebToken"
// It will be genrated and will send to the user who has clicked on "forgot password" to update the password again
// what is crypto? it is used to generate the token again!
// How it generates? It takes some "random bytes" from memory.On every attempt the random bytes generated will be different hence every hashed value will be different. It is unorganized therefore we convert it into "hex code" form(easily understandable)
// sha256 algorithm: it hashes the "hex code". The resultant hashed value is called "token"
// it will be sent to the user to reset his/her password

userSchema.methods.getResetPasswordToken=function()
{
    // Generating token
    const resetToken=crypto.randomBytes(20).toString("hex")

    // console.log(resetToken)

    // hashing the token
    // we are hasing the token so the admin can not view the exact value of token
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")

    // what if the user gets the token? it should be have an expiry time. 15 minutes would be more then enough
    // Date.now() takes time in milliseconds

    this.resetPasswordExpire= Date.now()+15*60*1000
    // console.log(this.resetPasswordToken)


    // what the fuck? why we have not returned this.resetPasswordToken????
    // because only user should be able to view the value of exact token. In database the hased token is stored only

    return resetToken;
} 

module.exports = mongoose.model("User", userSchema)