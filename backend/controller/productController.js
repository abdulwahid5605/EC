// Api's

// Differnce between sync and async? "Sync Function": Executes tasks sequentially, one after the other. It blocks the program's execution until a task is completed before moving to the next task. It can cause the program to wait if a task takes time to finish, potentially leading to reduced responsiveness.

// Async Function: Initiates tasks and continues executing subsequent code without waiting for the task to finish. It utilizes callbacks, promises, or async/await to handle the completion of tasks asynchronously. This approach helps maintain program responsiveness by allowing other tasks to run while waiting for potentially time-consuming operations to complete.

// Error Handling
// it is a good practice to use try catch block with async function. If we will use try catch seperately with each function then it will increase the lines of code. Therefore we are making a single function and will call them again and again. We have made the function in middleware which act as a try catch block.

// using try catch will help the server to work rather then become crashed in case if someone have not provided the required details of product  

// importing model of Product
const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModels");
const ApiFeature = require("../utils/apiFeatures");
const ErrorHander = require("../utils/errorHander");

// Post Api --Admin route
exports.createProduct = catchAsyncError(async (req, res, next) => {
  // let suppose there are multiple admins of the website 
  // we want to know which admin have created the product to avoid confusion in future
  // we want to get id of admin creating product automatically 
  // "req.user" consist of decodedData of user we have assigned in "isAuthenticatedUser"
  // decoded data also has the id of user
  // hence storing user id in user of schema
  req.body.user=req.user.id

  // await is used to pause the execution of a function
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// Get Api
exports.getAllProducts = catchAsyncError(async (req, res) => {
  // find method helps us to find all products stored un db

  // req.query is the word entered by user
  // we can also write req.query.keyword where keyword will be the varible being used to store the searched word

  // pagination function resultperpage
  const resultPerPage = 5

  // we need the total count of products in the front end 
  const productCount = await Product.countDocuments()

  const apiFeature = new ApiFeature(Product.find(), req.query).Search().filter().pagination(resultPerPage)

  // we have replaced Product.find() method with apiFeature.query cuz in ApiFeature class this.query represents Product.find() so we have inherited that
  const products = await apiFeature.query
  res.status(200).json({
    // this message is used just for testing that our apis are working correctly
    // message: "Route is working fine"
    success: true,
    products,
    productCount
  });
});

// put Api
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  // used to find the specific product using id
  // Alert!!!! Must use let here
  let product = await Product.findById(req.params.id);

  if (!product) {
    return new ErrorHander("Product not found", 404)

  }

  // req.body->is the data that we provide to the body to update
  // new:true->return the updated document
  // useFindAndModify-> indicates that mongoose should use find and update method internally
  //
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  res.status(201).json({
    // this is our update product
    success: true,
    product,
  });
});

// Delete Api
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  // finding product using id
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404))
  }

  // Deleting Product
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Get Api-> For finding a single product with the help of id, previously we havemade an api for get all products

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404))
  }

  res.status(200).json({ success: false, product });
});


// 