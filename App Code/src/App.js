import React, {useState, useEffect} from 'react'
import './App.css';
import Home from './Home';
import RecoverAccount from './RecoverAccount';
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
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navigation from './Navigation';
import { Link } from "react-router-dom";




function App() {
  return (
      <div>
      <Navigation/>
          <Route exact path='/' component={Home}/>
          <Route exact path='/RecoverAccount' component={RecoverAccount}/>
      </div> 
  )
    
}

export default App