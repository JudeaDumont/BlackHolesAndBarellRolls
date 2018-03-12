import React, { Component } from 'react';
import { render } from 'react-dom';
import * as firebase from 'firebase'
import Home from './Home';
import Registration from './Registration';
import store from '../createReduxStore';

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault();
    firebase.auth()
    .signInWithEmailAndPassword(this.username.value, this.pass.value)
    .then((result) => {
      store.dispatch({type:'PLAYER_SHIP_EMAIL',
      email: this.username.value})
      this.props.changeScreen(Home)
    })
    .catch((error) => {
		  // Handle Errors here.
		  var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage)
		});
  }


  render() {
    return(
      <div>
        <center><h2>Login</h2></center>
        <form onSubmit = {this.handleSubmit}>
          <div>
            Username:
          </div>
          <input type="text" ref={(input) => this.username = input} />
          <div>
            Password:
          </div>
          <input type="password" ref={(input) => this.pass = input} />
          <button type="submit"> Submit </button>
        </form>
        <div>
          New? Register here!
          <button onClick = {()=>this.props.changeScreen(Registration)}>
          here
          </button>
          !
        </div> 
      </div>
      
    )}
}
