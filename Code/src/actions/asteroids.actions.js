export function initializeAsteroidCanvas (Image) {
	return { 
    type: "INIT_ASTEROID",
    sprite: "asteroid",
    image: Image,
  };
}

//@canvas action
export function drawAsteroidsCanvas (t, contexts, getState, dispatch,) {
	let state = getState();
	if (contexts && state.firebaseData.asteroids) {
		let universeContext = contexts.get("Universe")		
		Object.keys(state.firebaseData.asteroids).map((key) => {
			//only render if sprite is loaded
			if(state.sprites["asteroid"] && state.firebaseData.asteroids[key]){
				if(state.sprites["asteroid"].CanvasImage) {
				drawAsteroid(
					universeContext,
					state.screen,
					state.universe,
					state.firebaseData.asteroids[key],
					state.sprites["asteroid"]
				)
			}
			}
		})			
	}
}

function drawAsteroid(universeContext, screen, universe, asteroid, sprite) {
	//move context to center of sprite
		universeContext.translate(
			-universe.worldX + asteroid.x,
			-universe.worldY + asteroid.y
		);		
		//rotate the canvas
		universeContext.rotate(asteroid.rotation * Math.PI / 180);		
		//paint sprite

		// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		// see: https://mdn.mozillademos.org/files/225/Canvas_drawimage.jpg for positioning
		universeContext
			.drawImage(
				sprite.CanvasImage,
				-(sprite.width/2),					//d(estination)x
				-(sprite.height/2),					//dy
				100,		//dwidth
				100,		//dheight
			);
		//revert to original rotation
		//rotate the canvas
		universeContext.rotate(-(asteroid.rotation * Math.PI / 180));
		//universeContext.restore();
		universeContext.translate(
			-(-universe.worldX + asteroid.x),
			-(-universe.worldY + asteroid.y)
		);
}