class Camera{
	constructor(){
		this.eye = new Vector3([0,0,3]);
		this.at = new Vector3([0,0,-100]);
		this.up = new Vector3([0,1,0]);
		this.fov = 60;
		this.speed = 0.1;
		this.alpha = 5;  // For rotation
		this.viewMatrix = new Matrix4();
		this.updateViewMatrix();
		this.projectionMatrix = new Matrix4();
		this.projectionMatrix.setPerspective(this.fov, canvas.width/canvas.height, .1, 100);
	}

	updateViewMatrix() {
		this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
						  this.at.elements[0], this.at.elements[1], this.at.elements[2],
						  this.up.elements[0], this.up.elements[1], this.up.elements[2]);
	}

	moveForward() {
		var f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		f.normalize();
		f.mul(this.speed);
		this.eye = this.eye.add(f);
		this.at = this.at.add(f);
		this.updateViewMatrix();
	}

	moveBackwards() {
		var b = new Vector3();
		b.set(this.eye);
		b.sub(this.at);
		b.normalize();
		b.mul(this.speed);
		this.eye = this.eye.add(b);
		this.at = this.at.add(b);
		this.updateViewMatrix();
	}

	moveLeft() {
		var f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		var s = Vector3.cross(this.up, f);
		s.normalize();
		s.mul(this.speed);
		this.eye.add(s);
		this.at.add(s);
		this.updateViewMatrix();
	}

	moveRight() {
		var f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		var s = Vector3.cross(f, this.up);
		s.normalize();
		s.mul(this.speed);
		this.eye.add(s);
		this.at.add(s);
		this.updateViewMatrix();
	}

	panLeft(){
		var f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		// console.log("f: " + f.elements);
		var rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		// console.log("rotmax elem's:" + rotationMatrix.elements);
		var f_prime = rotationMatrix.multiplyVector3(f);
		// console.log("fprime: " + f_prime.elements);
		this.at = f_prime.add(this.eye);
		this.updateViewMatrix();
		// console.log("eye: "+ this.eye.elements)
		// console.log("at: "+ this.at.elements)
		// console.log("\n");
	}

	panRight(){
		var f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		// console.log("f: " + f.elements);
		var rotationMatrix = new Matrix4();
		rotationMatrix.setRotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		// console.log("rotmax elem's:" + rotationMatrix.elements);
		var f_prime = rotationMatrix.multiplyVector3(f);
		// console.log("fprime: " + f_prime.elements);
		this.at = f_prime.add(this.eye);
		this.updateViewMatrix();
		// console.log("eye: "+ this.eye.elements)
		// console.log("at: "+ this.at.elements)
		// console.log("\n");
	}
}
