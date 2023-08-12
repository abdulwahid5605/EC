// server is build with the help of express js

// importing express from app.js file
const app = require("./app");

// importing function used to connect db
const connectDatabase = require("./config/database");

// importing dotenv library. How this file will come to know the values of variable that we are giving in config.env file?
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

// it is necessary to add connectDatabase function afterthe dotenv file because "process.env.DB_URI" is the variable that is being imported from dotenv file
connectDatabase();

// listen is used to start the web server. It listens all of the http requests
// it requires a port number. We are giving the values of variables using "dotenv" library
app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});
