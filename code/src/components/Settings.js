import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import Avatar from "@material-ui/core/Avatar";
import "./Settings.css";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../images/beej-black.png";
import Modal from "@material-ui/core/Modal";
import { Input } from "@material-ui/core";
import VpnKeyOutlinedIcon from "@material-ui/icons/VpnKeyOutlined";

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

const useStyless = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

/* This function handles the Settings page.
 * The page is displayed when a user clicks the "settings" button on their profile page.
 * On this page, Users can reset their password,
 * sign out from the app, and go to the admin "Submitted Reports" page by inputting the authorization code
 */
function Settings({ user, setSignIn, setSignUp, setResetPass }) {
  const classess = useStyless();
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [openModal, setOpenModal] = useState(false);
  const [openAuthorizedModal, setOpenAuthorizedModal] = useState(false);
  const [code, setCode] = useState("");

  // admin function is fired up when user clicks the "admin" button
  const admin = (event) => {
    event.preventDefault(); //avoid refresh
    {
      code == "1" ? (
        //is the authorization code  equal to 1?
        //display the authorized modal
        <>({(setOpenModal(false), setOpenAuthorizedModal(true))})</>
      ) : (
        //else show alert message
        alert("The authorization code is incorrect")
      );
    }
  };

  return (
    <div className="settings">
      <Button
        size="large"
        startIcon={<ArrowBackIosOutlinedIcon />}
        classes={{ label: "settings__button" }}
        component={Link}
        to="/ProfilePage/"
      >
        Profile
      </Button>
      <div className="settings__body">
        <Modal
          open={openModal} //state to keep track if its open
          onClose={() => setOpenModal(false)} //onClose method. closes the modal when anywhere else on the screen is clicked
        >
          <div style={modalStyle} className={classes.paper}>
            <div className="settings__code">
              <center>
                <img
                  className="settings__headerImage"
                  src={logo}
                  alt=""
                  width="50px"
                  height="50px"
                />
              </center>
              <VpnKeyOutlinedIcon />
              <Input
                onChange={(e) => setCode(e.target.value)}
                placeholder="Authorization Code"
              />
              <button onClick={admin} className="settings__submitButton">
                Submit
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          open={openAuthorizedModal} //state to keep track if its open
          onClose={() => setOpenAuthorizedModal(false)} //onClose method. closes the modal when anywhere else on the screen is clicked
        >
          <div style={modalStyle} className={classes.paper}>
            <div className="settings__code">
              <center>
                <img
                  className="settings__headerImage"
                  src={logo}
                  alt=""
                  width="50px"
                  height="50px"
                />
              </center>

              <center>
                {/* checkmark */}
                <svg
                  class="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    class="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    class="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
                <h2>Access Granted</h2>
              </center>

              {/* Continue Button */}
              <Button
                classes={{ label: "settings__submitButton" }}
                component={Link}
                to="/ProfilePage/Settings/AdminHomePage"
              >
                Continue
              </Button>
            </div>
          </div>
        </Modal>

        <h1>Settings</h1>
        <div className="settings__avatar">
          <Avatar
            className={classess.large}
            alt={user.displayName} //display the first letter if no picture/
            src="/static/images/avatar/1.jpg"
          />
        </div>
        <div className="settings__info">
          <div className="settings__details">
            <h2>
              {user.displayName} - {user.email}
            </h2>
            <div className="settings__options">
              <h3>Options</h3>
              <div className="settings__reset">
                <h5>Are you an Admin?</h5>
                <button onClick={() => setOpenModal(true)}>Admin</button>
              </div>
              <div className="settings__reset">
                <h5>Change Your Password</h5>
                <button
                  onClick={() => {
                    setSignIn(false);
                    setSignUp(false);
                    setResetPass(true); //display the reset password screen
                    auth.signOut(); //sign the user out
                  }}
                >
                  Reset
                </button>
              </div>
              <button
                onClick={() => auth.signOut()}
                className="settings__signOut"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
