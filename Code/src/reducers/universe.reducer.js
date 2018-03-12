/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you, but return a new object if the state changes.
 *
 */
export default function universeReducer(
	state = { /*default Ship State*/
				
				width: 4412, //same as image source
				height: 1939,
				scale: 1,
				worldX: 0,
				worldY: 0,
				CanvasImage: null,

			}, action) {
  
  switch (action.type) {

  		case "INIT_UNIVERSE":
  			return {
  				...state,
  				CanvasImage: action.image,
  			}
  			break;


  		case 'PLAYER_SHIP_MOVE':
		    //scroll the universe since the player's x,y is static
		    return {
		    	...state,
		    	worldX: action.x,
		    	worldY: action.y,
		    }
		    break;

		  case 'PLAYER_SHIP_DIED':
				return {
					...state,
					worldX: -1000,
					worldY: -1000
				}
				break;

		  case 'PLAYER_SHIP_RESPAWN':
				return {
					...state,
					worldX: action.x,
					worldY: action.y,
				}
				break;
	  
	  	default:
	    	return state
  
  }
}