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
  }, []);

  return (
    <Router>
      <Header />
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
      <Footer />
    </Router>
  );
}

export default App;
