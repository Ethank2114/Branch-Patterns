
function drawLine({context, x1, y1, x2, y2, p1=undefined, p2=undefined, color="Black"}) {
	context.beginPath();
	// by points
	if(p1 !== undefined && p2 !== undefined) {
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
	// by x1, y1
	} else {
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
	}
	
	context.strokeStyle = color;
	context.stroke();
}

function f(p1, p2, t) {
	return {x: (p2.x-p1.x)*t+p1.x, y:(p2.y-p1.y)*t+p1.y};
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

async function drawAnimatedLine({context, p1, p2, rate=1, step=1, color="Black"}) {
	let t = 0;
	while(t < 1) {
		let start = f(p1, p2, t);
		let end = f(p1, p2, t+step);
		
		drawLine({context:context, p1:start, p2:end});

		// Sleep
		await new Promise(r => setTimeout(r, rate));

		t += step;
		if(Math.random() * 10 < 0.5) {
			drawAnimatedLine({context:context, p1:f(p1, p2, t), p2:{x:randInt(0, 400), y:randInt(0, 400)}, rate:rate, step:step});
		}
	}
}

function drawRect(context, x, y, width, height, color="White") {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

let frame = document.getElementById("frame");
let ctx = frame.getContext("2d");

drawRect(ctx, 0, 0, frame.width, frame.height, "#aaaaaa");
// drawLine(ctx, 100, 100, 200, 200);
let width = frame.width;
let height = frame.height;

drawAnimatedLine({context:ctx, p1:{x:width / 2, y:height}, p2:{x:width / 2, y:0}, rate:10, step:0.01})