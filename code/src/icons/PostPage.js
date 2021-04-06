import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { storage, db } from "../firebase";
import "./PostPage.css";
import Geocode from "react-geocode";
import { Button } from "@material-ui/core";
import { config } from "../config";

/* This function handles all PostPage tasks, whcih include defining your problem, uploading an image
 * requesting your gps location and then pressing submit.   */
function PostPage({
  user,
  setProgress,
  setAddress,
  address,
  setNeighborhood,
  neighborhood,
  setStreet,
  street,
}) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [, setStatus] = React.useState(""); //state to keep track of post status

  const mykey = config.API_KEY;

  const handleChange = (e) => {
    //handleChange function fires off an event
    if (e.target.files[0]) {
      //get the first file you selected
      setImage(e.target.files[0]); //set the image in state to that file
    }
  };

  const geoFunction = (event) => {
    event.preventDefault();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        Geocode.setApiKey(mykey);
        Geocode.setLanguage("en");
        Geocode.enableDebug();
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          (response) => {
            setAddress(response.results[0].formatted_address);
            for (
              let i = 0;
              i < response.results[0].address_components.length;
              i++
            ) {
              for (
                let j = 0;
                j < response.results[0].address_components[i].types.length;
                j++
              ) {
                switch (response.results[0].address_components[i].types[j]) {
                  case "neighborhood":
                    setNeighborhood(
                      response.results[0].address_components[i].long_name
                    );
                    break;
                  case "route":
                    setStreet(
                      response.results[0].address_components[i].long_name
                    );
                    break;
                  default:
                }
              }
            }
          },
          (error) => {
            console.error(error);
          }
        );
      });
    }
  };

  const handleUpload = () => {
    //access the storage in firebase, get a references to the folder images/ and store image there
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      /*provide snapshot of the image uploading progress via an equation*/
      (snapshot) => {
        //progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //error function ..
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL() //GET DOWNLOAD LINK TO THE IMAGE
          .then((url) => {
            //post image inside db
            db.collection("posts").add({
              //get server timestamp so images are sorted by time posted
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: user.displayName,
              // keyword: keyword,
              status: "Submitted",
              address: address,
              neighborhood: neighborhood,
              street: street,
            });

            setProgress(0); //reset progress
            setCaption("");
            setImage(null);
            // setKeyword("");
            setStatus("");
          });
      }
    );
  };

  return (
    <div className="postPage">
      <h1>Submit a Report</h1>
      <div className="postPage__details">
        <input
          type="text"
          placeholder="Please describe your report..."
          onChange={(event) => setCaption(event.target.value)}
          value={caption}
        />
        <div className="postPage__location">
          <button
            className="postPage__button"
            type="submit"
            id="nudge"
            // variant="raised"
            onClick={geoFunction}
          >
            Add Location
          </button>

          <input
            placeholder="Click the button to add your location or type it here..."
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>
        <input
          type="file"
          className="postPage__buttonInput"
          onChange={handleChange}
        />

        <Button
          classes={{ label: "postPage__image" }}
          onClick={handleUpload}
          component={Link}
          to="/PostPage/ReportSubmitted"
        >
          Upload
        </Button>
      </div>
    </div>
  );
}

export default PostPage;
