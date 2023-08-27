import React from "react";
import "./Header.css";
import { FaCartArrowDown, FaSearch, FaUser, FaBars } from "react-icons/fa";
import logo from "../../../images/ECommerceLogo.jpg";
import { Link } from "react-router-dom";
import { useRef } from "react";

// The header component should be wrapped in router to be used
const Header = () => {
  const mainRef = useRef();
  // const barRef = useRef();

  const shownavbar = () => {
    mainRef.current.classList.toggle("responsive_nav");
  };

  // const removeBar = () => {
  //   barRef.current.classList.toggle("nav-btn-bar-remove");
  // };

  return (
    <React.Fragment>
      <nav ref={mainRef}>
        <div className="leftcon">
          <img src={logo} alt="" />
        </div>
        <ul className="middlecon">
          <li onClick={shownavbar}>
            <Link to="/" className="link">
              Home
            </Link>
          </li>
          <li onClick={shownavbar}>
            <Link to="/products" className="link">
              Products
            </Link>
          </li>
          <li onClick={shownavbar}>
            <Link to="/contact" className="link">
              Contact
            </Link>
          </li>
          <li onClick={shownavbar}>
            <Link to="/about" className="link">
              About
            </Link>
          </li>
        </ul>
        <ul className="rightcon">
          <li onClick={shownavbar} className="icons">
            <Link to="/search">
              <FaSearch className="icon" size={30} />
            </Link>
          </li>
          <li onClick={shownavbar} className="icons">
            <Link to="/cart">
              <FaCartArrowDown className="icon" size={30} />
            </Link>
          </li>
          <li onClick={shownavbar} className="icons">
            <Link to="/login">
              <FaUser className="icon" size={30} />
            </Link>
          </li>
        </ul>
        {/* cancel */}
        {/* <button className=" nav-btn-close" onClick={shownavbar}>
          <FaTimes className="icon " size={30} />
        </button> */}
      </nav>
      <button
        className="nav-btn-bar "
        // ref={barRef}
        onClick={() => {
          shownavbar();
          // removeBar();
        }}
      >
        <FaBars className="icon" size={40} color="black" />
      </button>
    </React.Fragment>
  );
};

export default Header;
