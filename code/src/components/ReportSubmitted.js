import React from "react";
import { Link } from "react-router-dom";
import "./ReportSubmitted.css";
import Button from "@material-ui/core/Button";

/* This function handles the Report submitted page.
 * This page is displayed when a user successfully submits their report.
 * Users are able to go to their profile page from here*/

function ReportSubmitted() {
  return (
    <div className="reportSubmitted">
      <h1>Report Submitted</h1>
      <div className="reportSubmitted__details">
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

        <h2>Thank you for your report.</h2>
        <h3>You can view and track the status on your profile page.</h3>
        <Button
          classes={{ label: "reportSubmitted__button" }}
          component={Link}
          to="/ProfilePage"
        >
          Go To Profile
        </Button>
      </div>
    </div>
  );
}

export default ReportSubmitted;
