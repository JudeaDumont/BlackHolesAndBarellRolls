import calculateVector from '../functions/calculateVector';

export function updateShipHealth(health) {
	return {
		type: "PLAYER_SHIP_DAMAGE",
		health 
	}
}

export function killPlayer() {
	return {
		type: "PLAYER_SHIP_DIED",
		dead: true, 
	}
}

export function respawnPlayer(x, y) {
	return {
		type: "PLAYER_SHIP_RESPAWN",
		dead: false,
		x,
		y,
	}
}

export function initializePlayerShipCanvas (ShipCanvasImage) {
	return { 
    	type: "INIT_PLAYER_SHIP",
    	sprite: "ship",
    	image: ShipCanvasImage,
    	meta: {
    		paintOnce: drawShipCanvas
      	}
    };
}

//@canvas action
export function drawShipCanvas (t, contexts, getState, dispatch) {
	let state = getState()
	let {universe, screen, playerShip } = state;
	let img = playerShip.CanvasImage;
	let rotation = playerShip.rotation;
	let frame = playerShip.frame;

	if (contexts && img && playerShip.dead == false) {
		let universeContext = contexts.get("Universe")
		//move context to center of sprite
		universeContext.translate(
			screen.xCenter,
		 	screen.yCenter
		);		
		//rotate the canvas
		universeContext.rotate(playerShip.rotation * Math.PI / 180);		
		//paint sprite'

		universeContext
			// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			// see: https://mdn.mozillademos.org/files/225/Canvas_drawimage.jpg for positioning


			.drawImage(
				img,
				(frame >= 0 ? 0 : 1100 ) + 100 * frame,
				0,
				100,
				100,
				-playerShip.width/2,					//d(estination)x
				-playerShip.height/2,					//dy
				100,		//dwidth
				100,		//dheight
			);
		//revert to original rotation/position
		universeContext.rotate(-(playerShip.rotation * Math.PI / 180));
		universeContext.translate(
			-screen.xCenter,
		 	-screen.yCenter
		);
	}
}
