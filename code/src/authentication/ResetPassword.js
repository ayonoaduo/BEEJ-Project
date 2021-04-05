import React from "react";
import "./SigninSignupReset.css";
import { auth } from "../firebase";
function ResetPassword({ emailRef, setResetPass, setSignIn }) {
  // function to reset password. It is called when the reset button is clicked
  const reset = (e) => {
    e.preventDefault();
    auth
      .sendPasswordResetEmail(document.getElementById("email").value)
      .then(function (user) {
        alert("Please check your email to reset your password");
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  return (
    <div className="resetPassword">
      <form>
        <h1>Reset Password</h1>
        <input id="email" placeholder="Email" type="email " />
        <button type="submit" onClick={reset}>
          Reset
        </button>
        <h4>
          <span className="resetPassword__gray">Remember your password? </span>
          <span
            className="resetPassword__link"
            onClick={() => {
              setResetPass(false);
              setSignIn(true);
            }}
          >
            Sign In.
          </span>
        </h4>
      </form>
    </div>
  );
}

export default ResetPassword;
