import React, { useState } from "react";
import { db } from "./firebase";
import "./AdminApprovedPost.css";
import Avatar from "@material-ui/core/Avatar";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import logo from "./images/beej-black.png";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";

/* This function allows the City of Regina employees to view and change the status of reports*/
function AdminApprovedPost({
  postId,
  user,
  username,
  caption,
  imageUrl,
  address,
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
  const solvedStatus = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).update({
      status: "Solved",
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
      });
  };

  return (
    <div className="adminApprovedPost">
      {/*header -> avatar + username */}
      <div className="adminApprovedPost__header">
        <Avatar
          className="adminApprovedPost__avatar"
          alt={username} /*display the first letter if no picture*/
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <div className="adminApprovedPost__address">
        <h5>{address}</h5>
      </div>

      {/*image*/}
      <img className="adminApprovedPost__image" src={imageUrl} alt=""></img>

      {/* username + caption */}
      <h4 className="adminApprovedPost__text">
        <strong>{username}:</strong> {caption}
      </h4>

      {/*Button to indicate if Report is completed*/}
      <div className="adminApprovedPost__status">
        <h2>Report Completed?</h2>
        <button
          className="adminApprovedPost__approve"
          type="submit"
          onClick={solvedStatus} /* Change the status of report to solved*/
        >
          Completed
        </button>
        <button
          onClick={() => setOpenModal(true)} //open modal
          className="adminApprovedPost__decline"
        >
          No
        </button>
      </div>

      {/* Modal pops after decline button is pressed */}
      <Modal
        open={openModal} //state to keep track if its open
        onClose={() => setOpenModal(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="adminApprovedPost__declineReason">
            <center>
              <img
                className="adminApprovedPost__headerImage"
                src={logo}
                alt=""
                width="50px"
                height="50px"
              />
            </center>

            <DescriptionOutlinedIcon />
            {/* Open up a text box where the City of Regina employee can state their reason for declining*/}
            <textarea
              className="adminApprovedPost__textarea"
              placeholder="Please state the reason for
            declining"
              id="reason"
              type="text"
            />
            {/*When button is presssed, change report status to declined*/}
            <button type="submit" onClick={declineStatus}>
              Decline
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
export default AdminApprovedPost;
