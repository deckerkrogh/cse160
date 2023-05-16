function main() {
	// Retrive <canvas> element
	canvas = document.getElementById('example');
	if (!canvas) {
		console.log('Failed to retrive the <canvas> element');
		return;
	}
	
	// Get the rendering context for 2DCG
	ctx = canvas.getContext('2d');

	// Draw black background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw a red vector
	const v1 = new Vector3([2.25, 2.25, 0]);
	drawVector(v1, "red");
}

function drawVector(v, color) {
	let cx = canvas.width/2;
	let cy = canvas.height/2;
	let scale = 20;

	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(cx, cy);
	ctx.lineTo(cx + (v.elements[0] * scale), cy - (v.elements[1] * scale));
	ctx.stroke();
}

function handleDrawEvent(){
	let v1x = document.getElementById("v1x").value;
	let v1y = document.getElementById("v1y").value;
	let v2x = document.getElementById("v2x").value;
	let v2y = document.getElementById("v2y").value;

	// Redraw black background to clear
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const v1 = new Vector3([v1x, v1y, 0]);
	const v2 = new Vector3([v2x, v2y, 0]);
	drawVector(v1, "red");
	drawVector(v2, "blue");

}

function handleDrawOperationEvent(){
	let operation = document.getElementById("operations-select");
	let selected_op = operation.options[operation.selectedIndex].value;
	let scalar = document.getElementById("scalar").value;
	let v1x = document.getElementById("v1x").value;
	let v1y = document.getElementById("v1y").value;
	let v2x = document.getElementById("v2x").value;
	let v2y = document.getElementById("v2y").value;

	// Redraw black background to clear
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const v1 = new Vector3([v1x, v1y, 0]);
	const v2 = new Vector3([v2x, v2y, 0]);
	drawVector(v1, "red");
	drawVector(v2, "blue");

	if (selected_op == "add"){
		let v3 = v1.add(v2);
		drawVector(v3, "green");
	}
	else if (selected_op == "sub"){
		let v3 = v1.sub(v2);
		drawVector(v3, "green");
	}
	else if (selected_op == "mul"){
		let v3 = v1.mul(scalar);
		let v4 = v2.mul(scalar);
		drawVector(v3, "green");
		drawVector(v4, "green");
	}
	else if (selected_op == "div"){
		let v3 = v1.div(scalar);
		let v4 = v2.div(scalar);
		drawVector(v3, "green");
		drawVector(v4, "green");
	}
	else if (selected_op == "mag"){
		let v1mag = v1.magnitude();
		let v2mag = v2.magnitude();
		console.log("v1mag: %f", v1mag);
		console.log("v2mag: %f", v2mag);
	}
	else if (selected_op == "norm"){
		let v1norm = v1.normalize();
		let v2norm = v2.normalize();
		drawVector(v1norm, "green");
		drawVector(v2norm, "green");
	}
	else if (selected_op == "angle"){
		console.log("angle: %f", angleBetween(v1, v2));
	}
	else if (selected_op == "area"){
		console.log("area of triangle: %f", areaTriangle(v1, v2));
		
	}
}

function angleBetween(v1, v2){
	let dot = Vector3.dot(v1, v2);
	let dotnorm = (dot / v1.magnitude()) / v2.magnitude();
	let angle = Math.acos(dotnorm);
	return angle;
}

function areaTriangle(v1, v2){
	let v3 = Vector3.cross(v1, v2);
	return v3.magnitude() / 2;
}

