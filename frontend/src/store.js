import { combineReducers, legacy_createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { productReducer } from "./Reducer/productReducer";
import { composeWithDevTools } from "redux-devtools-extension";

// combining all reducer and creating one that will be exported
const reducer = combineReducers({
  products: productReducer,
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
