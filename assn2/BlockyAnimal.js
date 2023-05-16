// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'uniform mat4 u_ModelMatrix;\n' +
	'uniform mat4 u_GlobalRotateMatrix;\n' +
	'void main() {\n' +
	'  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
	'}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Global Variables
let canvas;
let gl;
let a_Position;
let u_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

	gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	console.log('Failed to intialize shaders.');
	return;
	}

	// Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	// Get the storage location of u_ModelMatrix
	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	if(!u_ModelMatrix){
		console.log('Failed to get the storage location of u_ModelMatrix')
	}

	// Get the storage location of u_GlobalRotateMatrix
	u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
	if(!u_GlobalRotateMatrix){
		console.log('Failed to get the storage location of u_GlobalRotateMatrix');
	}

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}

}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// UI globals
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_tail1Angle = 0;
let g_tail2Angle = 0;
let g_tailAnimation = false;
let g_rotateHead = false;
let g_headAngle = 0;
let g_rotateBody = false;

// Set up actions for HTML UI elements
function addActionsforHtmlUI(){
	// Button Events
	document.getElementById('animateTailOn').onclick = function() {g_tailAnimation = true;};
	document.getElementById('animateTailOff').onclick = function() {g_tailAnimation = false;};
	document.getElementById('animateHeadOn').onclick = function() {g_rotateHead = true;};
	document.getElementById('animateHeadOff').onclick = function() {g_rotateHead = false;};
	
	document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
	document.getElementById('tail1Slide').addEventListener('mousemove', function() {g_tail1Angle = this.value; renderAllShapes(); });
	document.getElementById('tail2Slide').addEventListener('mousemove', function() {g_tail2Angle = this.value; renderAllShapes(); });

	document.addEventListener("click", function(e){if (e.shiftKey) {shiftClick();}});
}


function main() {
  
	setupWebGL();
	connectVariablesToGLSL();

	// Register function (event handler) to be called on a mouse press
  	canvas.onmousedown = click;

	// Set up actions for html UI elements
	addActionsforHtmlUI();

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	//renderAllShapes();
	requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

// Called by browser repeatedly
function tick(){
	// Debug info
	g_seconds = performance.now()/1000.0-g_startTime;
	//console.log(g_seconds);

	// Update animation angles
	updateAnimationAngles();

	// Draw everything
	renderAllShapes();

	// Tell browser to update again when it has time
	requestAnimationFrame(tick);
}


function updateAnimationAngles(){
	if (g_tailAnimation){
		g_tail1Angle = 45*Math.sin(g_seconds*4);
		g_tail2Angle = 45*Math.sin(g_seconds*4);
	}
	if (g_rotateHead){
		g_headAngle = 20*Math.sin(g_seconds*4);
	}
	if (g_rotateBody){
		g_rotateBody = 20*Math.sin(g_seconds*4);
	}

}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes(){

	var renderStartTime = performance.now();

	// Pass the matrix to u_ModelMatrix attribute
	var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
	
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Draw body
	var body = new Cube();
	body.color = [0.7,0.5,0.2,1.0];
	body.matrix.rotate(g_rotateBody, 1,0,0);
	body.matrix.translate(-.16,0,-0.5);
	body.matrix.scale(0.33, 0.5, 1.0);
	body.render();

	// Draw a front left leg
	var frontLeftLeg = new Cube();
	//frontLeftLeg.matrix = body.matrix;
	frontLeftLeg.color = [1,1,0,1];
	frontLeftLeg.matrix.translate(0.04,-0.33,-0.5);
	//frontLeftLeg.matrix.translate(0.5,0.5,0.5); // middle over origin
	//frontLeftLeg.matrix.rotate(90, 1,0,0);
	//frontLeftLeg.matrix.translate(-0.5,-0.5,-0.5); // middle over origin
	frontLeftLeg.matrix.scale(0.125, .33, .125);
	frontLeftLeg.render();

	// Draw a front right leg
	frontRightLeg = new Cube();
	frontRightLeg.color = [1,1,0,1];
	frontRightLeg.matrix = frontLeftLeg.matrix;
	frontRightLeg.matrix.translate(-1.6, 0, 0);
	frontRightLeg.render();

	// Draw a back right leg
	backRightLeg = new Cube();
	backRightLeg.color = [1,1,0,1];
	backRightLeg.matrix = frontRightLeg.matrix;
	backRightLeg.matrix.translate(0, 0, 7);
	backRightLeg.render();

	// Draw a back left leg
	backLeftLeg = new Cube();
	backLeftLeg.color = [1,1,0,1];
	backLeftLeg.matrix = backRightLeg.matrix;
	backLeftLeg.matrix.translate(1.6, 0, 0);
	backLeftLeg.render();

	// Draw head
	head = new Cube();
	head.color = [0.8,0.8,0.8];
	head.matrix.rotate(g_headAngle, 0,0,1);
	head.matrix.translate(0,0.42,-0.625);
	head.matrix.scale(0.5, 0.33, 0.25);
	head.matrix.translate(-0.5,-0.5,-0.5); // middle over origin
	head.render();

	// Draw first tail segment
	tail1 = new Cube();
	tail1.color = [0.6,0.6,0.50,1.0];
	tail1.matrix.translate(0,0.42,0.5);
	tail1.matrix.rotate(g_tail1Angle, 0,1,0);
	tail1.matrix.translate(0,0,0.125);  // for rotate
	tail1.matrix.scale(0.08,0.08,0.4);
	tail1.matrix.translate(-0.5,-0.5,-0.5); // middle over origin
	tail1.render();

	// Draw second tail segment
	tail2 = new Cube();
	tail2.color = [0.7,0.7,0.6,1.0];
	tail2.matrix = new Matrix4(tail1.matrix);
	tail2.matrix.rotate(g_tail2Angle, 0,1,0);  // animated
	tail2.matrix.translate(0,0,1.0);
	tail2.render();

	// Draw second tail segment
	tail3 = new Cube();
	tail3.color = [0.8,0.7,0.6,1.0];
	tail3.matrix = new Matrix4(tail2.matrix);
	tail3.matrix.rotate(g_tail2Angle/2, 0,1,0);  // animated
	tail3.matrix.translate(0,0,1.0);
	tail3.render();

	var duration = performance.now() - renderStartTime;
	sendTextToHTML("fps: " + Math.floor((10000/duration)/10), "fps");

}

function sendTextToHTML(text, htmlID){
	var htmlElm = document.getElementById(htmlID);
	if(!htmlElm){
		console.log("Failed to get " + htmlID + " from HTML");
		return;
	}
	htmlElm.innerHTML = text;
}


function click(ev) {
	let [x, y] = convertCoordinatesEventToGL(ev);

	// Rotate
	if(x > 0) {
		g_globalAngle += 15;
	}
	else {
		g_globalAngle -= 15;
	}

	// Render shapes
	renderAllShapes();
}

function shiftClick(){
	g_rotateBody = true;
}


// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev){
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

	return ([x,y]);
}

