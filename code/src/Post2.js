import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

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
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function Post2({ postId, uid, user, username, caption, keyword, imageUrl }) {
  /*states...how you set variables in react*/
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  // const currentUser = useContext(UserContext);
  const [comments, setComments] = useState([]); //keep track of the comments
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
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
  });

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

  const addStatus = (event) => {
    event.preventDefault(); //avoid refresh when upload button is clicked
    var docRef = db.collection("posts").doc(postId);
    docRef.update({
      status: "Approved",
    });
    setOpen(false);
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

      {/*image*/}
      <img className="post__image" src={imageUrl} alt=""></img>
      {/* username + caption */}
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      <Modal
        open={open} //state to keep track if its open
        onClose={() => setOpen(false)} //onClose method. closes the model when anywhere else on the screen is clicked
      >
        <div style={modalStyle} className={classes.paper}>
          <h4>Are you sure?</h4>
          <button type="submit" onClick={addStatus}>
            Yes
          </button>
          <button type="submit" onClick={() => setOpen(false)}>
            {" "}
            No
          </button>
        </div>
      </Modal>

      <center>
        <button className="post__button " type="submit">
          {" "}
          Decline{" "}
        </button>
        <button
          className="post__button "
          type="submit"
          onClick={() => setOpen(true)}
        >
          {" "}
          Approve{" "}
        </button>
      </center>
    </div>
  );
}

export default Post2;
