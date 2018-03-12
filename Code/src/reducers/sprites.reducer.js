export default function spriteReducer(state={}, action) {
	
	switch(action.type) {
		case "INIT_LASER":
			let newStateFromLaser= {...state};
			newStateFromLaser[action.sprite] = {
				CanvasImage: action.image,
				width: 4,
				height: 4,
			}
			return newStateFromLaser;
			break;
		case "INIT_ASTEROID":
			let newStateFromAsteroid = {...state};
			newStateFromAsteroid[action.sprite] = {
				CanvasImage: action.image,
				width: 100,
				height: 100,
			}
			return newStateFromAsteroid;
			break;

		case "INIT_BLACK_HOLE":
			let newStateFromBlackHole = {...state};
			newStateFromBlackHole[action.sprite] = {
				CanvasImage: action.image,
				width: 400,
				height: 400,
			}
			return newStateFromBlackHole;
			break;

		case "INIT_ENEMY_SHIP":
			let newStateFromEnemyShip = {...state}
			newStateFromEnemyShip[action.sprite] = { 
				CanvasImage: action.image,
				width: 100,
				height: 100,
			}
			return newStateFromEnemyShip;
			break;

		case "INIT_EXPLOSION":
			let newStateFromExplosion = {...state}
			newStateFromExplosion[action.sprite] = { 
				CanvasImage: action.image,
				width: 100,
				height: 100,
				frame: 0,
			}
			return newStateFromExplosion;
			break;

		case "INIT_UNIVERSE":
  		let newStateFromUniverse = {...state}
			newStateFromUniverse[action.sprite] = { 
				CanvasImage: action.image,
			}
			return newStateFromUniverse;
  		break;

  	default: return state; break;
	}
}