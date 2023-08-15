// "router" is provided by "express js"
// so importing express js
const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controller/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

// storing "router of express" js in "router" variable
const router = express.Router();

// routes are used to control http requests
// get request
router.route("/products").get( getAllProducts);

// post request
// to create a product role should be 'admin(authorizedRole)' and user should be logged in 
router.route("/product/new").post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);

// put request+ delete request + get request
// all apis need the id to work, so same url, applying api on the same url
router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct)
  .get(getProductDetails);
// this router is imported in app.js
module.exports = router;
