import React from 'react'
import ReactDOM from 'react-dom';
import Homepage from './Components/Homepage/Homepage';
import Group from './Components/Group/Main';
import Login from './Components/Login/Login';
import Logout from './Components/Login/Logout';
import Signup from './Components/Login/Signup';
import { PrivateRoute } from './Components/Auth/PrivateRoute';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
  } from "react-router-dom";


function App() {
  return (
    <div className="App">
       <Router>
            <Switch>
                <PrivateRoute exact path="/" component={Homepage}/>
                <PrivateRoute path="/group/" component={Group}/>
                <PrivateRoute exact path="/logout/" component={Logout}/>
                <Route exact path="/signup/" component={Signup}/>
                <Route exact path="/login/" component={Login}/>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
