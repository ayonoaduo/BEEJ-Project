import React, { useState, useEffect } from "react";
import "./Home.css";
import logo from "./beej.png";
import Post2 from "./Post2";
import { db, auth } from "./firebase";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";

import { storage } from "./firebase";
import { Link } from "react-router-dom";
import "./ImageUpload.css";

/*Styling for modal. Code from material-ui.com*/
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function AdminPage() {
  /*states...how you set variables in react*/
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [username] = useState("");
  const [user, setUser] = useState(null); //state to keep track of the user

  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  //imageupload functions

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      //listen anytime an authentication change happens
      if (authUser) {
        //user has logged in...
        console.log(authUser); //check the console if someone is there or not
        setUser(authUser); //Cookie tracking to keep you logged in. Captures the user in our state.

        if (authUser.displayName) {
          //dont update username if they dont have a display name
        } else {
          // if we just created someone...
          return authUser.updateProfile({
            displayName: username, //set their display name in firebase
          });
        }
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    return () => {
      //perform some cleanup actions before restarting the useEffect. This to avoid duplicate listeners.
      unsubscribe();
    };
  }, [user, username]);

  //useEffect runs a piece of code based on a specific condition
  useEffect(() => {
    //this is where the code runs
    //snapshot is a powerful listener that will run the code when a post is made
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  }, []); //[] symbol means run the code once

  const HomeLink = (event) => {
    window.location = "/";
  };
  return (
    <div className="app">
      {/*using BEM naming convetion*/}

      <div className="app__header">
        <img
          className="app__headerImage"
          src={logo}
          alt=""
          width="60px"
          height="60px"
          onClick={HomeLink}
        />

        {/**********************************************NEWWWWWWWWW***********************************************************************/}

        {user?.displayName ? ( //if the user exists, show a Logout button
          <div>
            <button onClick={() => auth.signOut()}>Logout</button>
          </div>
        ) : (
          //else, show a sign up button
          <div className="app__loginContainer">
            <button onClick={() => setOpenSignIn(true)}>Sign In</button>
            <button onClick={() => setOpen(true)}>Sign Up</button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app_postsRight">
          {/*Posts*/}
          {
            /*loop through posts in state*/
            posts.map(({ id, post }) => (
              //the key allows the page to only refresh the new post, not all the posts. since each post has its own key
              <Post2
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                keyword={post.keyword}
              ></Post2>
            ))
          }
        </div>
      </div>

      {user?.displayName ? ( //access only when user is signed in
        <div className="app__bottom">
          <BottomNavigation>
            <BottomNavigationAction
              label="Home"
              icon={<HomeOutlinedIcon />}
              component={Link}
              to="/AdminPage"
            />
            <BottomNavigationAction
              label="Active Reports"
              icon={<CheckCircleOutlineOutlinedIcon />}
              component={Link}
              to="/"
            />
          </BottomNavigation>
        </div>
      ) : (
        <h7></h7> //hide navigation bar when user is not signed in
      )}
    </div>
  );
}

export default AdminPage;
