function Lights(scene) {

	const height = 100;

	var cameraLight;

	this.init = function () {
		cameraLight = new THREE.DirectionalLight(0xffffff, 0.7);
		scene.add(cameraLight);

		var light1 = new THREE.PointLight(0xffffff, 5, 200);
		light1.position.set(labWidth / 2, height, labHeight / 2);
		scene.add(light1);

		var light2 = new THREE.PointLight(0xffffff, 5, 200);
		light2.position.set(-labWidth / 2, height, labHeight / 2);
		scene.add(light2);

		var light3 = new THREE.PointLight(0xffffff, 5, 200);
		light3.position.set(labWidth / 2, height, -labHeight / 2);
		scene.add(light3);

		var light4 = new THREE.PointLight(0xffffff, 5, 200);
		light4.position.set(-labWidth / 2, height, -labHeight / 2);
		scene.add(light4);
	}

	this.update = function (time, delta) {
		cameraLight.position.setX(camera.position.x);
		cameraLight.position.setY(camera.position.y);
		cameraLight.position.setZ(camera.position.z);
	}
}