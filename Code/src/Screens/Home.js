import React from 'react';
import { Text, View, Button } from 'react-native'
import styled from 'styled-components/native';

//SCREENS
import Game from './Game';
import LeaderBoard from './LeaderBoard'
import Tutorial from './Tutorial'

const Home = (props) => <HomePageContainer>
  
  <Title>BLACK HOLES AND BARRELROLLS</Title>
  
  <GameButton 
    title="PLAY"
    onPress={ () => { props.changeScreen(Game) } }>
  </GameButton>

  <GameButton 
    title="LEADER BOARD"
    onPress={ () => { props.changeScreen(LeaderBoard) } }>
  </GameButton>

  <GameButton
    title="TUTORIAL"
    onPress={ () => { props.changeScreen(Tutorial)  } }>
    </GameButton>

</HomePageContainer>

export default Home;

//CSS
const HomePageContainer = styled.View`
  display: flex;
  flex:1;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
`
const GameButton = styled.Button`
  color: white;
`
const Title = styled.Text`
  font-size: 36pt;
`