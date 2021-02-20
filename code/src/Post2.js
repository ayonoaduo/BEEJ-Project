import React, {useState, useEffect} from 'react'
import { db } from './firebase';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import firebase from 'firebase';
import { UserContext , useContext} from 'react';

function Post2({postId, uid, user, username, caption, keyword, imageUrl}) {

 // const currentUser = useContext(UserContext);
  const [comments, setComments] = useState([]); //keep track of the comments
  const [comment, setComment] = useState('');
  useEffect(()=>{
    let unsubscribe;
    if (postId) //if a post id was passed true
    {
      unsubscribe = db
      .collection("posts") //access the post collection
      .doc(postId)
      .collection("comments")
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => { // get a snapshot listener for that comment
		    setComments(snapshot.docs.map((doc) => doc.data())); 
      });}}
  );

  //function that submits comment into database for a specific post
  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,  //get the user who signed in from app.js
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment(''); //clears the box
  }


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
        <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
  
        <center>
        <button className="post__button " type="submit"> Decline </button>
        <button className="post__button " type="submit"> Approve </button>
        </center>

      </div>
    )
}

export default Post2
