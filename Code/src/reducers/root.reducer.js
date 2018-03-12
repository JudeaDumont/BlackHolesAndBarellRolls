import {combineReducers} from 'redux';

//Reducer Imports
import playerShipReducer from './playerShip.reducer';
import spritesReducer from './sprites.reducer';
import universeReducer from './universe.reducer';
import screenReducer from './screen.reducer';
import userReducer from './user.reducer';
import firebaseReducer from './firebase.reducer';

const rootReducer = combineReducers({
	firebaseData: firebaseReducer,
	playerShip: playerShipReducer,
	universe: universeReducer,
	sprites: spritesReducer,
	screen: screenReducer,
	user: userReducer,
});
export default rootReducer;