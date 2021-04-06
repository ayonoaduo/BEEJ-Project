import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Post from "../Post";
import { db } from "../firebase";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Geocode from "react-geocode";
import { config } from "../config";

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

/* This function handles all HomePage tasks except pulling posts from the database,
 * which is done by Post.js.  */

function HomePage({
  user,
  setAddress,
  setStreet,
  street,
  setNeighborhood,
  neighborhood,
}) {
  /*states...how we set variables in react*/
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = React.useState("");
  const [openDropDown, setOpenDropDown] = React.useState(false);
  const classes = useStyles();
  const handleChangeDropDown = (event) => {
    setKeyword(event.target.value);
  };
  const mykey = config.API_KEY;

  /** This handles "No filtering".
   ** Used when user does not want Neighbourhood/Street filtering.
   ** It is trigerred by clicking the 'None' filter button.
   ** It uses Google's Geocode API to find the current location of the user.
   **/
  const noFilter = (event) => {
    db.collection("posts")
      .where("status", "==", "Approved")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  };

  /** This handles  street filtering.
   ** It is trigerred by clicking the 'Street' filter button.
   ** It uses Google's Geocode API to find the current location of the user.
   **/
  const streetFilter = (event) => {
    // Get the user's current location
    event.preventDefault();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        Geocode.setApiKey(mykey);
        Geocode.setLanguage("en");
        Geocode.enableDebug();
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then((response) => {
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
                case "route":
                  setStreet(
                    response.results[0].address_components[i].long_name
                  );
                  break;
                default:
              }
            }
          }
        });
      });
    }
    db.collection("posts")
      .where("street", "==", street)
      .where("status", "==", "Approved")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  };

  /* ******** useEffect For Street Filter ************** */
  useEffect(() => {
    //get current location

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
    db.collection("posts")
      .where("street", "==", street)
      .where("status", "==", "Approved")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  }, []); //[] symbol means run the code once;

  const neighborhoodFilter = (event) => {
    event.preventDefault();
    //get current location

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        Geocode.setApiKey(mykey);
        Geocode.setLanguage("en");
        Geocode.enableDebug();
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then((response) => {
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
              }
            }
          }
        });
      });
    }
    db.collection("posts")
      .where("neighborhood", "==", neighborhood)
      .where("status", "==", "Approved")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  };

  /* ******** useEffect For Neighborhood Filter ************** */
  useEffect(() => {
    //get current location

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        Geocode.setApiKey(mykey);
        Geocode.setLanguage("en");
        Geocode.enableDebug();
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then((response) => {
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
              }
            }
          }
        });
      });
    }
    db.collection("posts")
      .where("neighborhood", "==", neighborhood)
      .where("status", "==", "Approved")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  }, []); //[] symbol means run the code once;

  //useEffect runs a piece of code based on a specific condition
  useEffect(() => {
    //this is where the code runs
    //snapshot is a powerful listener that will run the code when a post is made
    db.collection("posts")
      .where("status", "==", "Approved")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  }, []); //[] symbol means run the code once;

  return (
    <div className="homePage">
      <div className="homePage__dropdown">
        <FormControl className={classes.formControl}>
          <InputLabel
            id="demo-controlled-open-select-label"
            classes={{ label: "profilePage__buttonLarge d-none d-lg-flex" }}
          >
            Filter By
          </InputLabel>

          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={openDropDown}
            onClose={() => setOpenDropDown(false)}
            onOpen={() => setOpenDropDown(true)}
            value={keyword}
            onChange={handleChangeDropDown}
          >
            <MenuItem value="">
              <em>--Choose a Filter--</em>
            </MenuItem>
            <MenuItem onClick={noFilter} value={"None"}>
              None
            </MenuItem>
            <MenuItem onClick={streetFilter} value={"Street"}>
              Street
            </MenuItem>
            <MenuItem onClick={neighborhoodFilter} value={"Neighborhood"}>
              Neighborhood
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="homePage__posts">
        <div className="homePage_postsRight">
          {/*Posts*/}
          {
            /*loop through posts in state*/
            posts.map(({ id, post }) => (
              //the key allows the page to only refresh the new post, not all the
              //posts. since each post has its own key
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                address={post.address}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default HomePage;
