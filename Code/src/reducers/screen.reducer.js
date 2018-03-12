import {Dimensions} from 'react-native';

//Get and cache screen dimensions for use in object placement
//and world scaling
let {width, height} = Dimensions.get('window');
let xBounds = [0, width];
let yBounds = [0, height];
let xCenter = xBounds[1]/2;
let yCenter = yBounds[1]/2;

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you, but return a new object if the state changes.
 *
 */
export default function screenReducer(state = {
	width,
	height,
	xBounds,
	yBounds,
	xCenter,
	yCenter,
}, action) {
	switch(action.type) {
		case "SCREEN_RESIZE" :
			let {width, height} = action;
			return {
				width,
				height,
				xBounds: [0, width],
				yBounds: [0, height],
				xCenter: width/2,
				yCenter: height/2,
			};
			break;

		default:
			return state;
			break;

	}	
}