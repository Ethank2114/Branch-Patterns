
function drawLine({context, x1, y1, x2, y2, p1=undefined, p2=undefined, color="Black"}) {
	ctx.lineWidth = 3;

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

function drawRect(context, x, y, width, height, color="White") {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function f(p1, p2, t) {
	return {x: (p2.x-p1.x)*t+p1.x, y:(p2.y-p1.y)*t+p1.y};
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randColor() {
	let r = randInt(0, 255);
	let g = randInt(0, 255);
	let b = randInt(0, 255)
	return "rgb(" + r.toString() + ", "+ g.toString() + ", " + b.toString() + ")"; 
}

function mixColor(oldString, strength) {

	let rgb = oldString.substring(4, oldString.length - 1).replace(/ /g, '').split(',');
	let shift = randInt(-1 * strength, strength);
			
	let part = randInt(0, 2);
	rgb[part] = (parseInt(rgb[part]) + shift).toString();

	//rgb[0] = (parseInt(rgb[0]) + randInt(-1 * strength, strength)).toString();
	//rgb[1] = (parseInt(rgb[1]) + randInt(-1 * strength, strength)).toString();
	//rgb[2] = (parseInt(rgb[2]) + randInt(-1 * strength, strength)).toString();

	return "rgb(" + rgb[0].toString() + ", "+ rgb[1].toString() + ", " + rgb[2].toString() + ")";  
}

function pointOnBorder(width, height) {

	let p = {x:0, y:0};

	let xBounds = [0, randInt(0, width), width];
	let yBounds = [0, randInt(0, height), height];

	// 0 = x, 1 = y
	let edge = randInt(0,1);

	if(!edge) {
		p.x = xBounds[randInt(0, 1) * 2];
		p.y = yBounds[1];
	} else {
		p.x = xBounds[1];
		p.y = yBounds[randInt(0, 1) * 2];
	}
	return p;

}


// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
let stop = false;

async function drawAnimatedLine({context, p1, p2, rate=1, step=1, color="rgb(25, 100, 200)"}) {
	let t = 0;
	let isParent = false;
	while(t < 1 && !stop) {
		color = mixColor(color, 5);

		let start = f(p1, p2, t);
		let end = f(p1, p2, t+step);
		

		drawLine({context:context, p1:start, p2:end, color:color});

		let v = {x:end.x-start.x, y:end.y-start.y};

		let nextPixel = f(p1, p2, t + Math.max(Math.abs(v.x), Math.abs(v.y)));

		// console.log(end.x + v.x, end.y + v.y)

		let data = context.getImageData(Math.floor(end.x + v.x*3), Math.floor(end.y + v.y*3), 1, 1).data
		if(data[0] !== 170 && data[1] !== 170 && data[2] !== 170) {
			break;
		}

		t += step;

		await new Promise(r => setTimeout(r, rate));

		if(randInt(0, 25) == 0) {
			drawAnimatedLine({context:context, p1:f(p1, p2, t), p2:pointOnBorder(frame.width, frame.height), rate:rate, step:step, color:color});
		}


		// if(Math.floor(t * 100) === 50 ) {
		// 	drawAnimatedLine({context:context, p1:f(p1, p2, t), p2:pointOnBorder(frame.width, frame.height), rate:rate, step:step, color:color});
		// 	isParent = true
		// 	console.log(t);
		// }


		// Sleep
	}
}


let frame = document.getElementById("frame");
let ctx = frame.getContext("2d");

let rate = 1;
let step = 0.001;

async function reset() {

	stop = true

	await new Promise(r => setTimeout(r, rate * 10));

	stop = false

	drawRect(ctx, 0, 0, frame.width, frame.height, "#aaaaaa");
	let width = frame.width;
	let height = frame.height;

	drawAnimatedLine({context:ctx, p1:{x:width / 2, y:height}, p2:{x:width / 2, y:0}, rate:rate, step:step})
}

reset()
// for(let i = 0; i < 10; i++) {
// 	console.log(pointOnBorder(frame.width, frame.height));
// }