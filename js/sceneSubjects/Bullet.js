function Bullet(scene) {

	const radius = 1;
	const textureRepeat = 3;

	var speed = 40;
	var maxDistance = 30;
	var demage = 1;

	var mesh;
	var direction = "X";
	var rotation = 1;
	var initialPosition = new THREE.Vector3(20, 0, 0);

	this.init = function () {

		BULLET_BASE_TEXTURE.repeat.set(textureRepeat, textureRepeat);

		var material = new THREE.MeshStandardMaterial({
			map: BULLET_BASE_TEXTURE,
			metalness: 0.75,
			roughness: 0.3
		});
		var geometry = new THREE.SphereGeometry(radius, 32, 32);
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