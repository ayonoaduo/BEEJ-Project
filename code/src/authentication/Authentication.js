import React from "react";
import logo from "../images/beej-white.png";
import "./Authentication.css";
import Signin from "./Signin";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";

/* This function handles the authentication screen.
 * This screen is displayed when a user is signed out or does not exist
 * Users will be able to navigate between the sign in, sign up, and reset password screen. */

function Authentication({
  resetPass,
  setResetPass,
  signUpYes,
  setSignUp,
  signInYes,
  setSignIn,
  emailRef,
  passwordRef,
  username,
  setUsername,
  register,
  signIn,
}) {
  return (
    <div className="authentication">
      <div className="authentication__background">
        <img className="authentication__logo" src={logo} alt="" />

        <div className="authentication__header">
          <h1>Bridging the gap of communication.</h1>
        </div>

        {/* display sign in button at the top when user is on sign up page*/}
        {!signInYes ? (
          <>
            <button
              onClick={() => {
                setSignIn(true);
                setSignUp(false);
                setResetPass(false);
              }}
              className="authentication__button"
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            {/* else display sign up button at the top*/}
            <button
              onClick={() => {
                setSignUp(true);
                setSignIn(false);
                setResetPass(false);
              }}
              className="authentication__button"
            >
              Sign Up
            </button>
          </>
        )}

        {/* display page */}
        <div className="authentication__gradient" />
      </div>

      <div className="authentication__body">
        {signInYes ? (
          /* display the sign in screen if signInYes state is true */
          <Signin
            emailRef={emailRef}
            passwordRef={passwordRef}
            signIn={signIn}
            setSignIn={setSignIn}
            setResetPass={setResetPass}
            setSignUp={setSignUp}
          />
        ) : (
          <h12></h12>
        )}

        {signUpYes ? (
          /* else display the sign up screen if signUpYes state is true*/
          <Signup
            emailRef={emailRef}
            passwordRef={passwordRef}
            username={username}
            setUsername={setUsername}
            register={register}
            setSignIn={setSignIn}
            setSignUp={setSignUp}
          />
        ) : (
          <h12></h12>
        )}

        {resetPass ? (
          /* display the ResetPassword screen if resetPass state is true */
          <ResetPassword
            emailRef={emailRef}
            setResetPass={setResetPass}
            setSignIn={setSignIn}
          />
        ) : (
          <h12></h12>
        )}
      </div>
    </div>
  );
}

export default Authentication;
