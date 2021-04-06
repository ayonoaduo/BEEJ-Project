import React from "react";
import "./SigninSignupReset.css";

/* This function handles the sign up screen.
 * This screen is displayed if the user does not have an account or
 * if the user accesses the PWA for the first time.
 * Users will be required to enter their username, email and password to create an account */

function Signup({
  username,
  setUsername,
  emailRef,
  passwordRef,
  register,
  setSignUp,
  setSignIn,
}) {
  return (
    <div className="signup">
      <form>
        <h1>Sign Up</h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          type="username"
        />
        <input ref={emailRef} placeholder="Email" type="email" />
        <input ref={passwordRef} placeholder="Password" type="password" />
        <button type="submit" onClick={register}>
          Sign Up
        </button>
        <h4>
          <span className="signup__gray">Already have an account? </span>
          <span
            className="signup__link"
            onClick={() => {
              setSignUp(false); //close the sign up screen
              setSignIn(true); //display the sign in screen
            }}
          >
            Sign In.
          </span>
        </h4>
      </form>
    </div>
  );
}

export default Signup;
