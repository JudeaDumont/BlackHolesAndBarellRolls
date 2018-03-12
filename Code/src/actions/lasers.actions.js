export function initializeLaserCanvas (Image) {
	return { 
    type: "INIT_LASER",
    sprite: "laser",
    image: Image,
  };
}

//@canvas action
export function drawLasersCanvas (t, contexts, getState, dispatch,) {
	let state = getState();
	if (contexts && state.firebaseData.lasers) {
		let universeContext = contexts.get("Universe")		
		Object.keys(state.firebaseData.lasers).map((key) => {
			//only render if sprite is loaded
			let sprites = state.sprites;
			if(state.sprites["laser"] && state.firebaseData.lasers[key]){
				if(state.sprites["laser"].CanvasImage) {
				drawLaser(
					universeContext,
					state.screen,
					state.universe,
					state.firebaseData.lasers[key],
					state.sprites["laser"]
				)
			}
			}
		})			
	}
}

function drawLaser(universeContext, screen, universe, laser, sprite) {
	//move context to center of sprite

		universeContext.translate(
			-universe.worldX + laser.x,
			-universe.worldY + laser.y
		);

		universeContext.rotate(laser.rotation * Math.PI / 180);
		//paint sprite

		// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		// see: https://mdn.mozillademos.org/files/225/Canvas_drawimage.jpg for positioning
		universeContext
			.drawImage(
				sprite.CanvasImage,
				-(sprite.width/2),					//d(estination)x
				-(sprite.height/2),					//dy
				24,		//dwidth
				24,		//dheight
			);

		universeContext.rotate(-laser.rotation * Math.PI / 180);
		//revert to original rotation
		//universeContext.restore();
		universeContext.translate(
			-(-universe.worldX + laser.x),
			-(-universe.worldY + laser.y)
		);

}