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
import Home from "./component/layout/Home/Home.js";

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

      <Footer />
    </Router>
  );
}

export default App;
