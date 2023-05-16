class Cube{
	constructor(){
		this.type = 'cube';
		this.color = [1.0, 1.0, 1.0, 1.0]
		this.matrix = new Matrix4();
	}

	render(){
		var rgba = this.color;

		// Pass the color of a point to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		// Pass the matrix to a ModelMatrix attribute
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Draw front of cube
		drawTriangle3DUV( [0,0,0,  1,1,0, 1,0,0], [1,0, 0,1, 1,1]);
		//drawTriangle3D([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
		drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);

		// Draw top of cube
		gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
		//drawTriangle3D([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);
		drawTriangle3D([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);

		// Draw right side of cube
		gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
		drawTriangle3D([1,1,0,  1,0,1,  1,1,1]);
		drawTriangle3D([1,1,0,  1,0,0,  1,0,1]);

		// Draw left side of cube
		gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
		drawTriangle3D([0,0,0,  0,1,1,  0,1,0]);
		drawTriangle3D([0,0,0,  0,0,1,  0,1,1]);

		// Draw bottom of cube
		gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
		drawTriangle3D([0,0,0,  1,0,0,  1,0,1]);
		drawTriangle3D([0,0,0,  1,0,1,  0,0,1]);
		
		// Draw back of cube
		gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
		drawTriangle3D([0,0,1,  1,1,1,  1,0,1]);
		drawTriangle3D([0,0,1,  0,1,1,  1,1,1]);

	}
}
