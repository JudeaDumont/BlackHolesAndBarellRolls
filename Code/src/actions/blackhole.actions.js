export function initializeBlackHoleCanvas (Image) {
	return { 
    	type: "INIT_BLACK_HOLE",
    	sprite: "blackhole",
    	image: Image,
    };
}

//@canvas action
export function drawBlackHoleCanvas (t, contexts, getState, dispatch,) {
	let state = getState()
	let blackHoles = state.firebaseData.blackHoles;
	if (contexts && blackHoles) {
		let universeContext = contexts.get("Universe")		
		Object.keys(blackHoles).map((key) => {
			let blackhole = blackHoles[key]//val()
			//only render if sprite is loaded
			if(state.sprites["blackhole"]){
				if(state.sprites["blackhole"].CanvasImage) {
				drawBlackHole(
					universeContext,
					state.screen,
					state.universe,
					blackhole,
					state.sprites["blackhole"]
				)
			}
			}
		})			
	}
}

function drawBlackHole(universeContext, screen, universe, blackhole, sprite) {
	//move context to center of sprite
		universeContext.translate(
			-universe.worldX + blackhole.x,
			-universe.worldY + blackhole.y
		);		
		//rotate the canvas
		universeContext.rotate(blackhole.rotation * Math.PI / 180);		
		//paint sprite

		// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		// see: https://mdn.mozillademos.org/files/225/Canvas_drawimage.jpg for positioning
		universeContext
			.drawImage(
				sprite.CanvasImage,
				-sprite.width/2,
				-sprite.height/2,					//d(estination)x			//dy
				sprite.width,		//dwidth
				sprite.height,		//dheight
			);
		//revert to original rotation
		//rotate the canvas
		universeContext.rotate(-(blackhole.rotation * Math.PI / 180));
		//universeContext.restore();
		universeContext.translate(
			-(-universe.worldX + blackhole.x),
			-(-universe.worldY + blackhole.y)
		);
}