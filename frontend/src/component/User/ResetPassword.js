import React, { Fragment, useEffect, useState } from "react";
import "./ResetPassword.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, resetPassword } from "../../Action/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";
import MetaData from "../MetaData";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";

const ResetPassword = ({ history, match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(match.params.token, myForm));
  };

  useEffect(() => {
    if (error) {
      console.log("error", error);
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Password Reset Successfully");
      history.push("/login");
    }
  }, [dispatch, error, alert, history, success]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Reset Password" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Reset Password</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </div>
                <input
                  type="submit"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;
