import React, {useState, useEffect} from 'react'
import './App.css';
import logo from './beej.png';
import Post from './Post';
import {db, auth} from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
//import {Button} from '@material-ui/core';
import {Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
//import VerifyEmail from './VerifyEmail';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

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



function App() {
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
  db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    //everytime a new post is added, this code fires...
    setPosts(snapshot.docs.map(doc => ({
      id: doc.id, //the post ids
      post: doc.data()
    })));
  })
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


      {user?.displayName ?(//access only when user is signed in
        <ImageUpload username={user.displayName} />
      ):
      (
          <h7>Sorry you need to login to upload</h7>
      )}




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
          <Post key={id} postId={id} user= {user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}></Post>

        ))
      }
      </div>
      </div>
        
       
      <div className="stickToBottom">
      <BottomNavigation
  //value={value}
  //onChange={(event, newValue) => {
   // setValue(newValue);
  //}}
  //showLabels
  //className={classes.root}
>
<BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} />
  <BottomNavigationAction label="AddBox" icon={<AddBoxOutlinedIcon />} />
  <BottomNavigationAction label="Notifications" icon={<NotificationsNoneOutlinedIcon />} />
  <BottomNavigationAction label="Account" icon={<AccountCircleOutlinedIcon />} />
</BottomNavigation>
</div>


    </div>
  );
}

export default App;