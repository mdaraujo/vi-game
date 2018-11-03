function Bullet(scene) {

	const radius = 1;

	var speed = 40;
	var maxDistance = 30;
	var demage = 1;

	var mesh;
	var direction = "X";
	var rotation = 1;
	var initialPosition = new THREE.Vector3(20, 0, 0);

	this.init = function () {
		var loader = new THREE.TextureLoader();
		var baseTexture = loader.load('images/oxidized-copper/oxidized-copper-albedo.jpg');

		var material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			metalness: 0.75,
			roughness: 0.3,
			color: '#5BB55F'
		});
		var geometry = new THREE.SphereGeometry(radius, 12, 12);
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

	this.doDemage = function () {
		return demage;
	}

	this.getPosition = function () {
		return mesh.position;
	}

	this.getRadius = function () {
		return radius;
	}

}