import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import Geocode from "react-geocode";

function Post({ postId, user, username, caption, imageUrl, keyword , address}) {
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

  // useEffect(() => {
    // Geocode.setApiKey("AIzaSyA8faJEyEJLo8QkFWHjvprH17SPVLJeO8Q");
    // Geocode.setLanguage("en");
    // // set location_type filter . Its optional.
    // // google geocoder returns more that one address for given lat/lng.
    // // In some case we need one address as response for which google itself provides a location_type filter.
    // // So we can easily parse the result for fetching address components
    // // ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
    // // And according to the below google docs in description, ROOFTOP param returns the most accurate result.
    // Geocode.setLocationType("ROOFTOP");

    // // Enable or disable logs. Its optional.
    // Geocode.enableDebug();
    // Geocode.fromLatLng(longitude, latitude).then(
    //   (response) => {
    //     const address = response.results[0].formatted_address;
    //     let city, state, country;
    //     for (let i = 0; i < response.results[0].address_components.length; i++) {
    //       for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
    //         switch (response.results[0].address_components[i].types[j]) {
    //           case "locality":
    //             city = response.results[0].address_components[i].long_name;
    //             break;
    //           case "administrative_area_level_1":
    //             state = response.results[0].address_components[i].long_name;
    //             break;
    //           case "country":
    //             country = response.results[0].address_components[i].long_name;
    //             break;
    //         }
    //       }
    //     }
    //     // console.log(city, state, country);
    //     // console.log(address);
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );

  // })
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
      <div className="post__address"><h5>{address}</h5></div>
      
      {/*image*/}
      <img className="post__image" src={imageUrl} alt=""></img>

      {/* username + caption */}
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((
          comment //map through each comment
        ) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user?.displayName ? ( //comment box only shows if you are logged in
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment} //disable if there is no comment
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            {" "}
            Post{" "}
          </button>
        </form>
      ) : (
        <h7>...Sorry you need to login to comment.</h7>
      )}
    </div>
  );
}

export default Post;
