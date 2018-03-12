/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you, but return a new object if the state changes.
 *
 */
export default function playerShipReducer(
	state = { /*default Ship State*/

  			CanvasImage: null,
        email: '',
				height: 100,
				width: 100,
				x: 1,
				y: 1,
				rotation: 36000,
				frame: 0,

				baseSpeed: 19,
				baseRotationSpeed: 6,
				
				health: 100,
				dead: false,
				points: 0,

				/*parts*/
				/*frameLevel: 1,
				shieldLevel: 1,
				thrusterLevel: 1,
				boosterLevel: 1,
				weaponsLevel: 1,*/

			}, action) {
  
  switch (action.type) {

	case "BRR":
	console.log("state.frame + 1: " + state.frame + 1);
  			return {
  				...state,
  				frame: state.frame + 1
  			}
  			break;

    case "BRL":
        console.log("state.frame + 1: " + state.frame - 1);
                return {
                    ...state,
                    frame: state.frame - 1
                }
                break;

    case "BRSTOP":
                return {
                    ...state,
                    frame: 0
                }
                break;

    case "INIT_PLAYER_SHIP":
                return {
                    ...state,
                    CanvasImage: action.image,
                }
                break;

  	case 'PLAYER_SHIP_MOVE':
			return {
				...state,
					x: action.x,
					y: action.y,
			    rotation: action.rotation,
			}
			break;

		case 'PLAYER_SHIP_DIED':
			return {
				...state,
			   dead: true,
			}
			break;
		

		case 'PLAYER_SHIP_RESPAWN':
			return {
				...state,
				x: action.x,
				y: action.y,
		    dead: false,
		    health: 100,
			}
			break;

	case 'PLAYER_SHIP_SHOOT': //TODO
	    return state
	    break;

	    case 'PLAYER_SHIP_EMAIL': //TODO
        	    return {...state, email: action.email}
        	    break;

	case "PLAYER_SHIP_DAMAGE":
		return {...state, health: action.health}
		break;
		case "PLAYER_SHIP_ADD_POINT":
        		return {...state, points: state.points + 1}
        		break;
	  
	default:
	    return state
  
  }
}