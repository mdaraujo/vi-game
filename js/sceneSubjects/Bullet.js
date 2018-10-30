function Bullet(scene) {

	const speed = 40;
	const maxDistance = 30;

	var mesh;
	var direction;
	var rotation;
	var initialPosition;

	this.init = function () {
		var loader = new THREE.TextureLoader();
		var baseTexture = loader.load('images/oxidized-copper/oxidized-copper-albedo.png');
		var normalTexture = loader.load('images/oxidized-copper/oxidized-copper-normal-ue.png');
		var roughnessTexture = loader.load('images/oxidized-copper/oxidized-copper-roughness.png');

		var material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			normalMap: normalTexture,
			roughnessMap: roughnessTexture,
			color: "#202020"
		});
		var geometry = new THREE.SphereGeometry(1, 12, 12);
		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	}

	this.update = function (time, delta) {
		if (direction == "X")
			mesh.translateX(speed * rotation * delta);
		else if (direction == "Z")
			mesh.translateZ(speed * rotation * delta);

		if (initialPosition.distanceTo(mesh.position) > maxDistance)
			this.setActive(false);
	}

	this.setPosition = function (position) {
		initialPosition = position;
		mesh.position.copy(position);
	}

	this.setDirection = function (dir) {
		direction = dir;
	}

	this.setRotation = function (rot) {
		rotation = rot;
	}

	this.setActive = function (active) {
		mesh.visible = active;
	}

	this.isActive = function () {
		return mesh.visible;
	}

}