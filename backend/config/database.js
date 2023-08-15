const mongoose = require("mongoose");

const connectDatabase = () => {
  // Url(localhost) added and objects are set to true
  // then: what to do when connection is established? print on console.
  mongoose
    .connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb is connected with server ${data.connection.host}`);
    })
    // we have dealt with error in "server.js" using unhandled promise rejection
    // .catch((err) => {
    //   console.log(err);
    // });
};

module.exports = connectDatabase;
