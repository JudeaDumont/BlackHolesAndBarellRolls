//Dependancies
import React from 'react';
import { Dimensions, View, Platform } from 'react-native';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {db} from '../createReduxStore';
import Home from './Home';

class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
        <div>
                <h1><center>Tutorial!</center></h1>
                <p>Push 'w' to move forward</p>
                <p>Push 'a' to turn the ship left</p>
                <p>Push 'd' to turn the ship right</p>
                <p>Push 'q' to barrel roll to the left</p>
                <p>Push 'e' to barrel roll to the right</p>
                <p>Push 'f' to fire a missle</p>
                <button onClick = {()=>this.props.changeScreen(Home)}> Back </button>
        </div>
    )}
}
export default Tutorial;