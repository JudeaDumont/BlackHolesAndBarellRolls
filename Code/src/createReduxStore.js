import { createStore, applyMiddleware, } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import * as firebase from 'firebase';
import canvas from "redux-canvas";

//functions
import calculateVector from './functions/calculateVector';

//actions
import {signIn} from './actions/user.actions';

//reducer
import rootReducer from './reducers/root.reducer';

//Custom middleware
import controllerMiddleware from './middleware/controller.middleware';

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(	
	rootReducer,	
	{/*default state (handled by root reducer)*/},
	composeWithDevTools(
	  applyMiddleware(
      canvas,
      controllerMiddleware,
	  ),
	)
);


let state = store.getState();

//state
let screenWidth = state.screen.width;
let screenHeight = state.screen.height;

//put ship keys in redux store
let ENEMY_SHIP_ADDED = "ENEMY_SHIP_ADDED";
//put asteroid keys in redux store
let ASTEROID_ADDED = "ASTEROID_ADDED";

//firebase configuration
let config = {
  apiKey: "AIzaSyCoNBpW8La0JLolHyY2RR1AkETbmgFaB38",
  authDomain: "blackholesandbarrelrolls.firebaseapp.com",
  databaseURL: "https://blackholesandbarrelrolls.firebaseio.com",
  projectId: "blackholesandbarrelrolls",
  storageBucket: "",
  messagingSenderId: "802173219020"
};

// Initialize Firebase w/ config
firebase.initializeApp(config);

let uid;

//When logged in,
// spawn a ship and let firebase know that we spawned in the center of our screen
/*If the signIn completes without error, 
the observer registered in the onAuthStateChanged will trigger and you can get the 
anonymous user's account data from the User object:*/
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    store.dispatch(signIn(user.uid))
    uid = user.uid;

    let player = {};
    //grab if user exists
    firebase.database().ref(`users/${uid}`).once("value", (user) => {
      player = user.val()
    }).catch(() => { /* no user found */})

    //spawn user in random location
    let spawnX = Math.random()*state.universe.width; 
    let spawnY = Math.random()*state.universe.height; 
    // track user in the database
    firebase.database().ref('users').child(uid).update({
      email: user.email,
      x: spawnX,    
      y: spawnY,
      rotation: 0,
      updatedAt: TIMESTAMP,
      frame: 0,
      dead: false,
    })

    store.dispatch({type: "PLAYER_SHIP_MOVE", x: spawnX, y: spawnY, rotation: 0 })

    //clear all inactive users
    firebase.database().ref('users').once("value", (val) => {
      let users = val.val();
      Object.keys(users).map( userkey => {
        if (users[userkey].updatedAt < Date.now() - 120000 && userkey !== uid) {
          //hide inactive user
          firebase.database().ref('users').child(userkey).update({
            x: -1000000,
            y: -1000000,
            updatedAt: TIMESTAMP,
            frame: 0,
            dead: true, // to stop them from showing in universe
          })
        } 
      })
    })

    //clear all inactive asteroids
    firebase.database().ref('asteroids').once("value", (val) => {
      let asteroids  = val.val();
      asteroids && Object.keys(asteroids).map( key => {
        if (asteroids[key].updatedAt < Date.now() - 30000 && key !== uid) {
          firebase.database().ref('users').child(key).remove()
        } 
      })
    })

    //clear old lasers
    firebase.database().ref('lasers').once("value", (val) => {
      let lasers = val.val();
      lasers && Object.keys(lasers).map( key => {
        if (lasers[key].updatedAt < Date.now() - 30000) {
          firebase.database().ref('lasers').child(key).remove()
        }
      })
    })

    //clear old blackHoles
    firebase.database().ref('blackHoles').once("value", (val) => {
      let blackHoles = val.val();
      blackHoles && Object.keys(blackHoles).map( key => {
        if (blackHoles[key].updatedAt < Date.now() - 30000) {
          firebase.database().ref('blackHoles').child(key).remove()
        } 
      })
    })

    //Deploy new Asteroids every few seconds
    setInterval(()=>{
      let asteroidRef = firebase.database().ref('asteroids').push({
        x: Math.random()*state.universe.width,
        y: Math.random()*state.universe.height,
        width: 100,
        rotation: 0,
        movementVector: calculateVector(Math.random()*10, Math.random()*360), //speed, angle
        managedBy: uid,
        updatedAt: TIMESTAMP,
        createdAt: TIMESTAMP,
      })

      //remove asteroid after a while
      //setTimeout(() => asteroidRef.remove(), 15000);

    }, 2000)

    //Deploy Black Holes every few seconds
    setInterval(()=> {

      let blackHoleRef = firebase.database().ref('blackHoles').push({
        x: Math.random()*state.universe.width,
        y: Math.random()*state.universe.height,
        width: 320,
        rotation: 0,
        managedBy: uid,
        updatedAt: TIMESTAMP,
        createdAt: TIMESTAMP,
      })

      //remove black hole after a while
      //setTimeout(() => blackHoleRef.remove(), 10000);

    }, 11000)

  } else {
    // User is signed out.
    firebase.database().ref('users').child(uid).update({
      x: -1000000,
      y: -1000000,
      updatedAt: TIMESTAMP,
      frame: 0,
      dead: true, // to stop them from showing in universe
    })
  }
});

//continue to listen and update the state
firebase.database().ref('/').on('value', (state) => {
  store.dispatch({
    type: "FIREBASE_STATE_UPDATE",
    state: state.val(),
  })
})

//export the database and authorization helpers for use elsewhere
export const db = firebase.database
export const auth = firebase.auth
export const TIMESTAMP = firebase.database.ServerValue.TIMESTAMP
export default store;