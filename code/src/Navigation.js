import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faHome,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./Navigation.css";
import logo from "./images/beej-black.png";
import { auth } from "./firebase";

const tabs = [
  {
    route: "/Homepage",
    icon: faHome,
    label: "Home",
  },
  {
    route: "/PostPage",
    icon: faCamera,
    label: "Post",
  },
  {
    route: "/ProfilePage",
    icon: faUserCircle,
    label: "Profile",
  },
];

const Navigation = ({ user, setSignIn, setSignUp, progress, setProgress }) => {
  return (
    <div className="sticky-top">
      {!user.emailVerified ? (
        //display the email verification bar if the user's email is not verified
        <div className="verifyEmail">
          <h1>Please Check and Verify Your Email. Then Sign In.</h1>
          <button
            onClick={() => {
              setSignIn(true);
              setSignUp(false);
              auth.signOut();
            }}
            className="signout"
          >
            Sign In
          </button>
        </div>
      ) : (
        //else display the navigation icons
        <div>
          {!progress ? ( //progress bar display
            <h12></h12>
          ) : (
            <progress
              className="navigation__progressBar"
              value={progress}
              max="100"
            />
          )}
          {/* Top Bar for Desktop*/}
          <nav
            className="navbar navbar-expand-md navbar-light d-none d-lg-block"
            role="navigation"
          >
            <div className="container-fluid">
              <nav-item>
                <NavLink to="/">
                  {" "}
                  <img
                    className="navbar-brand"
                    src={logo}
                    alt=""
                    width="101.6px"
                    height="83px"
                  />
                </NavLink>
              </nav-item>
              <nav-item>
                <NavLink to="/PostPage" className="nav-link">
                  Submit Report
                </NavLink>
              </nav-item>
              <nav-item>
                <NavLink to="/ProfilePage" className="nav-link">
                  Profile
                </NavLink>
              </nav-item>
            </div>
          </nav>
          {/* Top Bar for Mobile*/}
          <nav
            className="navbar navbar-expand-md navbar-light d-block d-lg-none"
            role="navigation"
          >
            <div className="container-fluid">
              <NavLink to="/"></NavLink>
              <NavLink to="/">
                {" "}
                <img
                  className="navbar-brand"
                  src={logo}
                  alt=""
                  width="50.8px"
                  height="41.5px"
                />
              </NavLink>
              <nav-item></nav-item>
            </div>
          </nav>
          {/* Bottom Tab Navigator*/}
          <nav
            className="navbar fixed-bottom navbar-light d-block d-lg-none bottom-tab-nav"
            role="navigation"
          >
            <div className=" d-flex flex-row justify-content-around w-100">
              {                                                                                                                                                                                                                                                  .map((tab, index) => (
                <nav-item key={`tab-${index}`}>
                  <NavLink
                    to={tab.route}
                    className="nav-link bottom-nav-link"
                    activeClassName="active"
                  >
                    <div className="row d-flex flex-column justify-content-center align-items-center">
                      <FontAwesomeIcon size="lg" icon={tab.icon} />
                    </div>
                  </NavLink>
                </nav-item>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navigation;
