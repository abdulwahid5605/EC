import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
// web font loader automatically downloads the google font
// we have to use web font loader in such a way that it loads the font before the loading of the page
// this can be done using useEffect
// ik bar render function call ho jaye uskay baad kiya krna ha
// hooks kabhi bhi class components kay sath kam nahi krta ha
// you have to use functional components if you want to use hooks
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/layout/Product/productDetails";
import Products from "./component/Product/Products.js";
import Search from "./component/layout/Search/Search";
import LoginSignup from "./component/User/LoginSignup.js";
import store from "./store.js";
import { loadUser } from "./Action/userAction.js";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/Header/UserOptions.js";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute.jsx";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";

function App() {
  // useEffect is hook of React
  // ik bar render function call ho jaye uskay baad kiya krna ha
  // hooks kabhi bhi class components kay sath kam nahi krta ha
  // you have to use functional components if you want to use hooks
  // we do not call it with in a function
  // we call it before the return statement

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Route exact path="/" component={Home} />

      {/*After Clicking on the product of Home page*/}
      <Route exact path="/product/:id" component={ProductDetails} />

      {/* products page */}
      <Route exact path="/products" component={Products} />

      {/* search page */}
      <Route exact path="/search" component={Search} />

      {/* seaching kartay huay */}
      <Route path="/products/:keyword" component={Products} />

      {/* login and signup both */}
      <Route exact path="/login" component={LoginSignup} />

      <ProtectedRoute exact path="/account" component={Profile} />

      <ProtectedRoute exact path="/me/update" component={UpdateProfile} />

      <ProtectedRoute
        exact
        path="/password/update"
        component={UpdatePassword}
      />

      <Route exact path="/password/forgot" component={ForgotPassword} />

      <Route exact path="/password/reset/:token" component={ResetPassword} />

      <Footer />
    </Router>
  );
}

export default App;
