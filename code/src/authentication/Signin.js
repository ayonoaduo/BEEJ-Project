import React from "react";
import "./SigninSignupReset.css";

/* This function handles the Sign in screen.
 * This screen is displayed when a user is signed out or tries to sign in
 * Users will be able to input their credentials (email and password) to sign in to the app. */

const Signin = ({
  signIn,
  emailRef,
  passwordRef,
  setSignIn,
  setResetPass,
  setSignUp,
}) => {
  return (
    <div className="signin">
      <form>
        <h1>Sign In</h1>

        <input ref={emailRef} placeholder="Email" type="email" id="email" />
        <input
          ref={passwordRef}
          placeholder="Password"
          type="password"
          id="password"
        />
        <button type="submit" onClick={signIn}>
          Sign In
        </button>
        <h4>
          <span className="signin__gray">New to The Link? </span>
          <span
            className="signin__link"
            onClick={() => {
              setSignUp(true);
              setSignIn(false);
            }}
          >
            Sign Up now.
          </span>

          <br></br>
          <br></br>
          <br></br>
          <span className="signin__gray">Forgot your password? </span>
          <span
            className="signin__link"
            onClick={() => {
              setResetPass(true); //display the reset password screen
              setSignIn(false); //close the sign in screen
            }}
          >
            Reset here.
          </span>
        </h4>
      </form>
    </div>
  );
};

export default Signin;
