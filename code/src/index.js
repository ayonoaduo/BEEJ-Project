import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
//import { UserProvider } from './UserContext';

ReactDOM.render(<Home />, document.querySelector('#root'));

ReactDOM.render((
   <BrowserRouter>
     {/* <UserProvider> */}
        <App /> {/* The various pages will be displayed by the `Main` component. */}
     {/* </UserProvider> */}
   </BrowserRouter>
   ), document.getElementById('root')
 );

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

