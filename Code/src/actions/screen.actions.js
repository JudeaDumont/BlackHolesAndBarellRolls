export function resizeScreen(width, height) {
	return {
		type: "SCREEN_RESIZE",
		width,
		height,
	}
}