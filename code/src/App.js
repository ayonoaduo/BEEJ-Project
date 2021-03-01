import React from "react";
import "./App.css";
import Home from "./Home";
import Profile from "./Profile";
import AdminPage from "./AdminPage";
//import Home1 from './Home1';
//import About from './About';
//import {NavBar, Nav} from 'react-bootstrap';
//import Navbar from './components/Navbar';
//import RecoverAccount from './RecoverAccount';
//import ImageUpload from './ImageUpload';
import { Route, Switch } from "react-router-dom";
//import Navigation from './Navigation';

function App() {
  return (
    <div>
      {/* <Navigation/> */}
      <Switch>
        <Route exact path="/" component={Home}></Route>

        {/*    <Route exact path='/RecoverAccount' component={RecoverAccount}/> 
          <Route exact path='/ImageUpload' component={ImageUpload}/>
          
      <Navbar /> 
      <div className="container mt-2" style={{ marginTop: 40 }}>
        
          <Route exact path="/home1">
            <Home1 />
          </Route>
          <Route path="/about">
            <About /> */}

        <Route exact path="/Profile" component={Profile}></Route>
        <Route exact path="/AdminPage" component={AdminPage}></Route>
      </Switch>
      {/* </div>  */}
    </div>
  );
}

export default App;
