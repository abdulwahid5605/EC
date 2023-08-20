// Schema of Products. Mongo db is schema less. But in other Sql databases Schema is used to represent the table that is why Schema is used here
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
  },

  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
  },

  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },

  ratings: {
    type: Number,
    default: 0,
  },

  // we will host images on cloudinary
  // cloudinary provide us public_id of an image and url.
  images: [
    {
      public_id: {
        type: String,
        require: true,
      },
      url: {
        type: String,
        require: true,
      },
    },
  ],

  catagory: {
    type: String,
    required: [true, "Please Enter Product Catagory"],
    // we can use "enum" to specify the catagories but we will specify them in front end
  },

  noOfReviews: {
    type: Number,
    default: 0,
  },

  stock: {
    type: Number,
    // cuz when a person have decided to create a product then it is obvious that he will be having some amount of product
    default: 1,
  },

  reviews: [
    {
      user:{type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true},
      
      name: {
        type: String,
        required: true,
      },

      rating: {
        type: Number,
        required: true,
      },

      comment: {
        type: String,
        required: true,
      },
    },
  ],

  
  // let suppose there are multiple admins of the website 
  // we want to know which admin have created the product to avoid confusion in future
  // we want to get id of admin creating product automatically 

  user:{
    // it will take id of user from userSchema
    type:mongoose.Schema.ObjectId,
    // giving reference of user models
    ref:"User",
    required:true

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// we donot export the schema but we export the model of the product why?
// because model provide us the interface to interact with the database
// product is the name of model
// this will be imported in the file of apis which will help us to create products in database
module.exports = mongoose.model("Product", productSchema);
