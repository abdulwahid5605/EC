// npm init: we write this command in the root directory to create a package.json file
// install express, mongoose and dotenv
// package-lock.json file will be created after that and libraries will be installed
// express js is framework of node js that simplifies the process of building apis
const express = require("express");
const app = express();

// importing "cookie-parser"(middleware) to access the cookie value from body 
const cookieParser = require("cookie-parser")

// this function is used to set the statuscode and message with the help of class errorHander
const errorMiddleware = require("./middleware/error")

const fileUplaod=require("express-fileupload")

const bodyParser=require("body-parser")

// middleware
app.use(express.json());
app.use(cookieParser())
app.use(fileUplaod())
app.use(bodyParser.urlencoded({extended:true}))

// Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute")
const order=require("./routes/orderRoute")

// It acts as a middleware. Middleware is a function having access to request and response and can modify any request or response
// .use is a method to add middlewares
app.use("/api/v1", product);
app.use("/api/v1", user)
app.use("/api/v1",order)

// using errorHander Middleware here
app.use(errorMiddleware)



module.exports = app;
