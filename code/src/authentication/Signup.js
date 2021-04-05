import React from "react";
// import "./SigninSignupReset.css";

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
              setSignUp(false);
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

export default Signup;
