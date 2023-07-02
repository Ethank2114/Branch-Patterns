// windowSize.js
// Ethan Kerr

function checkSize() {
	if(frame.width !== window.innerWidth - 16) {
		frame.width = window.innerWidth - 16
		reset();
	}

	if(frame.height !== window.innerHeight - 16) {
		frame.height = window.innerHeight - 16
		reset();
	}

	// console.log(window.innerWidth, window.innerHeight)
}

window.onresize = function() {
	checkSize()
}
checkSize()