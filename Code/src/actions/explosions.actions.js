export function initializeExplosionCanvas (Image) {
	return { 
    	type: "INIT_EXPLOSION",
    	sprite: "explosion",
    	image: Image,
    };
}

//@canvas action
export function drawExplosionCanvas (t, contexts, getState, dispatch,) {
	let state = getState()
	let explosions = state.firebaseData.explosions;
	if (contexts && explosions) {
		let universeContext = contexts.get("Universe")		
		Object.keys(explosions).map((key) => {
			let explosion = explosions[key]//val()
			//only render if sprite is loaded
			if(state.sprites["explosion"]){
				if(state.sprites["explosion"].CanvasImage) {
				drawExplosion(
					universeContext,
					state.screen,
					state.universe,
					explosion,
					state.sprites["explosion"]
				)
			}
			}
		})			
	}
}

function drawExplosion(universeContext, screen, universe, explosion, sprite) {
	//move context to center of sprite
		universeContext.translate(
			-universe.worldX + explosion.x,
			-universe.worldY + explosion.y
		);		
		//paint sprite
		// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		// see: https://mdn.mozillademos.org/files/225/Canvas_drawimage.jpg for positioning
		universeContext.drawImage(
			sprite.CanvasImage,
			(explosion.frame >= 0 ? 0 : 1900 ) + 100 * explosion.frame,
			0,
			100,
			100,
			-sprite.width/2,					//d(estination)x
      -sprite.height/2,					//dy
			100,		//dwidth
			100,		//dheight
		);
		//revert to original position
		universeContext.translate(
			-(-universe.worldX + explosion.x),
			-(-universe.worldY + explosion.y)
		);
}