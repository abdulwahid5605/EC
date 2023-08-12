// npm init: we write this command in the root directory to create a package.json file
// install express, mongoose and dotenv
// package-lock.json file will be created after that and libraries will be installed
// express js is framework of node js that simplifies the process of building apis
const express = require("express");
const app = express();

// middleware
app.use(express.json());

// Route imports
const product = require("./routes/productRoute");

// It acts as a middleware. Middleware is a function having access to request and response and can modify any request or response
app.use("/api/v1", product);

module.exports = app;
