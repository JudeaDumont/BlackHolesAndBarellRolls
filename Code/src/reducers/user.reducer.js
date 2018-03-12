export default function userReducer(state={
	uid: null,
}, action) {
	switch(action.type) {
		case "USER_SIGN_IN":
			return {
				...state,
				uid: action.uid
			};
			break;

		default: 
			return state;
			break;
	}
}