import React, { useState } from "react";
import { db } from "./firebase";
import "./AdminPost.css";
import Avatar from "@material-ui/core/Avatar";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import logo from "./images/beej-black.png";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import firebase from "firebase";

/* This function allows the City of Regina employees to see all the submitted reports
 * The employee can then choose to approve or decline a report
 * If a report is approved, the status of the report will change and the report will now be displayed
 * on the citizen's homepage. If a report id is declined, the satus of the report will change and the report will
 * leave the Admin homepage */
function AdminPost({
  postId,
  user,
  username,
  caption,
  imageUrl,
  address,
  setStatus,
  status,
}) {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [openModal, setOpenModal] = useState(false);

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
      width: 350,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: "none",
    },
  }));
  const classes = useStyles();

  //function that updates the status in the database
  //for a specific post
  const approveStatus = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).update({
      status: "Approved",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  //function that updates the status in the database
  //for a specific post
  const declineStatus = (event) => {
    event.preventDefault();

    db.collection("posts")
      .doc(postId)
      .update({
        status: "Declined",
        reason: document.getElementById("reason").value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };

  return (
    <div className="adminPost">
      {/*header -> avatar + username */}
      <div className="adminPost__header">
        <Avatar
          className="adminPost__avatar"
          alt={
            username
          } /*display the first letter of user's name if no picture*/
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <div className="adminPost__address">
        <h5>{address}</h5>
      </div>

      {/*image*/}
      <img className="adminPost__image" src={imageUrl} alt=""></img>

      {/* username + caption */}
      <h4 className="adminPost__text">
        <strong>{username}:</strong> {caption}
      </h4>

      <div className="adminPost__status">
        <button
          onClick={() => setOpenModal(true)} //open modal
          className="adminPost__decline"
        >
          Decline
        </button>
        <button
          type="submit"
          onClick={approveStatus}
          className="adminPost__approve"
        >
          Approve
        </button>
      </div>

      {/* Modal pops after decline button is hit */}
      <Modal
        open={openModal} //state to keep track if it's open
        onClose={() => setOpenModal(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="adminPost__declineReason">
            <center>
              <img
                className="adminPost__headerImage"
                src={logo}
                alt=""
                width="50px"
                height="50px"
              />
            </center>

            <DescriptionOutlinedIcon />
            {/* A text box where the City of Regina employee can state their reason for declining*/}
            <textarea
              className="adminPost__textarea"
              placeholder="Please state the reason for
            declining"
              id="reason"
              type="text"
            />
            <button type="submit" onClick={declineStatus}>
              Decline
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
export default AdminPost;
