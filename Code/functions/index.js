// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


//!!!!!!!!!!!!!
//this function gets called too often to work on the free plan of firebase

// Listens for new states added to the db root
exports.moveAsteroids = functions
.database.ref('/users') //listen to users updating (game is running)
.onUpdate(event => {
  // Grab the current value of what was written to the Realtime Database.
  let asteroids = event.data.parent.val().asteroids;
  console.log("asteroids", asteroids);
  Object.keys(asteroids).map((aKey) => {
  	let asteroid = asteroids(aKey);
  	console.log("**asteroid", asteroid)
  	asteroid.x = asteroid.x + asteroid.movementVector[0]
  	asteroid.y = asteroid.y + asteroid.movementVector[1]
  })
  return event.data.ref.parent
  	.child('asteroids')
  	.set(asteroids);
});