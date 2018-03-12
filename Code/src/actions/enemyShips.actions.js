export function initializeEnemyShipCanvas (ShipCanvasImage) {
	return { 
    	type: "INIT_ENEMY_SHIP",
    	sprite: "ship",
    	image: ShipCanvasImage,
    };
}

//@canvas action
export function drawEnemyShipsCanvas (t, contexts, getState, dispatch) {
	let state = getState()
	let {universe, screen, sprites, firebaseData, user } = state;
	let enemyShips = firebaseData.users;
	if (contexts && sprites["ship"].CanvasImage && enemyShips) {
		let universeContext = contexts.get("Universe")		
		Object.keys(enemyShips).map((key) => {
			let ship = enemyShips[key]//val()
			//only render if sprite is loaded
			if(key !== user.uid && ship.dead !== true) {
				drawEnemyShip(universeContext, screen, universe, ship, sprites["ship"])	
			}
		})			
	}
}

function drawEnemyShip(universeContext, screen, universe, enemyShip, sprite) {
	//move context to center of sprite
		universeContext.translate(
			-universe.worldX + enemyShip.x,
			-universe.worldY + enemyShip.y
		);		
		//rotate the canvas
		universeContext.rotate(enemyShip.rotation * Math.PI / 180);		
		//paint sprite

			universeContext
            			// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            			// see: https://mdn.mozillademos.org/files/225/Canvas_drawimage.jpg for positioning


            			.drawImage(
            				sprite.CanvasImage,
            				(enemyShip.frame >= 0 ? 0 : 1100 ) + 100 * enemyShip.frame,
            				0,
            				100,
            				100,
            				-sprite.width/2,					//d(estination)x
                            				-sprite.height/2,					//dy
            				100,		//dwidth
            				100,		//dheight
            			);
		//revert to original rotation
		//rotate the canvas
		universeContext.rotate(-(enemyShip.rotation * Math.PI / 180));
		//universeContext.restore();
		universeContext.translate(
			-(-universe.worldX + enemyShip.x),
			-(-universe.worldY + enemyShip.y)
		);	
}