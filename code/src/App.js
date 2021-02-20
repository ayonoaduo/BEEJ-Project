import React, {} from 'react'
import './App.css';
import Home from './Home';
import RecoverAccount from './RecoverAccount';
import { Route } from 'react-router-dom';
import Navigation from './Navigation';
import UserProfile from './UserProfile';
import AdminPage from './AdminPage';

function App() {
  //const currentUser = useContext(UserContext);
  return (
      <div>
        {/* <UserProvider> 
        <UserContext.Consumer>*/}
      <Navigation/>
          <Route exact path='/' component={Home}/>
          <Route exact path='/RecoverAccount' component={RecoverAccount}/>
          <Route exact path='/UserProfile' component={UserProfile}/>
          <Route exact path='/AdminPage' component={AdminPage}/>
      </div> 
  )
    
}

export default App