import { combineReducers, legacy_createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  productDetailsReducer,
  productReducer,
} from "./Reducer/productReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  forgotPasswordReducer,
  profileReducer,
  userReducer,
} from "./Reducer/userReducer";

// combining all reducer and creating one that will be exported
const reducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
});

// initial state will be empty
const initialState = {};

// passing thunk in middleware
const middleware = [thunk];

// creating store through which every component can import the functions performed through  reducers and actions
const store = legacy_createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
