function Enemy(scene, player) {

	const height = 4, radius = 2;

	var mesh;
	var health;
	var healthSprite;
	var healthTextures;

	var demage = 1;
	var demageRate = 1;
	var nextDemage = -1;
	var canDoDemage = true;

	var speed = 10;
	// var moveRate = 0.3;
	// var nextMove = -1;
	// var nextPosition;
	// var isMoving = false;

	this.init = function () {

		var loader = new THREE.TextureLoader();
		var baseTexture = loader.load('images/rusty-panel/rusty-panel-albedo3b.png');
		var normalTexture = loader.load('images/rusty-panel/rusty-panel-norma-dx.png');

		var material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			normalMap: normalTexture,
			metalness: 1,
			roughness: 0.6,
			color: '#4286f4'
		});

		var geometry = new THREE.CylinderGeometry(1, radius, height, 16);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = height / 2;
		mesh.position.x = 200; // instantiate out of map
		scene.add(mesh);

		health = 5;
		healthTextures = [];

		for (var i = 0; i <= health; i++) {
			var healthTexture = loader.load('images/health/health' + i + '.png');
			healthTexture.minFilter = THREE.LinearFilter;
			healthTextures.push(healthTexture);
		}

		var healthMat = new THREE.SpriteMaterial({ map: healthTextures[health] });
		healthSprite = new THREE.Sprite(healthMat);
		healthSprite.position.setY(height * 0.3);
		healthSprite.scale.set(5, 5, 1);
		mesh.add(healthSprite);
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
		this.setActive(true);
	}

	this.takeDemage = function (demage) {
		if (demage <= 0) return;
		health -= demage;
		if (health <= 0) {
			this.setActive(false);
			return;
		}
		updateHealthSprite();
	}

	function updateHealthSprite() {
		healthSprite.material = new THREE.SpriteMaterial({ map: healthTextures[health] });
	}

	this.doDemage = function (time) {
		if (!canDoDemage) return 0;
		canDoDemage = false;
		nextDemage = time + demageRate;
		return demage;
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

	this.getRadius = function () {
		return radius;
	}

}