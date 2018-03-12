export function tickEngineClock (keys) {
	return {
		type: 'GAME_CLOCK_TICK',
		keys,
	}
}