//Dependency Imports
import calculateVector from '../functions/calculateVector';

//FIREBASE
import { db, TIMESTAMP } from '../createReduxStore';

//CONSTANTS
const KEY_MAP = { LEFT: 65, RIGHT: 68, UP: 87, SHOOT: 70, BRR: 69, BRL: 81 } //which keys to track (w, a, d, space)
const { LEFT, RIGHT, UP, SHOOT, BRR, BRL } = KEY_MAP;

//actionsd
import { redrawUniverse } from '../actions/canvas.actions';
import { updateShipHealth, killPlayer } from '../actions/playerShip.actions';

//@REDUX_MIDDLEWARE
const controllerMiddleware = store => next => action => {

	if (action.type == "GAME_CLOCK_TICK") {

		///batch all of the data to update in one firebase event
		let batchedUpdates = {};

		//timestamp
		let now = Date.now();
		let staleTime = now - 20000; // if an entity is stale and needs deletion

		//state
		let state = store.getState()
		let { playerShip, universe, screen, user, } = state;
		let { enemyShips, asteroids, lasers, blackHoles, explosions } = state.firebaseData;

		//action payload
		let { keys } = action;

		//computed
		let toX, toY, toRotation, xyVector;

		if (playerShip.dead == false) {

			if (keys[SHOOT]) {//default player movement
				toX = universe.worldX;
				toY = universe.worldY;
				toRotation = playerShip.rotation;
				let missleOffsetVector = calculateVector(playerShip.height * 1.5, playerShip.rotation)
				//create a new missle (laser for now)
				let laser = {
					x: toX + (screen.width / 2) + missleOffsetVector[0],
					y: toY + (screen.height / 2) - missleOffsetVector[1],
					width: 24,
					rotation: playerShip.rotation,
					movementVector: calculateVector(playerShip.baseSpeed * 2, playerShip.rotation),
					managedBy: user.uid,
					updatedAt: TIMESTAMP,
					createdAt: TIMESTAMP,
				};
				let justPushed = db().ref('lasers').push(laser);
				setTimeout(() => justPushed.remove(), 2000);
			}

			if (playerShip.frame != 0) {
				if (playerShip.frame > 0) {
					store.dispatch({ type: 'BRR' })
					xyVector = calculateVector(playerShip.baseSpeed - 1, playerShip.rotation + 90)
					toX = universe.worldX + xyVector[0];
					toY = universe.worldY - xyVector[1];
					toRotation = (playerShip.rotation);
					({ toX, toY } = moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen))

				}
				else if (playerShip.frame < 0) {
					store.dispatch({ type: 'BRL' })
					xyVector = calculateVector(playerShip.baseSpeed - 1, playerShip.rotation + 270)
					toX = universe.worldX + xyVector[0];
					toY = universe.worldY - xyVector[1];
					toRotation = (playerShip.rotation);
					({ toX, toY } = moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen))
				}
				if (playerShip.frame <= -11 || playerShip.frame >=11) {
					store.dispatch({ type: 'BRSTOP' })
				}
			}
			else {

				switch (true) {

					case keys[BRR]:
						xyVector = calculateVector(playerShip.baseSpeed, playerShip.rotation + 90)
						toX = universe.worldX + xyVector[0];
						toY = universe.worldY - xyVector[1];
						toRotation = (playerShip.rotation);
						({ toX, toY } = moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen))
						if (playerShip.frame === 0) {
							store.dispatch({ type: 'BRR' })
						}
						break;

					case keys[BRL]:
						xyVector = calculateVector(playerShip.baseSpeed, playerShip.rotation + 270)
						toX = universe.worldX + xyVector[0];
						toY = universe.worldY - xyVector[1];
						toRotation = (playerShip.rotation);
						({ toX, toY } = moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen))
						if (playerShip.frame === 0) {
							store.dispatch({ type: 'BRL' })
						}
						break;

					case keys[UP] && keys[RIGHT]:
						xyVector = calculateVector(playerShip.baseSpeed, playerShip.rotation)
						toX = universe.worldX + xyVector[0];
						toY = universe.worldY - xyVector[1];
						toRotation = (playerShip.rotation + playerShip.baseRotationSpeed);
						({ toX, toY } = moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen))
						break;

					case keys[UP] && keys[LEFT]:
						xyVector = calculateVector(playerShip.baseSpeed, playerShip.rotation)
						toX = universe.worldX + xyVector[0];
						toY = universe.worldY - xyVector[1];
						toRotation = (playerShip.rotation - playerShip.baseRotationSpeed);
						({ toX, toY } = moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen))
						break;

					case keys[LEFT]:
						toX = universe.worldX;
						toY = universe.worldY;
						toRotation = (playerShip.rotation - playerShip.baseRotationSpeed);
						({ toX, toY } = moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen))
						break;

					case keys[RIGHT]:
						toX = universe.worldX;
						toY = universe.worldY;
						toRotation = (playerShip.rotation + playerShip.baseRotationSpeed);
						({ toX, toY } = moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen))
						break;

					case keys[UP]:
						xyVector = calculateVector(playerShip.baseSpeed, playerShip.rotation)
						toX = universe.worldX + xyVector[0];
						toY = universe.worldY - xyVector[1];
						toRotation = (playerShip.rotation);
						({ toX, toY } = moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen))
						break;

					default:
						toX = universe.worldX;
						toY = universe.worldY;
						toRotation = playerShip.rotation;
						break;
				} //done checking control
			}


			//CHECK COLLISIONS && UPDATE FIREBASE
			let ship = {
				...playerShip,
				x: screen.xCenter + toX,
				y: screen.yCenter + toY,
			}

			if (lasers) {
				for (var i = 0, l = Object.keys(lasers).length; i < l; i++) {
					let laser = lasers[Object.keys(lasers)[i]];
					if (laser) {
						//remove stale missles (older than 2 seconds)
						if(laser.updatedAt < staleTime || laser.createdAt < staleTime) {
							db().ref('lasers/').child(Object.keys(lasers)[i]).remove()
							delete lasers[Object.keys(lasers)[i]];
							//exit iteration early since missle is old
							continue;
						}
						if (laser.managedBy == user.uid) { //this user's missle
							//UPDATE MISSLE IN FIREBASE
							let [vectorX, vectorY] = laser.movementVector;
							batchedUpdates['lasers/' + Object.keys(lasers)[i]] = {
								...laser,
								x: laser.x + vectorX,
								y: laser.y - vectorY,
								updatedAt: TIMESTAMP,
							}
							//check if it hit one of the asteroids
							if (asteroids) {
								for (var j = 0, le = Object.keys(asteroids).length; j < le; j++) {
									let asteroid = asteroids[Object.keys(asteroids)[j]];
									if (asteroid) {
										if (collision(laser, asteroid)) {
											db().ref("asteroids").child(Object.keys(asteroids)[j]).remove();
											batchedUpdates['users/' + user.uid] = {
												...batchedUpdates['users/' + user.uid],
												points: playerShip.points + 1,
											}
											//create explosion
											createExplosion(asteroid.x, asteroid.y);
											//remove asteroid and add player point
											delete asteroids[Object.keys(asteroids)[j]];
											store.dispatch({ type: 'PLAYER_SHIP_ADD_POINT' });

										} 
									}
								}
							}
							//check if you hit another player
							if (enemyShips) {
								for (var i = 0, l = Object.keys(enemyShips).length; i < l; i++) {
									let enemyShip = enemyShips[Object.keys(enemyShips)[i]];
									if(Object.keys(enemyShips)[i] !== user.uid) {
										if (collision(enemyShip, laser)) {
											batchedUpdates['users/' + user.uid] = {
												...batchedUpdates['users/' + user.uid],
												points: playerShip.points + 1,
											}
											store.dispatch({ type: 'PLAYER_SHIP_ADD_POINT' });
											//UPDATE ENEMY IN FIREBASE
											batchedUpdates['users/' + Object.keys(enemyShips)[i]] = {
												...enemyShip,
												dead: true,
												updatedAt: TIMESTAMP,
											}
											//create explosion
											createExplosion(enemyShip.x, enemyShip.y);
										}
									}
								}
							}
						} else { // not your laser
							//check if the laser hit you
							if (collision(ship, laser)) {
								if (playerShip.health - 100 < 1) {
									batchedUpdates['users/' + user.uid] = {
										...playerShip,
										dead: true,
										x: -1000,
										y: -1000,
									};
									//create explosion
									createExplosion(ship.x, ship.y);
									//kill player
									store.dispatch(killPlayer());
								} else {
									store.dispatch(updateShipHealth(playerShip.health - 100))
								}
							}
						}
					}		
				}
			}

			if (asteroids) {
				let keys = Object.keys(asteroids);
				for (var i = 0, l = keys.length; i < l; i++) {
					let asteroid = asteroids[keys[i]]; 
					if (asteroid) {
						//clear stale asteroids
						if(asteroid.updatedAt < staleTime || asteroid.createdAt < staleTime) {
							db().ref('asteroids/').child(keys[i]).remove()
							delete asteroids[keys[i]];
							//exit iteration early since missle is old
							continue;
						}
	          if (asteroid.managedBy == user.uid) { 
	            let [vectorX, vectorY] = asteroid.movementVector; 
	            batchedUpdates['asteroids/' + keys[i]] = { 
	              ...asteroid, 
	              x: asteroid.x + vectorX, 
	              y: asteroid.y - vectorY, 
	              rotation: asteroid.rotation + 1, 
	              updatedAt: TIMESTAMP, 
	            }
	          }
						if (collision(ship, asteroid)) {
							if (playerShip.health - 100 < 1) {
								db().ref('users/' + user.uid).update({
									...playerShip,
									dead: true,
									x: -1000,
									y: -1000,
								});
								//create explosion
								createExplosion(ship.x, ship.y);
								store.dispatch(killPlayer());
							} else {
								store.dispatch(updateShipHealth(playerShip.health - 100))
							}
						}
					}
				}
			}

			if (blackHoles) {
				for (var i = 0, l = Object.keys(blackHoles).length; i < l; i++) {
					let blackHole = blackHoles[Object.keys(blackHoles)[i]];
					if (blackHole) {
						//clear stale black holes
						if(blackHole.updatedAt < staleTime || blackHole.createdAt < staleTime) {
							db().ref('blackHoles/').child(Object.keys(blackHoles)[i]).remove()
							delete blackHoles[Object.keys(blackHoles)[i]];
							//exit iteration early since missle is old
							continue;
						}
						if (collision(ship, blackHole)) {
							if (playerShip.health - 100 < 1) {
								db().ref('users/' + user.uid).update({
									...playerShip,
									dead: true,
									x: -1000,
									y: -1000,
								});
								store.dispatch(killPlayer());
							} else {
								store.dispatch(updateShipHealth(playerShip.health - 100))
							}
						}
						batchedUpdates['blackHoles/' + Object.keys(blackHoles)[i]] = {
							...blackHole,
							rotation: blackHole.rotation + 1,
							updatedAt: TIMESTAMP,
						}
					}
				}
			}

			if(explosions) {
				for (var i = 0, l = Object.keys(explosions).length; i < l; i++) {
					let explosion = explosions[Object.keys(explosions)[i]];
					if (explosion) {
						//clear stale explosion
						if(explosion.updatedAt < staleTime || explosion.createdAt < staleTime) {
							db().ref('explosions/').child(Object.keys(explosions)[i]).remove()
							delete explosions[Object.keys(explosions)[i]];
							//exit iteration early since explosion is old
							continue;
						}
						batchedUpdates['explosions/' + Object.keys(explosions)[i]] = {
							...explosion,
							frame: explosion.frame + 1,
							updatedAt: TIMESTAMP,
						}
					}
				}	
			}

			//UPDATE USER IN FIREBASE
			batchedUpdates['users/' + user.uid] = {
				...playerShip,
				x: screen.xCenter + toX,
				y: screen.yCenter + toY,
				rotation: toRotation,
				...batchedUpdates['users/' + user.uid],
				updatedAt: TIMESTAMP
			};

			//UPDATE FIREBASE ROOT WITH BATCH UPDATES
			db().ref('/').update(batchedUpdates);
			store.dispatch(redrawUniverse())
		}//KEYDOWN
	}

	//continue to next redux middleware or reducer
	return next(action)

}

function createExplosion(x, y) {
	db().ref('explosions').push({
		x,
		y,
		frame: 0,
		createdAt: TIMESTAMP,
		updatedAt: TIMESTAMP,
	})
}

function moveShipWithinUniverseBounds(store, toX, toY, toRotation, universe, screen) {
	//Y BOUNDARIES
	if (toY + screen.yCenter < 0) {
		toY = universe.height - screen.yCenter
	} else if (toY - screen.yCenter > (universe.height - screen.height)) {
		toY = 0 + screen.yCenter
	}
	//X BOUNDS
	if (toX + screen.xCenter < 0) {
		toX = universe.width - (screen.xCenter)
	} else if (toX - screen.xCenter > universe.width - screen.width) {
		toX = 0 + screen.xCenter
	}
	store.dispatch({
		type: 'PLAYER_SHIP_MOVE',
		x: toX,
		y: toY,
		rotation: toRotation,
	})
	return { toX, toY }
}

function collision(object1, object2) {
	if (object1 === null || object2 === null || object1 === undefined || object2 === undefined) {
		return false;
	}
	let area, x, y;
	let object1Radius = object1.width / 2
	let object2Radius = object2.width / 2
	area = object1Radius + object2Radius;
	x = (object1.x) - (object2.x);
	y = (object1.y) - (object2.y);
	if (area > Math.sqrt((x * x) + (y * y))) {
		return true;
	} else {
		return false;
	}
}

export default controllerMiddleware;	