class Triangle{
	constructor(){
		this.type = 'triangle';
		this.position = [0.0, 0.0, 0.0]
		this.color = [1.0, 1.0, 1.0, 1.0]
		this.size = 5.0;
	}

	render(){
		var xy = this.position;
		var rgba = this.color;
		var size = this.size;

		// Pass the color of a point to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		// Pass the size of a point to u_Size
		gl.uniform1f(u_Size, size);

		// Draw
		var d = this.size/200.0;  // delta
		drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
	}

}

class PointTriangle{
	constructor(scale, p0, p1, p2, color = [1.0, 1.0, 1.0, 1.0]){
		this.type = 'point_triangle';
		this.p0 = p0;
		this.p1 = p1;
		this.p2 = p2;
		this.color = color;
		this.scale = scale;
	}

	render(){
		var rgba = this.color;
		var p0x = this.p0[0] / this.scale;
		var p0y = this.p0[1] / this.scale;
		var p1x = this.p1[0] / this.scale;
		var p1y = this.p1[1] / this.scale;
		var p2x = this.p2[0] / this.scale;
		var p2y = this.p2[1] / this.scale;

		// Pass the color of a point to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		// Pass the size of a point to u_Size
		gl.uniform1f(u_Size, 1);

		// Draw
		drawTriangle([p0x, p0y, p1x, p1y, p2x, p2y]);
	}
}

function drawTriangle(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // if (a_Position < 0) {
  //   console.log('Failed to get the storage location of a_Position');
  //   return -1;
  // }

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

	gl.drawArrays(gl.TRIANGLES, 0, n);

  return n;
}
