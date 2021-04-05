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

function App() {
  const [user, setUser] = useState(null); //state to keep track of the user
  const [username, setUsername] = useState("");
  const [resetPass, setResetPass] = useState(false); //state to check if the user wants to reset password
  const [signInYes, setSignIn] = useState(true); // state to check if the user wants to sign in
  const [signUpYes, setSignUp] = useState(false); //state to check if the user wants to sign up
  const [progress, setProgress] = useState(0);
  const [address, setAddress] = React.useState("");
  const [neighborhood, setNeighborhood] = React.useState("");
  const [street, setStreet] = React.useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

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

  //function "register" is fired up when the user tries to sign up
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
          //An error happened
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
        {user ? ( //does the user exist? show app
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
          //else show authentication screen
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
