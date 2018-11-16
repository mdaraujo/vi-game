function Enemy(scene, player, hud) {

	const height = 5.5, radius = 2.2;

	var mesh;
	var health;
	var healthSprite;

	var demage;
	var demageRate;
	var nextDemage;
	var canDoDemage;

	var type;
	var speed;
	const speedTypes = [13, 16, 20];
	const colorTypes = ['#4286f4', '#706FB7', '#912522'];
	// var moveRate = 0.3;
	// var nextMove = -1;
	// var nextPosition;
	// var isMoving = false;

	this.init = function () {

		type = Math.floor(Math.random() * speedTypes.length);
		speed = speedTypes[type];

		var material = new THREE.MeshStandardMaterial({
			map: METAL_BASE_TEXTURE,
			normalMap: METAL_NORMAL_TEXTURE,
			metalness: 1,
			roughness: 0.6,
			color: colorTypes[type]
		});

		var geometry = new THREE.CylinderGeometry(radius / 2, radius, height, 32);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = height / 2;
		scene.add(mesh);

		health = 5;
		var healthMat = new THREE.SpriteMaterial({ map: HEALTH_TEXTURES[health] });
		healthSprite = new THREE.Sprite(healthMat);
		healthSprite.position.setY(height * 0.3);
		healthSprite.scale.set(5, 5, 1);
		mesh.add(healthSprite);

		this.reset();
	}

	this.update = function (time, delta) {

		if (time >= nextDemage) {
			canDoDemage = true;
		}

		// if (time >= nextMove) {
		// 	console.log("enemy move");
		// 	isMoving = true;
		// 	nextMove = time + moveRate;
		// }
		// if (isMoving) {
		// }

		// subtract (= difference vector)
		var dx = player.getPosition().x - mesh.position.x;
		var dy = player.getPosition().z - mesh.position.z;

		// normalize (= direction vector)
		// (a direction vector has a length of 1)
		var length = Math.sqrt(dx * dx + dy * dy);
		if (length > 0.1) {
			dx /= length;
			dy /= length;

			// move
			// delta is the elapsed time in seconds
			// SPEED is the speed in units per second (UPS)
			mesh.position.x += dx * speed * delta;
			mesh.position.z += dy * speed * delta;
		}
	}

	this.respawn = function (position) {
		mesh.position.x = position.x;
		mesh.position.z = position.z;
		health = 5;
		updateHealthSprite();

		nextDemage = -1;
		canDoDemage = true;

		type = Math.floor(Math.random() * speedTypes.length);
		speed = speedTypes[type];
		mesh.material.color.set(colorTypes[type]);

		this.setActive(true);
	}

	this.takeDemage = function (demage) {
		if (demage <= 0) return;
		health -= demage;
		if (health <= 0) {
			hud.addKill();
			this.setActive(false);
			return;
		}
		updateHealthSprite();
	}

	function updateHealthSprite() {
		healthSprite.material = new THREE.SpriteMaterial({ map: HEALTH_TEXTURES[health] });
	}

	this.doDemage = function (time) {
		if (!canDoDemage) return 0;
		canDoDemage = false;
		nextDemage = time + demageRate;
		return demage;
	}

	this.reset = function () {
		this.setActive(false);
		demage = 1;
		demageRate = 1;
		nextDemage = -1;
		canDoDemage = true;
	}

	this.getCanDoDemage = function () {
		return canDoDemage;
	}

	this.setActive = function (active) {
		mesh.visible = active;
	}

	this.isActive = function () {
		return mesh.visible;
	}

	this.getPosition = function () {
		return mesh.position;
	}

	this.setPositionX = function (x) {
		mesh.position.x = x;
	}

	this.setPositionZ = function (z) {
		mesh.position.z = z;
	}

	this.getRadius = function () {
		return radius;
	}

}