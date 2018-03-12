import React, { Component } from 'react';
import { render } from 'react-dom';
import * as firebase from 'firebase'
import Login from './Login';
import { stringify } from 'querystring';
import {db} from '../createReduxStore'

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error : ""
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.email.value, this.password.value)
    .then((result) => {
        this.props.changeScreen(Login)
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
      this.setState({error : errorMessage})
  });
  }

componentDidMount() {
  var config = {
		apiKey: "AIzaSyCoNBpW8La0JLolHyY2RR1AkETbmgFaB38",
		authDomain: "blackholesandbarrelrolls.firebaseapp.com",
		databaseURL: "https://blackholesandbarrelrolls.firebaseio.com",
		projectId: "blackholesandbarrelrolls",
		storageBucket: "blackholesandbarrelrolls.appspot.com",
		messagingSenderId: "802173219020"
	};
	firebase.initializeApp(config);
  }

  render() {
    return(
      <div>
        <center><h2>Register</h2></center>
        <form onSubmit = {this.handleSubmit}>
          <div>
            Email:
          </div>
          <input type="text" ref={(input) => this.email = input} />
          <div>
            Username:
            </div>
            <input type="text" ref={(input) => this.username = input} />
          <div>
            Password:
          </div>
          <input type="password" pattern="(?=.*[a-z])(?=.*[A-Z}).{6,}" ref={(input) => this.password = input} />
          <button type="submit"> Submit </button>
          <div>
            <p>Password must contain at least <b>6 (six)</b>  characters.</p>
          </div>
          {
            this.email=="" && <p>An email address is required!</p>
          }
          {
            this.username=="" && <p>A username is required!</p>
          }
          {
            this.password=="" && <p>A password is required!</p>
          }
          {
            this.state.error=="The email address is badly formatted." && <p>Please enter a correctly formatted email address.</p>
          }
          {
            this.state.error=="Password should be at least 6 characters" && <p>Passwords must be 6 characters!</p>
          }
          {
            db().ref('/').on('value', (state) => {
              console.log(state)
            })
          }
        </form>
        <button onClick = {()=>this.props.changeScreen(Login)}> Back </button>
      </div>
    )}
}
