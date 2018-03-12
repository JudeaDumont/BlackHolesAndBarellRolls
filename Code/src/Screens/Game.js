//Dependancies
import React from 'react';
import { Dimensions, View, Platform } from 'react-native';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//firebase
import {db} from '../createReduxStore';

//CANVAS
import Canvas, { Image as CanvasImage} from 'react-native-canvas';

//Components
import Controller from '../components/Controller';

//Screens
import Home from '../Screens/Home';

//actions
import * as screenActions from '../actions/screen.actions';
import * as canvasActions from '../actions/canvas.actions';
import * as asteroidsActions from '../actions/asteroids.actions';
import * as lasersActions from '../actions/lasers.actions';
import * as enemyShipActions from '../actions/enemyShips.actions';
import * as blackHoleActions from '../actions/blackhole.actions';
import * as playerShipActions from '../actions/playerShip.actions';
import * as explosionActions from '../actions/explosions.actions';

class Game extends React.Component {
  constructor(props) {
    super(props)
    //real canvas & canvas context
    this.state = {
      ctx: null,
      canvas: null
    }
    this.UniverseCanvasImage = new Image();
    this.asteroidSprite = new Image();
    this.laserSprite = new Image();
    this.shipSprite = new Image();
    this.blackHoleSprite = new Image();
    this.explosionSprite = new Image();
  }

  //This function is called when the component is first rendered
  componentDidMount() {
    let { 
      asteroids, enemyShips, blackHoles, user,
      resizeScreen, redrawUniverse, lasers,
      initializeUniverseCanvas, initializeEnemyShipCanvas, initializePlayerShipCanvas,
      initializeAsteroidCanvas, initializeBlackHoleCanvas,
      initializeLaserCanvas, initializeExplosionCanvas,
    } = this.props;

    //Listen for screen resizing
    Dimensions.addEventListener("change", () => {
      resizeScreen(
        Dimensions.get('window').width,
        Dimensions.get('window').height
      )
      if (this.state.ctx) redrawUniverse();
    });

    //GET SPRITES READY
    this.shipSprite.src = require('../components/ShipWithRoll.png');
    this.asteroidSprite.src = require('../components/asteroid.png');
    this.laserSprite.src = require('../components/missile.png');
    this.UniverseCanvasImage.src = require('../components/universe.jpg');
    this.blackHoleSprite.src = require('../components/blackhole.png');
    this.explosionSprite.src = require('../components/explosion.png');
    
    //Wait for sprite images to load
    this.UniverseCanvasImage.addEventListener('load', () => {
      if (this.state.ctx && this.UniverseCanvasImage) {
        //Dispatch action to redux-canvas middleware
        initializeUniverseCanvas(this.state.ctx, this.UniverseCanvasImage)       
      } else {
        console.log("no ctx to draw to or img to draw", { ctx: this.state.ctx, img: this.UniverseCanvasImage})
      }
    })

    this.asteroidSprite.addEventListener('load', () => {
      initializeAsteroidCanvas(this.asteroidSprite);
    })

    this.laserSprite.addEventListener('load', () => {
      initializeLaserCanvas(this.laserSprite);
    })

    this.shipSprite.addEventListener('load', () => {
      initializePlayerShipCanvas(this.shipSprite)
      initializeEnemyShipCanvas(this.shipSprite)
    })

    this.blackHoleSprite.addEventListener('load', () => {
      initializeBlackHoleCanvas(this.blackHoleSprite)
    })

    this.explosionSprite.addEventListener('load', () => {
      initializeExplosionCanvas(this.explosionSprite)
    })
    
  }

  render() {
    let { enemyShips, asteroids, lasers, screen, user,
     playerShip, respawnPlayer, universe } = this.props;
    let { width, height } = screen;
    let canvasRef;
    return <View>

      <canvas 
        ref={(canvas) => {
            if (canvas && this.state.canvas == null) {
              this.setState({
                canvas,
                ctx: canvas.getContext("2d")
              })
            }
          }
        }
        width={width}
        height={height}
      >
      </canvas>

      { playerShip.dead == false 
        
        ? <View><Controller x={"100px"} y={"300px"} /></View>
        
          : <Box>
            <Box onClick={() => {
              let x = Math.floor(Math.random()*universe.width - screen.width);
              let y = Math.floor(Math.random()*universe.height - screen.height);
              db().ref('users/' + user.uid).update({
                ...playerShip,
                dead: false,
                x,
                y
              });
              respawnPlayer(x, y)
            }}>
            You have died, click here to respawn ship... 
            LEEEERRRRROOOOYYYYYYYY JENKINNNNNNNNNNNS
          </Box>
          <BackBox onClick={() => {
              this.props.changeScreen(Home);
            }}>
            Click here to go back to home screen.
          </BackBox>
        </Box>
      }
    </View>
  }
}

          

const Box = styled.View`
  background: red;
  position: absolute;
  top: 100px;
  left: 100px;
`
const BackBox = styled.View`
  background: green;
  position: absolute;
  top: 50px;
  left: 50px;
`

//redux mappings
const mapStateToProps = state => ({
  user: state.user,
  blackHoles: state.firebaseData.blackHoles,
  enemyShips: state.firebaseData.users,
  playerShip: state.playerShip,
  asteroids: state.firebaseData.asteroids,
  lasers: state.firebaseData.lasers,
  screen: state.screen,
  universe: state.universe
})
const mapDispatchToProps = dispatch => bindActionCreators({
  ...screenActions, 
  ...canvasActions,
  ...asteroidsActions,
  ...lasersActions,
  ...enemyShipActions,
  ...blackHoleActions,
  ...playerShipActions,
  ...explosionActions,
}, dispatch);
//export default connect(mapStateToProps, mapDispatchToProps)(ReactAnimationFrame(App, 16))
export default connect(mapStateToProps, mapDispatchToProps)(Game);