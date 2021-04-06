import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./ProfilePost.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

/* This functiion  displays the profile page of the signed in user.
 * The user will be able to see every report submitted by them including the status
 * and comments on each report. If a report has been declined, the user will be abel to see the
 * reason for declining. */
function ProfilePost({
  postId,
  user,
  username,
  caption,
  imageUrl,
  status,
  reason,
  address,
}) {
  const [comments, setComments] = useState([]); //keep track of the comments
  const [comment, setComment] = useState("");

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
    <div className="profilePost">
      {/*header -> avatar + username */}
      <div className="profilePost__header">
        <Avatar
          className="profilePost__avatar"
          alt={username} /*display the first letter if no picture*/
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <div className="profilePost__address">
        <h5>{address}</h5>
      </div>

      {/*image*/}
      <img className="profilePost__image" src={imageUrl} alt=""></img>

      {/* username + caption */}
      <h4 className="profilePost__text">
        <strong>{username}:</strong> {caption}
      </h4>

      <div className="profilePost__comments">
        {comments.map((
          comment //map through each comment
        ) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      <form className="profilePost__commentBox">
        <input
          className="profilePost__input"
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          disabled={!comment} //disable if there is no comment
          className="profilePost__button"
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>

      <div className="profilePost__tracker">
        <hr></hr> {/*straight line */}
        {status === "Submitted" ? (
          <div className="profilePost__trackerSubmitted">
            <h3>Report Status:</h3> <p>{status}</p>
          </div>
        ) : (
          <h12></h12>
        )}
        {status === "Approved" ? (
          <div className="profilePost__trackerApproved">
            <h3>Report Status:</h3> <p>In Progress</p>
          </div>
        ) : (
          <h12></h12>
        )}
        {status === "Solved" ? (
          <div className="profilePost__trackerSolved">
            <h3>Report Status:</h3> <p>{status}</p>
          </div>
        ) : (
          <h12></h12>
        )}
        {status === "Declined" ? (
          <div className="profilePost__trackerDeclined">
            <h3>Report Status:</h3> <p>{status}</p>
          </div>
        ) : (
          <h12></h12>
        )}
        {status === "Declined" ? (
          <div className="profilePost__declineReason">
            <h3>Reason for Decline:</h3> <p>{reason}</p>
          </div>
        ) : (
          <h12></h12>
        )}
      </div>
    </div>
  );
}

export default ProfilePost;
