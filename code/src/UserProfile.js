import React, {useState, useEffect} from 'react'
import './Home.css';
import logo from './beej.png';
import Post from './Post';
//import RecoverAccount from './RecoverAccount';
import {db, auth} from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
//import {Button} from '@material-ui/core';
import {Input} from '@material-ui/core';
//import ImageUpload from './ImageUpload';
//import VerifyEmail from './VerifyEmail';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import {Link, withRouter} from 'react-router-dom';

import firebase from "firebase";
import {storage} from './firebase';
import './ImageUpload.css';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
//import Button from '@material-ui/core/Button';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";


/*Styling for modal. Code from material-ui.com*/
function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function UserProfile() {
/*states...how you set variables in react*/
const classes = useStyles();
// getModalStyle is not a pure function, we roll the style only on the first render
const [modalStyle] = useState(getModalStyle);

const [posts, setPosts] = useState([]);
const [open,setOpen] = useState(false);
const [openSignIn, setOpenSignIn] = useState(false);
const [username,setUsername] = useState('');
const [password,setPassword] = useState('');
const [email,setEmail] = useState('');
const [user,setUser] = useState(null); //state to keep track of the user


//IMAGE UPLOAD STATES
const [openP,setOpenP] = useState(false);
const [caption, setCaption] = useState('');
const [image, setImage] = useState(null); //state for the progress bar
const [progress, setProgress] = useState(0);


const [keyword, setKeyword] = React.useState('');
  const [openDropDown, setOpenDropDown] = React.useState(false);

  const handleChangeDropDown = (event) => {
    setKeyword(event.target.value);
  };

  const handleCloseDropDown = () => {
    setOpenDropDown(false);
  };

  const handleOpenDropDown = () => {
    setOpenDropDown(true);
  };


//imageupload functions
const handleChange =  (e) => {//handleChange function fires off an event
  if (e.target.files[0]) { //get the first file you selected
      setImage(e.target.files[0]); //set the image in state to that file
  }
};

const handleUpload = (event) => {
  event.preventDefault(); //avoid refresh when upload button is clicked



  let userr = firebase.auth().currentUser
  //const id = uuid.v4()





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
              .getDownloadURL()   //GET DOWNLOAD LINK TO THE IMAGE
              .then(url => {
                  //post image inside db
                  db.collection("posts").add({
                      //get server timestamp so images are sorted by time posted
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      caption: caption,
                      imageUrl: url,
                      username: user.displayName,
                      keyword: keyword,
                      uid: userr.uid
                      //id: id
                  });

                  setProgress(0); //reset progress
                  setCaption("");
                  setImage(null);
                  setKeyword("");
              });
      }
  );

 
//  setOpenP(false); //close modal after upload
  

  


};






useEffect(() => {
  
    const unsubscribe = auth.onAuthStateChanged((authUser) => { //listen anytime an authentication change happens
      if (authUser) {
        //user has logged in...
        console.log(authUser);  //check the console if someone is there or not
        setUser(authUser); //Cookie tracking to keep you logged in. Captures the user in our state. 

        if (authUser.displayName) {
          //dont update username if they dont have a display name
        } else {
          // if we just created someone...
          return authUser.updateProfile({
            displayName: username, //set their display name in firebase
        });
        }
        db.collection('posts').where('username', '==', authUser.displayName).orderBy('timestamp', 'desc').onSnapshot(snapshot => {
          //everytime a new post is added, this code fires...
          setPosts(snapshot.docs.map(doc => ({
            id: doc.id, //the post ids
            post: doc.data()
          })));
        })
      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions before restarting the useEffect. This to avoid duplicate listeners.
      unsubscribe ();
    }
}, [user, username]);

//useEffect runs a piece of code based on a specific condition
useEffect(() => {
  //this is where the code runs
  //snapshot is a powerful listener that will run the code when a post is made
  
}, []);//[] symbol means run the code once

//sign up function. Fired up by the button
const signUp = (event) => {
  event.preventDefault(); //avoid refresh when sign up button is clicked

  //verify email
  auth.onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
      firebaseUser.sendEmailVerification().then(function() {
        // Email sent.
        //alert("Your email verification code has been sent")
      }, function(error) {
        // An error happened.
       alert(error.message)
      })

    } else {
      
    }
});


auth
    .createUserWithEmailAndPassword(email, password)  //create user
    .then((authUser) => {
    return authUser.user.updateProfile({
    displayName: username
    })  
  }

  )
  //backend validation is done by firebase
  .catch((error) => alert(error.message)) //alert of any errors with a message

  setOpen(false); //close modal after signing up

  
}


//sign in function. Fired up by the button
const signIn = (event) => {
  event.preventDefault(); //avoid refresh when sign in button is clicked

  
  auth
  .signInWithEmailAndPassword(email, password)
  //backend validation is done by firebase
  .catch((error) => alert(error.message)) //alert of any errors with a message
  
  setOpenSignIn(false); //close modal after signing in
}



  return (
    <div className="app">
      {/*using BEM naming convetion*/}

{/* 
      {user?.displayName ?(//access only when user is signed in
        <ImageUpload username={user.displayName} />
      ):
      (
          <h7>Sorry you need to login to upload</h7>
      )} 
 */}



      <Modal //Sign up Modal
        open = {open} //state to keep track if its open
        onClose={() => setOpen(false)} //onClose method. closes the model when anywhere else on the screen is clicked
      >
        <div style={modalStyle} className={classes.paper}>
          <form className= "app__signup">
            <center>
              <img
                className="app__headerImage"
                src={logo}
                alt=""
                width="50px"
                height="50px"
              />
            </center>
            
            <AccountCircleOutlinedIcon/>
            <Input 
                placeholder = "username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <EmailOutlinedIcon/>
              <Input 
                placeholder = "email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <LockOutlinedIcon/>
              <Input 
                placeholder = "password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" onClick={signUp}>Sign Up</button>
              
          </form>
        </div>
      </Modal>
  

      <Modal //Sign Out and Login Modal
        open = {openSignIn} //state to keep track if its open
        onClose={() => setOpenSignIn(false)} //onClose method. closes the model when anywhere else on the screen is clicked
      >
        <div style={modalStyle} className={classes.paper}>
          <form className= "app__signup">
            <center>
              <img
                className="app__headerImage"
                src={logo}
                alt=""
                width="50px"
                height="50px"
              />
            </center>
            
            <EmailOutlinedIcon/>
              <Input 
                placeholder = "email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <LockOutlinedIcon/>
              <Input 
                placeholder = "password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <button type="submit" onClick={signIn}>Sign In</button>
              
          </form>
        </div>
      </Modal>


{/* modal for posting*/}
<Modal 
        open = {openP} //state to keep track if its open
        onClose={() => setOpenP(false)} //onClose method. closes the model when anywhere else on the screen is clicked
      >
        <div style={modalStyle} className={classes.paper}>
        <div className="imageupload">
         
         
         
        <center>
            <img
                className="app__headerImage"
                src={logo}
                alt=""
                width="50px"
                height="50px"
              />
            </center>
            <FormControl className={classes.formControl}>
            

        <InputLabel id="demo-controlled-open-select-label">Choose a keyword</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={openDropDown}
          onClose={handleCloseDropDown}
          onOpen={handleOpenDropDown}
          value={keyword}
          onChange={handleChangeDropDown}
        >
          <MenuItem value="">
            <em>--Choose a keyword--</em>
          </MenuItem>
          <MenuItem value={"Pothole"}>Pothole</MenuItem>
          <MenuItem value={"Water Spill"}>Water Spill</MenuItem>
          <MenuItem value={"Sinkhole"}>Sinkhole</MenuItem>
        </Select>
      </FormControl>
 

           <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
           <input type="file" onChange={handleChange} />

           <progress className="imageupload__progress" value={progress} max="100"/>
           <button onClick={handleUpload}>
            Upload
           </button>
          
        </div>
        </div>
        
      </Modal>


      <div className="app__header">
        <img
          className="app__headerImage"
          src={logo}
          alt=""
          width="50px"
          height="50px"
        />
        {user?.displayName? ( //if the user exists, show a Logout button
        <button onClick={() => auth.signOut()}>Logout</button>
      ):  ( //else, show a sign up button
          <div className="app__loginContainer">
        <button onClick={() => setOpenSignIn(true)}>Sign In</button>
        <button onClick={() => setOpen(true)}>Sign Up</button>
        </div>
      )}
        </div>

      
      <div className="app__posts">
        <div className= "app_postsRight">
      {/*Posts*/}
      {
        /*loop through posts in state*/
        posts.map(({id, post}) => (
          //the key allows the page to only refresh the new post, not all the posts. since each post has its own key
          <Post key={id} uid={post.uid} postId={id} user= {user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} keyword={post.keyword} ></Post>
        ))
      }
      </div>
      </div>
        



{user?.displayName ?(//access only when user is signed in

 
      <div className="app__bottom">
      <BottomNavigation>
  <BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} component={Link} to="/" />
  <BottomNavigationAction label="AddBox" icon={<AddBoxOutlinedIcon />} component={Link} onClick={() => setOpenP(true)}/>
  <BottomNavigationAction label="Notifications" icon={<NotificationsNoneOutlinedIcon />} />
  <BottomNavigationAction label="Account" icon={<AccountCircleOutlinedIcon />} component={Link} to="/UserProfile"/>

</BottomNavigation>
</div>
     ):
     (
        <h7></h7> //hide nav bar when user is not signed in
    )}
     

    </div>
  );
}

export default UserProfile;