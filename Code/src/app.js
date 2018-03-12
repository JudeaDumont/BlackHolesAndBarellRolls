//Dependancies
import React from 'react';
import { Dimensions, View, Platform, Button } from 'react-native';
import styled from 'styled-components/native';

//SCREENS
import Home from './Screens/Home';
import LoginPage from './Screens/Login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Screen: LoginPage
    }
  }

  changeScreen = (Screen) => {
    this.setState({Screen});
  }

  render() {
    let Screen = this.state.Screen;
    return (<AppWrapper>
      <Screen changeScreen={this.changeScreen.bind(this)}/>
    </AppWrapper>)
  }
}

//CSS
const AppWrapper = styled.View`
  display: flex;
  flex: 1;
`
export default App;