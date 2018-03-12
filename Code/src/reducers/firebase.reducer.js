export default function firebaseReducer(state = {
	
	users: {},
	asteroids: {},
	lasers: {},
	blackHoles: {},
	explosions: {},

}, action) {

	let newState = {...state}

  switch (action.type) {

  	case "FIREBASE_STATE_UPDATE":
			return action.state;
			break;

		default: return state; break;

	}
}