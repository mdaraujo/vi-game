function GeneralLights(scene) {

	var cameraLight;
	var light1;
	var light2;

	this.init = function () {
		cameraLight = new THREE.DirectionalLight(0xffffff, 1);
		cameraLight.position.set(0, 20, 70);
		scene.add(cameraLight);

		light1 = new THREE.PointLight(0xffffff, 5, 200);
		light1.position.set(0, 100, 50);
		scene.add(light1);

		light2 = new THREE.PointLight(0xffffff, 5, 200);
		light2.position.set(0, 100, -50);
		scene.add(light2);
	}

	this.update = function (time) {
		cameraLight.position.setX(camera.position.x);
		cameraLight.position.setY(camera.position.y);
		cameraLight.position.setZ(camera.position.z);
	}
}