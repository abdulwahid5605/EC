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
  req.body.user = req.user.id;

  // await is used to pause the execution of a function
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// Get Api
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  // find method helps us to find all products stored un db

  // req.query is the word entered by user
  // we can also write req.query.keyword where keyword will be the varible being used to store the searched word

  // pagination function resultperpage
  const resultPerPage = 7;

  // we need the total count of products in the front end
  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeature(Product.find(), req.query)
    .Search()
    .filter();
  // .pagination(resultPerPage);

  // we have removed pagination because we want to show pagination according to our filtered products
  // during filteration the products are removed so if removed products are more only few products are left on the page that dont require paging
  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  // we have replaced Product.find() method with apiFeature.query cuz in ApiFeature class this.query represents Product.find() so we have inherited that
  products = await apiFeature.query;
  res.status(200).json({
    // this message is used just for testing that our apis are working correctly
    // message: "Route is working fine"
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// put Api
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  // used to find the specific product using id
  // Alert!!!! Must use let here
  let product = await Product.findById(req.params.id);

  if (!product) {
    return new ErrorHander("Product not found", 404);
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
    return next(new ErrorHander("Product not found", 404));
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
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({ success: false, product });
});

// Customer should be able to add reviews
// we will be making two functions(creating and updating reviews) in the same api

// if you have not gave any review then create function will be used

// if you have already given a review then update function will be used

// how can customer create a review?
// in the backend the structure of reviews(array) consisit of:
// user:having id of the user, name: name of user creating the review, ratings:number me hoti han, meaning kitnay stars, comment: user writing something about the product
// we have to provide all of the above this from body and push them in our database

// what if the user have already provided the view?
// should we give him the right to update the review? yes
// How can we do that?

// exports.createProductReview=catchAsyncError(async(req,res,next)=>{
//   // we have to find the product id first
//   // destructuring
//   const {productId, ratings, comment}=req.body
//     // productId:req.body.productId,
//     // // id of user
//     // // req.user-> logged in used complete decoded data is stored init
//     // user:req.user.id,
//     // name:req.user.name,
//     // // comment and ratings from body
//     // ratings:req.body.ratings,
//     // comment:req.body.comment

//   const reviews={
//     // accessing this id below
//       user:req.user.id,
//       name:req.user.name,
//       ratings:Number(ratings),
//       comment
//   }
//   // finding the product in database and after that db will be updated
//   const product=await Product.findById(req.body.productId)

//   // we can use both find and foreach methods of an array to find out the id of the user
//   // find method will check that user id in review Schema(because we have recorded the id of user during creation of review) is equal to the id of the user "logged in"
//   const isReviewed=product.reviews.find((rev)=>{rev.user.toStringify()===req.user._id.toStringify()})

//   // just update the review if it is already given
//   if(isReviewed)
//   {
//     product.reviews.forEach((rev)=>{
//       // forEach will be performed when? When the id does not match
//       // already taking updated review from body simply updating them in the product reviews array
//       if(rev=>rev.user.toStringify()===req.user._id.toStringify())
//       {
//         rev.ratings=ratings,
//         rev.comment=comment
//       }

//     })

//   }
//   // review created and saved in db
//   else
//   {
//     // saving the value of user id, name, ratings, comment
//     product.reviews.push(reviews)
//     // we also have to update the number of reviews
//     product.noOfReviews=product.reviews.length
//   }

//   // now total ratings of a product: average of all the ratings
//   const avg=0
//   product.reviews.forEach((rev)=>{
//     avg=avg+rev.rating
//   })

//   product.ratings=avg/product.reviews.length

//   await product.save({validateBeforSave:true})

//   res.status(201).json({success:true})
// })

// practice of review api

exports.productReviews = catchAsyncError(async (req, res, next) => {
  const reviews = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(req.body.rating),
    comment: req.body.comment,
  };

  const product = await Product.findById(req.body.productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = req.body.rating), (rev.comment = req.body.comment);
      }
    });
  } else {
    product.reviews.push(reviews);
    product.noOfReviews = product.reviews.length;
  }

  // const not because values will be changed
  // const avg=0
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: true });

  res.status(201).json({ success: true });
});

// Api for getting all reviews of one product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  // we will pass id of product in query
  const product = await Product.findById(req.query.id);

  // what if someone have passed wrong query
  if (!product) {
    return next(
      new ErrorHander(`Product with the id ${req.query.id} is not found`)
    );
  }

  res.status(200).json({ success: true, reviews: product.reviews });
});

// delete user api
// user and admin both can delete their own reviews
// when we will delete the review then "ratings"(total) will be effected
// Deleting a review requires productId and id of th review we wonna delete
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
  // we will pass id of product in query
  const product = await Product.findById(req.query.productId);

  // what if someone have passed wrong query
  if (!product) {
    return next(
      new ErrorHander(`Product with the id ${req.query.productId} is not found`)
    );
  }
  // making a variable consisting all those reviews that we need
  // .filter method will be used to get those reviews that we need
  // console.log(req.query.id): this id will be provided by us and this is the id that we want to delete
  // rev._id: This has the id of all the reviews stored in the "reviews array"
  // "reviews" now consist of the reviews only we want not the deleted one

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  // if any review is deleted then it will effect the overall "ratings" and "noOfReviews" will be decreased also

  let avg = 0;

  reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });

  // overall rating of product
  const ratings = avg / reviews.length;

  const noOfReviews = reviews.length;

  // we need updation in the product therefore
  // findByIdAndUpdate: kisko update krna ha, uska kiya kiya update krna ha, formality
  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, noOfReviews },
    { run: true, useFindAndModify: false, runValidators: true }
  );

  res.status(200).json({ success: true });
});
