import React, { useEffect, useRef, useState } from "react";
import "./LoginSignup.css";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { Link } from "react-router-dom";
// redux work
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, login, registerUser } from "../../Action/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";

const LoginSignup = ({ history }) => {
  // redux
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  // useRef
  const switcherTab = useRef(null);
  const loginTab = useRef(null);
  const registerTab = useRef(null);

  //   useState
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
  const [avatar, setAvatar] = useState();

  //   In register form this is the initial state of the variables but as the user enters data then using e.target.value we will update the data
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  //   picking out values from the user
  const { name, email, password } = user;

  //   Functions
  const switchTabs = (event, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");
      loginTab.current.classList.remove("shiftToLeft");
      registerTab.current.classList.remove("shifToNeutralForm");
    }
    if (tab === "register") {
      switcherTab.current.classList.remove("shiftToNeutral");
      switcherTab.current.classList.add("shiftToRight");
      loginTab.current.classList.add("shiftToLeft");
      registerTab.current.classList.add("shifToNeutralForm");
    }
  };
  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    // removing default behaviours of form
    e.preventDefault();

    // passing the data from above user variable consisting of name, email and password
    const myForm = new FormData();
    myForm.set("name", name);
    // "email"=name of input tag
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(registerUser(myForm));
  };

  const registerDataChange = (e) => {
    // for avatar
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      // onlaod function of FileReader consist of three stages
      // initial state
      // processing state
      // final state
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    // for name, email and password
    else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      history.push("/account");
    }
  }, [dispatch, error, alert, history, isAuthenticated]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="loginSignupComponent">
            <div className="loginSignupBox">
              <div className="top-buttons">
                <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
              </div>
              <button className="moving-button" ref={switcherTab}></button>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div>
                  <MailOutlineIcon />
                  <input
                    type="Email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                    }}
                  />
                </div>
                <Link to="/password/forgot">Forgot Password?</Link>
                <input type="submit" value="Login" className="loginSubmit" />
              </form>
              {/* ------------ */}
              {/* multipart/form-data=it is used when during submission we ara having an image */}
              <form
                className="signupform"
                ref={registerTab}
                onSubmit={registerSubmit}
                encType="multipart/form-data"
              >
                <div>
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={name}
                    required
                    onChange={registerDataChange}
                  />
                </div>
                <div>
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                    required
                  />
                </div>
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                    required
                  />
                </div>
                <div id="registerImage">
                  <img src={avatarPreview} alt="AvatarPreview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Register"
                  className="signupSubmit"
                  onChange={registerDataChange}
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginSignup;
