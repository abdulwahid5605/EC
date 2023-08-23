import React from "react";
import PlayStore from "../../../images/playstore.png";
import AppStore from "../../../images/Appstore.png";

import "./Footer.css";

const Footer = () => {
  return (
    <div className="parent">
      <div className="left">
        <h1>DOWNLOAD OUR APP</h1>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={PlayStore} alt="playstore" />
        <img src={AppStore} alt="appstore" />
      </div>
      <div className="middle">
        <h1>ECOMMERCE</h1>
        <p>High Quality is our first priority</p>
        <p>Copyrights 2023 &copy; MeAbdulWahid</p>
      </div>
      <div className="right">
        <h1>Follow Us</h1>
        <a href="https://www.instagram.com/abdulwahid5605/">Instagram</a>
        <a href="https://www.facebook.com/profile.php?id=100050616579186">
          Youtube
        </a>
        <a href="https://www.facebook.com/profile.php?id=100050616579186">
          Facebook
        </a>
      </div>
    </div>
  );
};

export default Footer;
