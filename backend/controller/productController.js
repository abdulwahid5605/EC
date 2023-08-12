// Api's

// Differnce between sync and async? "Sync Function": Executes tasks sequentially, one after the other. It blocks the program's execution until a task is completed before moving to the next task. It can cause the program to wait if a task takes time to finish, potentially leading to reduced responsiveness.

// Async Function: Initiates tasks and continues executing subsequent code without waiting for the task to finish. It utilizes callbacks, promises, or async/await to handle the completion of tasks asynchronously. This approach helps maintain program responsiveness by allowing other tasks to run while waiting for potentially time-consuming operations to complete.

// importing model of Product
const Product = require("../models/productModels");

// Post Api --Admin route
exports.createProduct = async (req, res, next) => {
  // await is used to pause the execution of a function

  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
};

// Get Api
exports.getAllProducts = async (req, res) => {
  // find method helps us to find all products stored un db
  const products = await Product.find();
  res.status(200).json({
    // this message is used just for testing that our apis are working correctly
    // message: "Route is working fine"
    success: true,
    products,
  });
};

// put Api
exports.updateProduct = async (req, res, next) => {
  // used to find the specific product using id
  // Alert!!!! Must use let here
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({ success: false, message: "Product not found" });
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
};

// Delete Api
exports.deleteProduct = async (req, res, next) => {
  // finding product using id
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({ success: false, message: "Product not Found" });
  }

  // Deleting Product
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

// Get Api-> For finding a single product with the help of id, previously we havemade an api for get all products

exports.getProductDetails = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({ success: false, message: "Product not Found" });
  }

  res.status(200).json({ success: false, product });
};
