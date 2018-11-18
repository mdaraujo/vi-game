function Lights(scene) {

	const height = 100;

	var cameraLight;
	var light1;
	var light2;
	var light3;
	var light4;

	this.init = function () {
		cameraLight = new THREE.DirectionalLight(0xffffff, 0.7);
		scene.add(cameraLight);

		light1 = new THREE.PointLight(0xffffff, 5, 200);
		light1.position.set(labWidth / 2, height, labHeight / 2);
		scene.add(light1);

		light2 = new THREE.PointLight(0xffffff, 5, 200);
		light2.position.set(-labWidth / 2, height, labHeight / 2);
		scene.add(light2);

		light3 = new THREE.PointLight(0xffffff, 5, 200);
		light3.position.set(labWidth / 2, height, -labHeight / 2);
		scene.add(light3);

		light4 = new THREE.PointLight(0xffffff, 5, 200);
		light4.position.set(-labWidth / 2, height, -labHeight / 2);
		scene.add(light4);
	}

	this.update = function (time, delta) {
		cameraLight.position.setX(camera.position.x);
		cameraLight.position.setY(camera.position.y);
		cameraLight.position.setZ(camera.position.z);
	}

	this.delete = function () {
		scene.remove(cameraLight);
		scene.remove(light1);
		scene.remove(light2);
		scene.remove(light3);
		scene.remove(light4);
	}
}