// Vertex shader program
var VSHADER_SOURCE = `
	attribute vec4 a_Position; 
	attribute vec2 a_UV; 
	varying vec2 v_UV; 
	uniform mat4 u_ModelMatrix; 
	uniform mat4 u_GlobalRotateMatrix; 
	uniform mat4 u_ViewMatrix; 
	uniform mat4 u_ProjectionMatrix; 
	void main() { 
	  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position; 
		v_UV = a_UV;
	}`;

// Fragment shader program
var FSHADER_SOURCE = `
	precision mediump float; 
	varying vec2 v_UV; 
	uniform vec4 u_FragColor;
	uniform sampler2D u_Sampler0; 
	uniform int u_whichTexture; 
	void main() { 
		if (u_whichTexture == -2){
			gl_FragColor = u_FragColor;
		} else if (u_whichTexture == -1){
			gl_FragColor = vec4(v_UV, 1.0, 1.0);
		} else if (u_whichTexture == 0){
			gl_FragColor = texture2D(u_Sampler0, v_UV);
		} else {
			gl_FragColor = vec4(1,.7,.7,1);  // Reddish for error
		}
  }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_whichTexture;
let u_ViewMatrix;
let u_ProjectionMatrix;
let g_camera;

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

	// Get the storage location of a_UV
	a_UV = gl.getAttribLocation(gl.program, 'a_UV');
	if (a_UV < 0) {
		console.log('Failed to get the storage location of a_UV');
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
	
	// Get the storage location of u_ViewMatrix
	u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	if(!u_ViewMatrix){
		console.log('Failed to get the storage location of u_ViewMatrix');
	}

	// Get the storage location of u_ProjectionMatrix
	u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
	if(!u_ProjectionMatrix){
		console.log('Failed to get the storage location of u_ProjectionMatrix');
	}

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}

	// Get the storage location of u_Sampler0
	u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
	if (!u_Sampler0) {
		console.log('Failed to get the storage location of u_Sampler0');
	return false;
	}

	// Get the storage location of u_whichTexture
	u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
	if (!u_whichTexture){
		console.log('Failed to get the storage location of u_whichTexture');
	return false;
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

	document.onkeydown = keydown;

	initTextures();

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Set up camera
	g_camera = new Camera();

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

function initTextures() {
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendImageToTEXTURE0(image); };
  // Tell the browser to load an image
  image.src = 'textures/sky.jpg';

  // Can do more texture loading here
  return true;
}

function sendImageToTEXTURE0(image) {
	var texture = gl.createTexture();   // Create a texture object
	if (!texture) {
	console.log('Failed to create the texture object');
	return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable texture unit0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler0, 0);

	//gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function keydown(ev){
	if (ev.keyCode==87){  // w
		console.log("w pressed");
		g_camera.moveForward();
	}
	else if (ev.keyCode == 65){  // a
		console.log("a pressed");
		g_camera.moveLeft();
	}
	else if (ev.keyCode == 68){  // d
		console.log("d pressed");
		g_camera.moveRight();
	}
	else if (ev.keyCode == 83){  // s
		console.log("s pressed");
		g_camera.moveBackwards();
	}
	else if (ev.keyCode == 81){
		console.log("q pressed");
		g_camera.panLeft();
	}
	else if (ev.keyCode == 69){
		console.log("e pressed");
		g_camera.panRight();
	}

	renderAllShapes();
}


// Draw every shape that is supposed to be in the canvas
function renderAllShapes(){

	var renderStartTime = performance.now();

	// Pass the projection matrix
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);

	// Pass the view matrix
	gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);
	//console.log("eye: " + g_camera.eye.elements);
	//console.log("at: " + g_camera.at.elements);

	// Pass the matrix to u_ModelMatrix attribute
	var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
	
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	buildWalls();
	buildSkyAndFloor();
	buildCat();

	var duration = performance.now() - renderStartTime;
	sendTextToHTML("fps: " + Math.floor((10000/duration)/10), "fps");

}

function buildWalls(){
	var map = [[1,0,0,1],
			   [1,1,0,1],
			   [1,0,0,1],
			   [1,1,1,1]];
	var walls = [];
	for (x = 0; x < 4; x++){
		for (y = 0; y < 4; y++){
			if (map[x][y] == 1){
				let w = new Cube();
				w.matrix.translate(x, 0, y);
				w.textureNum = -2;
				w.render();
			}
		}
	}
}

function buildSkyAndFloor(){
	// Draw floor
	var floor = new Cube();
	floor.color = [0.82, 0.70, 0.54, 1.0];
	floor.textureNum = -2;
	floor.matrix.translate(0, -.75, 0.0);
	floor.matrix.scale(20,0,20);
	floor.matrix.translate(-0.5, 0, -0.5);
	floor.render();

	// Draw sky block (surrounds everything)
	var sky = new Cube();
	sky.color = [0.21,0.77,0.94,1.0];
	sky.textureNum = -2;
	sky.matrix.scale(100,100,100);
	sky.matrix.translate(-0.5, -0.5, -0.5);
	sky.render();
}

function buildCat(){
	// Draw body
	var body = new Cube();
	body.textureNum = -2;
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
	var frontRightLeg = new Cube();
	frontRightLeg.color = [1,1,0,1];
	frontRightLeg.matrix = frontLeftLeg.matrix;
	frontRightLeg.matrix.translate(-1.6, 0, 0);
	frontRightLeg.render();

	// Draw a back right leg
	var backRightLeg = new Cube();
	backRightLeg.color = [1,1,0,1];
	backRightLeg.matrix = frontRightLeg.matrix;
	backRightLeg.matrix.translate(0, 0, 7);
	backRightLeg.render();

	// Draw a back left leg
	var backLeftLeg = new Cube();
	backLeftLeg.color = [1,1,0,1];
	backLeftLeg.matrix = backRightLeg.matrix;
	backLeftLeg.matrix.translate(1.6, 0, 0);
	backLeftLeg.render();

	// Draw head
	var head = new Cube();
	head.color = [0.8,0.8,0.8];
	head.matrix.rotate(g_headAngle, 0,0,1);
	head.matrix.translate(0,0.42,-0.625);
	head.matrix.scale(0.5, 0.33, 0.25);
	head.matrix.translate(-0.5,-0.5,-0.5); // middle over origin
	head.render();

	// Draw first tail segment
	var tail1 = new Cube();
	tail1.color = [0.6,0.6,0.50,1.0];
	tail1.matrix.translate(0,0.42,0.5);
	tail1.matrix.rotate(g_tail1Angle, 0,1,0);
	tail1.matrix.translate(0,0,0.125);  // for rotate
	tail1.matrix.scale(0.08,0.08,0.4);
	tail1.matrix.translate(-0.5,-0.5,-0.5); // middle over origin
	tail1.render();

	// Draw second tail segment
	var tail2 = new Cube();
	tail2.color = [0.7,0.7,0.6,1.0];
	tail2.matrix = new Matrix4(tail1.matrix);
	tail2.matrix.rotate(g_tail2Angle, 0,1,0);  // animated
	tail2.matrix.translate(0,0,1.0);
	tail2.render();

	// Draw second tail segment
	var tail3 = new Cube();
	tail3.color = [0.8,0.7,0.6,1.0];
	tail3.matrix = new Matrix4(tail2.matrix);
	tail3.matrix.rotate(g_tail2Angle/2, 0,1,0);  // animated
	tail3.matrix.translate(0,0,1.0);
	tail3.render();
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

