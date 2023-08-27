// In reducer we perform the entire functionality
// "What to do"?

// products will be fetched in this array

// declaring constants
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../constants/productConstants";

// in parameter of function we define the initial state first and then the actions that are to be called in switch statement
export const productReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCT_REQUEST:
      return {
        // loading simply is used to show the customer that the product is in the way to be fetched from backend
        loading: true,
        product: [],
      };
    // when the products are fetched obviously then there is no need of laoding
    // payload is having entire data that we are passing from the action using axios
    case ALL_PRODUCT_SUCCESS:
      return {
        loading: false,
        product: action.payload.products,
        productCount: action.payload.productCount,
        resultPerPage: action.payload.resultPerPage,
        filteredProductsCount: action.payload.filteredProductsCount,
      };
    // if the products are failed to be fetched then we have to return the error that occured
    case ALL_PRODUCT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
        // product:{}
      };

    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload.product,
      };

    case PRODUCT_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
