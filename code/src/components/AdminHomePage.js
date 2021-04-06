import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "./AdminHomePage.css";
import AdminPost from "../AdminPost";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";

/* This function handles the Submitted reports page.
 * This page is displayed when a user signs in as an admin with the authorization code on the settings page. */

function AdminHomePage(user) {
  /*states...how we set variables in react*/
  const [posts, setPosts] = useState([]);

  //useEffect runs a piece of code based on a specific
  //condition
  useEffect(() => {
    //this is where the code runs
    //snapshot is a powerful listener that will run the code when a post is made
    db.collection("posts")
      .where("status", "==", "Submitted")
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
  }, []); //[] symbol means run the code once;

  return (
    <div className="adminHomePage">
      {/* Button for small devices 
        Takes the user back to the Approved reports page when clicked */}

      <IconButton
        size="large"
        classes={{ label: "adminHomePage__button d2-block d2-lg-none" }}
        component={Link}
        to="/ProfilePage/Settings/AdminApprovedPage"
      >
        <CheckCircleOutlinedIcon />
      </IconButton>

      {/* Button for large devices 
        Takes the user back to the Approved reports page when clicked */}
      <Button
        size="large"
        endIcon={<CheckCircleOutlinedIcon />}
        classes={{ label: "adminHomePage__buttonLarge d2-none d2-lg-flex" }}
        component={Link}
        to="/ProfilePage/Settings/AdminApprovedPage"
      >
        Approved Reports
      </Button>
      <div className="adminHomePage__posts">
        <div className="adminHomePage_postsRight">
          <h1>Admin Homepage</h1>
          {/*Posts*/}
          {
            /*loop through posts in state*/
            posts.map(({ id, post }) => (
              //the key allows the page to only refresh the new post, not all the posts. since each post has its own key
              <AdminPost
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                address={post.address}
              ></AdminPost>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
