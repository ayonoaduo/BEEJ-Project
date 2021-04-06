import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

/* This function handles all the reports that are posted into the database and handles the 
 comments on each report posted to the database as well */

function Post({ postId, user, username, caption, imageUrl, address }) {
  /*states...how we set variables in react*/
  const [comments, setComments] = useState([]); // state to keep track of the comments
  const [comment, setComment] = useState(""); // state that sets the comment value

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      //if a post id was passed true
      unsubscribe = db
        .collection("posts") //access the post collection
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          // get a snapshot listener for that comment
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  /** This handles submitting comments into database for each individual report*/
  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName, //get the user who signed in from app.js
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment(""); //clears the box
  };

  return (
    <div className="post">
      {/*header -> avatar + username */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username} /*display the first letter if no picture*/
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      {/*user location*/}
      <div className="post__address">
        <h5>{address}</h5>
      </div>

      {/*image*/}
      <img className="post__image" src={imageUrl} alt=""></img>

      {/* username + caption */}
      <h4 className="post__text">
        <strong>{username}:</strong> {caption}
      </h4>

      {/* commments of other users  */}
      <div className="post__comments">
        {comments.map((
          comment //map through each comment
        ) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {/* comment section of a report */}
      <form className="post__commentBox">
        <input
          className="post__input"
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* post comment button */}
        <button
          disabled={!comment} //If there is no comment, the post button is disabled and cannot post
          className="post__button"
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Post;
