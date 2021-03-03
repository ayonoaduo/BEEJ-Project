import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./UserPost.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

function UserPost({
  postId,
  user,
  username,
  caption,
  imageUrl,
  status,
  reason,
  keyword,
  uid,
  displayName,
}) {
  const [comments, setComments] = useState([]); //keep track of the comments
  const [comment, setComment] = useState("");

  useEffect(() => {
    // const sb = firebase.firestore();
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

  //function that submits comment into database for a specific post
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
    <div className="userPost">
      {/*header -> avatar + username */}
      <div className="userPost__header">
        <Avatar
          className="userPost__avatar"
          alt={username} /*display the first letter if no picture*/
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
        <div className = "userPost_status">
          <h3>{status}</h3>
      
      </div>
      </div>
      


      {/*image*/}
      <img className="userPost__image" src={imageUrl} alt=""></img>

      {/* username + caption */}
      <h4 className="userPost__text">
        <strong>{username}</strong> {caption}
      </h4>
      <div className="userPost__reason">
      <h4>Reason for decline: {reason}</h4>
      </div>


      <div className="userPost__comments">
        {comments.map((
          comment //map through each comment
        ) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>


      {user?.displayName ? ( //comment box only shows if you are logged in
        <form className="userPost__commentBox">
          <input
            className="userPost__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment} //disable if there is no comment
            className="userPost__button"
            type="submit"
            onClick={postComment}
          >
            
            Post
          </button>
        </form>
      ) : (
        <h7>...Sorry you need to login to comment.</h7>
      )}
    </div>
  );
}

export default UserPost;