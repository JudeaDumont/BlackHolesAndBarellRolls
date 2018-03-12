import React from 'react'
import { Image, View, PanResponder, StyleSheet, Animated, Platform} from 'react-native'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactAnimationFrame from 'react-animation-frame';

//Redux Actions Imports
import * as engineActions from '../actions/engine.actions';

//CONSTANTS
KEY_MAP = { LEFT: 65, RIGHT: 68, UP: 87,} //which keys to track
let {LEFT, RIGHT, UP} = KEY_MAP;

export class Controller extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          pan: new Animated.ValueXY(),
          scale: new Animated.Value(1),
      };
      this.keys = {} //track which keys are up or down
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
        this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
        this.state.pan.setValue({ x: 0, y: 0 });
        Animated.spring(
          this.state.scale,
          { toValue: 1.1, friction: 3 }
        ).start();
      },
      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: (e, gestureState) => {
        let {moveX, moveY, dx, dy} = gestureState
        let { x, y, width, height } = this.props;
        //contrain the movement to bounds        
        if(  dx < width*2 
          && dx > -width*2 
          && dy < height*2 
          && dy > -height*2) {

          let up, left, right = false;
          left = (dx < (-width/3))
          right = (dx > (width/3))
          up  = (dy < (-height/3))
          
          this.keys[UP] = up;
          this.keys[LEFT] = left;
          this.keys[RIGHT] = right;

          Animated.event([null, {
            dx: this.state.pan.x,
            dy: this.state.pan.y,
          }])(e, gestureState);

        } else {
          return;
        }
      },

      onPanResponderRelease: (e, { vx, vy }) => {
        // Flatten the offset to avoid erratic behavior
        this.state.pan.flattenOffset();
        //this.props.setKeys({ up: false, left: false, right: false })
        this.keys[UP] = false;
        this.keys[LEFT] = false;
        this.keys[RIGHT] = false;
        Animated.spring(
          this.state.scale,
          { toValue: 1, friction: 3 }
        ).start();
        this.state.pan.setValue({ x: 0, y: 0 }); 
      }
    });
  }

  componentDidMount() {
    if (Platform.OS === "web") {
      document.addEventListener("keydown", (e) => { this.handleKeyDown(e) });
      document.addEventListener("keyup", (e) => { this.handleKeyUp(e) });
    }
  }

  onAnimationFrame() {
    //update game logic using the controller input
    this.props.tickEngineClock(this.keys);
  }

  //Takes keyboard events and updates controls
  handleKeyUp = (event) => {
    this.keys[event.keyCode] = false;
  }
  handleKeyDown = (event) => {
    this.keys[event.keyCode] = true;
  }

  render() {

    // Destructure the value of pan from the state
    let pan = this.state.pan;
    let scale = this.state.scale;
    let { x, y, width, height, keyUp, keyDown } = this.props;

    // Calculate the x and y transform from the pan value
    let [translateX, translateY] = [pan.x, pan.y];

    return (
        <Animated.View 
          style={{
            position: "absolute",
            top: y,
            left: x,
            // Calculate the transform property and set it as a value for our style
            transform: [{ translateX }, { translateY }, { scale }],
            backgroundColor: "red",
            borderRadius: 50,
            zIndex: 3000,
            borderRadius: 50,
            width,
            height,
          }} 
          {...this._panResponder.panHandlers} 
        />
    );
  }
}
    
const mapStateToProps = null;
const mapDispatchToProps = (dispatch) => bindActionCreators({...engineActions,}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ReactAnimationFrame(Controller));