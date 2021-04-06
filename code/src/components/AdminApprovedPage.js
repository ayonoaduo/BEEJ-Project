import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "./AdminApprovedPage.css";
import AdminApprovedPost from "../AdminApprovedPost";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";

/* This function handles the Approved reports page.
 * This screen is displayed when a user clicks the "Approved Reports" button on the Submitted reports page. */

function AdminApprovedPage(user) {
  /*states...how we set variables in react*/
  const [posts, setPosts] = useState([]);

  //useEffect runs a piece of code based on a specific
  //condition
  useEffect(() => {
    //this is where the code runs
    //snapshot is a powerful listener that will run the code when a post is made
    db.collection("posts")
      //only show posts that are approved
      .where("status", "==", "Approved")
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
    <div className="adminApprovedPage">
      {/* Button for small devices.
      Takes the user back to the submitted reports page when clicked */}
      <IconButton
        size="large"
        classes={{ label: "adminApprovedPage__button d3-block d3-lg-none" }}
        component={Link}
        to="/ProfilePage/Settings/AdminHomePage"
      >
        <DescriptionOutlinedIcon />
      </IconButton>

      {/* Button for large devices
      Takes the user back to the submitted reports page when clicked  */}
      <Button
        size="large"
        endIcon={<DescriptionOutlinedIcon />}
        classes={{ label: "adminApprovedPage__buttonLarge d3-none d3-lg-flex" }}
        component={Link}
        to="/ProfilePage/Settings/AdminHomePage"
      >
        Submitted Reports
      </Button>
      <div className="adminApprovedPage__posts">
        <div className="adminApprovedPage_postsRight">
          <h1>Reports In Progress</h1>
          {/*Posts*/}
          {
            /*loop through posts in state*/
            posts.map(({ id, post }) => (
              //the key allows the page to only refresh the new post, not all the posts. since each post has its own key
              <AdminApprovedPost
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                address={post.address}
              ></AdminApprovedPost>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default AdminApprovedPage;
