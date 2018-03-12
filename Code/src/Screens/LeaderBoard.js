//Dependancies
import React from 'react';
import { Dimensions, View, Platform } from 'react-native';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {db} from '../createReduxStore';
import Home from './Home';

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  //This function is called when the component is first rendered
  componentDidMount() {
    db().ref('/users').on('value', (users) => {
                                  this.setState({users: users.val()});
                                });


  }

  render() {
   console.log(this.state.users);
   return <div>
   <div>
   <h1>LeaderBoard</h1>
   <img height="100px" width="100px" src={require('../components/asteroid.png')}></img>
   </div>
   <ol>
   { this.state.users &&
   Object.keys(this.state.users).map((user)=>{
        return <li>ID: {this.state.users[user].email} Points:{this.state.users[user].points}</li>
   })
   }

   </ol>
   <button onClick = {()=>this.props.changeScreen(Home)}> Back </button>
   </div>
   ;
   }
}

export default LeaderBoard;