// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  //'  gl_PointSize = 10.0;\n' +
  '  gl_PointSize = u_Size;\n' +
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
let u_Size;

function setupWebGL(){
	// Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

	// Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
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
let g_selectedSegments = 10;
let g_selectedTransparancy = 1.0;

// Set up actions for HTML UI elements
function addActionsforHtmlUI(){
	// Button Events
	document.getElementById('green').onclick = function() {g_selectedColor = [0.0, 1.0, 0.0, 1.0];};
	document.getElementById('red').onclick = function() {g_selectedColor = [1.0, 0.0, 0.0, 1.0];};
	document.getElementById('clear').onclick = function() {g_shapesList = []; renderAllShapes();};
	document.getElementById('point').onclick = function() {g_selectedType=POINT;};
	document.getElementById('triangle').onclick = function() {g_selectedType=TRIANGLE;};
	document.getElementById('circle').onclick = function() {g_selectedType=CIRCLE;};
	document.getElementById('bike').onclick = function() {drawBike();};

	// Slider events
	document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
	document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
	document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });
	document.getElementById('transparentSlide').addEventListener('mouseup', function() {g_selectedTransparancy = this.value/100;});

	// Size slider event
	document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value;})

	// Circle segment slider event
	document.getElementById('segmentSlide').addEventListener('mouseup', function() { g_selectedSegments = this.value;})
}

function drawBike(){
	var scale = 12;
	var pi = Math.PI;
	var white = [1.0, 1.0, 1.0, 1.0];

	// Back wheel points
	var hub1 = [2, 2]
	var p_wheel1_1 = [4, 2];
	var p_wheel1_2 = [hub1[0] + (2 * Math.cos(pi/4)), hub1[1] + (2 * Math.sin(pi/4))]
	var p_wheel1_3 = [2, 4]
	var p_wheel1_4 = [hub1[0] - (2 * Math.cos(pi/4)), hub1[1] + (2 * Math.sin(pi/4))]
	var p_wheel1_5 = [0, 2];
	var p_wheel1_6 = [hub1[0] - (2 * Math.cos(pi/4)), hub1[1] - (2 * Math.sin(pi/4))]
	var p_wheel1_7 = [2, 0];
	var p_wheel1_8 = [hub1[0] + (2 * Math.cos(pi/4)), hub1[1] - (2 * Math.sin(pi/4))]

	// Back wheel triangles
	var wheel1_1 = new PointTriangle(scale, hub1, p_wheel1_1, p_wheel1_2);
	g_shapesList.push(wheel1_1);
	var wheel1_2 = new PointTriangle(scale, hub1, p_wheel1_2, p_wheel1_3);
	g_shapesList.push(wheel1_2);
	var wheel1_3 = new PointTriangle(scale, hub1, p_wheel1_3, p_wheel1_4);
	g_shapesList.push(wheel1_3);
	var wheel1_4 = new PointTriangle(scale, hub1, p_wheel1_4, p_wheel1_5);
	g_shapesList.push(wheel1_4);
	var wheel1_5 = new PointTriangle(scale, hub1, p_wheel1_5, p_wheel1_6);
	g_shapesList.push(wheel1_5);
	var wheel1_6 = new PointTriangle(scale, hub1, p_wheel1_6, p_wheel1_7);
	g_shapesList.push(wheel1_6);
	var wheel1_7 = new PointTriangle(scale, hub1, p_wheel1_7, p_wheel1_8);
	g_shapesList.push(wheel1_7);
	var wheel1_8 = new PointTriangle(scale, hub1, p_wheel1_8, p_wheel1_1);
	g_shapesList.push(wheel1_8);

	// Back wheel points
	var hub2 = [10, 2];
	var p_wheel2_1 = [12, 2];
	var p_wheel2_2 = [hub2[0] + (2 * Math.cos(pi/4)), hub2[1] + (2 * Math.sin(pi/4))]
	var p_wheel2_3 = [10, 4]
	var p_wheel2_4 = [hub2[0] - (2 * Math.cos(pi/4)), hub2[1] + (2 * Math.sin(pi/4))]
	var p_wheel2_5 = [8, 2];
	var p_wheel2_6 = [hub2[0] - (2 * Math.cos(pi/4)), hub2[1] - (2 * Math.sin(pi/4))]
	var p_wheel2_7 = [10, 0];
	var p_wheel2_8 = [hub2[0] + (2 * Math.cos(pi/4)), hub2[1] - (2 * Math.sin(pi/4))]

	console.log(p_wheel2_2);
	console.log(p_wheel2_3);
	console.log(p_wheel2_4);
	console.log(p_wheel2_5);
	console.log(p_wheel2_6);
	console.log(p_wheel2_7);

	// Front wheel triangles
	var wheel2_1 = new PointTriangle(scale, hub2, p_wheel2_1, p_wheel2_2);
	g_shapesList.push(wheel2_1);
	var wheel2_2 = new PointTriangle(scale, hub2, p_wheel2_2, p_wheel2_3);
	g_shapesList.push(wheel2_2);
	var wheel2_3 = new PointTriangle(scale, hub2, p_wheel2_3, p_wheel2_4);
	g_shapesList.push(wheel2_3);
	var wheel2_4 = new PointTriangle(scale, hub2, p_wheel2_4, p_wheel2_5);
	g_shapesList.push(wheel2_4);
	var wheel2_5 = new PointTriangle(scale, hub2, p_wheel2_5, p_wheel2_6);
	g_shapesList.push(wheel2_5);
	var wheel2_6 = new PointTriangle(scale, hub2, p_wheel2_6, p_wheel2_7);
	g_shapesList.push(wheel2_6);
	var wheel2_7 = new PointTriangle(scale, hub2, p_wheel2_7, p_wheel2_8);
	g_shapesList.push(wheel2_7);
	var wheel2_8 = new PointTriangle(scale, hub2, p_wheel2_8, p_wheel2_1);
	g_shapesList.push(wheel2_8);

	// Frame stays
	var p_bb = [4.5, 1.5];
	var p_seat = [4, 5];
	var stays = new PointTriangle(scale, hub1, p_bb, p_seat, [0.8, 0.8, 0.8, 1.0]);
	g_shapesList.push(stays);

	// Frame
	var p_headset = [9, 5];
	var frame = new PointTriangle(scale, p_bb, p_seat, p_headset, [0.6, 0.6, 0.6, 1.0]);
	g_shapesList.push(frame);

	// Fork
	var fork = new PointTriangle(scale, p_headset, [hub2[0]+.4, hub2[1]], [hub2[0]-.4, hub2[1]], [0.5, 0.5, 0.5, 1.0])
	g_shapesList.push(fork);



	renderAllShapes();
}


function main() {
  
	setupWebGL();
	connectVariablesToGLSL();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
	canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev); }};

	// Set up actions for html UI elements
	addActionsforHtmlUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList = []

function click(ev) {
	let [x, y] = convertCoordinatesEventToGL(ev);

	// Create a new point
	let point;
	if (g_selectedType == POINT){
		point = new Point();
	} else if (g_selectedType == TRIANGLE){
		point = new Triangle();
	} else {
		point = new Circle();
		point.segments = g_selectedSegments;
	}

	// Transparancy
	var pointColor = g_selectedColor.slice();
	pointColor[0] *= g_selectedTransparancy;
	pointColor[1] *= g_selectedTransparancy;
	pointColor[2] *= g_selectedTransparancy;
	point.color = pointColor;

	point.position = [x,y];
	point.size = g_selectedSize;
	g_shapesList.push(point);

	// Render shapes
	renderAllShapes();
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

// Draw every shape that is supposed to be in the canvas
function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
		g_shapesList[i].render();
	}

}
