//actions
import {drawShipCanvas} from '../actions/playerShip.actions';
import {drawEnemyShipsCanvas} from '../actions/enemyShips.actions';
import {drawAsteroidsCanvas} from '../actions/asteroids.actions';
import {drawLasersCanvas} from '../actions/lasers.actions';
import {drawBlackHoleCanvas}	from '../actions/blackhole.actions';
import {drawExplosionCanvas} from '../actions/explosions.actions';


// the redux action to register a context 
// (you can call it after a canvas is mounted)
// this also clears the context by specifying a function in "paintOnce" 
// (though you can just register it and do the painting later)
export function initializeUniverseCanvas (canvasContext, UniverseCanvasImage) {
	return { 
    	type: "INIT_UNIVERSE",
    	sprite: "universe",
    	image: UniverseCanvasImage,
    	meta: { 
    		registerContext: { 
    			name: "Universe",
    			ctx: canvasContext
    		},
    		paintOnce: (t, contexts, getState, dispatch) => {
    			drawUniverse(t, contexts, getState, dispatch)
    		}
      }
    };
}

export function redrawUniverse () {
	return { 
  	type: "DRAW_UNIVERSE",
  	meta: {
  		paintOnce: (t, contexts, getState, dispatch) => {
  			if (contexts.get("Universe")) {
  				contexts.get("Universe").clearRect(0, 0, screen.width, screen.height)
  				drawUniverse(t, contexts, getState, dispatch)
  			}
  		}
  	}
	};
}			

//@canvas action
export function drawUniverse (t, contexts, getState, dispatch) {
	let state = getState()
	let {universe, screen } = state;
	//change to sprite
	let img = universe.CanvasImage;
	if (contexts && img) {
		let universeContext = contexts.get("Universe")

		//draw a black canvas before the image
		universeContext.fillRect(0,0,screen.width,screen.height);
		// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		// see: https://mdn.mozillademos.org/files/225/Canvas_drawimage.jpg for positioning
		universeContext.drawImage(
			img,
			universe.worldX, 	//s(ource)x
			universe.worldY, 	//sy
			screen.width,			//sWidth
			screen.height,		//sHeight
			0,								//d(estination)x
			0,								//dy
			screen.width,			//dwidth
			screen.height,		//dheight
		);
		drawBlackHoleCanvas(t, contexts, getState, dispatch)
		drawEnemyShipsCanvas(t, contexts, getState, dispatch)
		drawShipCanvas(t, contexts, getState, dispatch)
		drawAsteroidsCanvas(t, contexts, getState, dispatch)
		drawLasersCanvas(t, contexts, getState, dispatch)
		drawExplosionCanvas(t, contexts, getState, dispatch)
	}
}
