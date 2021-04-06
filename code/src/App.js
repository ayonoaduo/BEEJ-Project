import React, { useEffect, useState, useRef } from "react";
import Authentication from "./authentication/Authentication";
import Navigation from "./Navigation";
import HomePage from "./icons/HomePage";
import PostPage from "./icons/PostPage";
import ReportSubmitted from "./components/ReportSubmitted";
import ProfilePage from "./icons/ProfilePage";
import Settings from "./components/Settings";
import AdminHomePage from "./components/AdminHomePage";
import AdminApprovedPage from "./components/AdminApprovedPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { auth } from "./firebase";

/* This function keeps all page navigation within the session of the webpage.
Through the use of React Router, we are able to build a single-page web application with navigation
without the page refreshing as the user navigates.
React Router uses component structure to call components, which display the appropriate information.
*/
function App() {
  const [user, setUser] = useState(null); //state to keep track of the user
  const [username, setUsername] = useState(""); //state to keep track of username
  const [resetPass, setResetPass] = useState(false); //state to check if the user wants to reset password
  const [signInYes, setSignIn] = useState(true); // state to check if the user wants to sign in
  const [signUpYes, setSignUp] = useState(false); //state to check if the user wants to sign up
  const [progress, setProgress] = useState(0); //state to keep track of the progress bar
  const [address, setAddress] = React.useState(""); //state to set the address value
  const [neighborhood, setNeighborhood] = React.useState(""); //state to set the neighborhood value
  const [street, setStreet] = React.useState(""); //state to set the street value
  const emailRef = useRef(null); //value for the user's email
  const passwordRef = useRef(null); //value for the user's password

  useEffect(() => {
    //listener for any authentication state change
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in..
        console.log(authUser); //check the console if someone is logged in
        setUser(authUser); //cookie tracking to keep you logged in

        if (authUser.displayName) {
          //dont update the username if they dont have a display name
        } else {
          //if we just created someone...
          return authUser.updateProfile({
            displayName: username, //set the display name in firebase
          });
        }
      } else {
        //user logged out...
        setUser(null);
      }
    });
    return () => {
      //perform some cleanup actions before restarting useEffect to avoid
      //duplicate listeners
      unsubscribe();
    };
  }, [user, username]);

  /*function "register" is fired up when the user tries to sign up
  The function creates the user in firebase*/
  const register = (e) => {
    e.preventDefault(); //prevent refresh when button is clicked

    auth
      .createUserWithEmailAndPassword(
        emailRef.current.value, //get the email value typed
        passwordRef.current.value //get the password
      )
      //send Email verification
      .then(
        function (authData) {
          authData.user.sendEmailVerification();
        },
        //if email wasnt sent
        function (error) {
          //An error happened. Print error message to console
          alert(error.message);
        }
      )

      .then((authUser) => {
        console.log(authUser);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  /*  function "signIn" is fired up when the user tries to sign in
  The function signs the user into the app */
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {
        console.log(authUser);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="app">
      <Router>
        {user ? ( //does the user exist? show app features except authentication screen
          <div>
            {/* display the navigation bar if the user exists */}
            <Navigation
              user={user}
              setSignIn={setSignIn}
              setSignUp={setSignUp}
              progress={progress}
              setProgress={setProgress}
            />

            <Switch>
              {/* React Router uses component structure to call components, which display the appropriate information */}
              {/* The following route statements call the appropriate components that display the required info for each page */}
              <Route exact path="/">
                <HomePage
                  user={user}
                  username={username}
                  address={address}
                  setAddress={setAddress}
                  setStreet={setStreet}
                  street={street}
                  setNeighborhood={setNeighborhood}
                  neighborhood={neighborhood}
                />
              </Route>

              <Route exact path="/Homepage">
                <HomePage
                  user={user}
                  username={username}
                  address={address}
                  setAddress={setAddress}
                  setStreet={setStreet}
                  street={street}
                  setNeighborhood={setNeighborhood}
                  neighborhood={neighborhood}
                />
              </Route>

              <Route exact path="/PostPage">
                <PostPage
                  user={user}
                  progress={progress}
                  setProgress={setProgress}
                  address={address}
                  setAddress={setAddress}
                  neighborhood={neighborhood}
                  setNeighborhood={setNeighborhood}
                  street={street}
                  setStreet={setStreet}
                />
              </Route>

              <Route exact path="/ProfilePage">
                <ProfilePage
                  user={user}
                  username={username}
                  address={address}
                  setAddress={setAddress}
                />
              </Route>

              <Route exact path="/PostPage/ReportSubmitted">
                <ReportSubmitted />
              </Route>

              <Route exact path="/ProfilePage/Settings">
                <Settings
                  user={user}
                  setSignIn={setSignIn}
                  setSignUp={setSignUp}
                  setResetPass={setResetPass}
                />
              </Route>

              <Route exact path="/ProfilePage/Settings/AdminHomePage">
                <AdminHomePage user={user} />
              </Route>

              <Route exact path="/ProfilePage/Settings/AdminApprovedPage">
                <AdminApprovedPage user={user} />
              </Route>
            </Switch>
          </div>
        ) : (
          //else, if the user does not exist or is signed out, show the authentication screen
          <Authentication
            signUpYes={signUpYes}
            setSignUp={setSignUp}
            signInYes={signInYes}
            setSignIn={setSignIn}
            signIn={signIn}
            register={register}
            setUsername={setUsername}
            username={username}
            emailRef={emailRef}
            passwordRef={passwordRef}
            resetPass={resetPass}
            setResetPass={setResetPass}
          />
        )}
      </Router>
    </div>
  );
}

export default App;
