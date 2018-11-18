function Enemy(scene, player, hud, object) {

	const radius = 1.3;
	const scale = 0.8;

	var mesh;
	var health;
	var healthSprite;

	var demage;
	var demageRate;
	var nextDemage;
	var canDoDemage;

	var type;
	var speed;
	const speedTypes = [12, 15, 18];
	const colorTypes = ['#DCA56F', '#275092', '#FFD700'];


	this.init = function () {

		type = Math.floor(Math.random() * speedTypes.length);
		speed = speedTypes[type];

		var material = new THREE.MeshStandardMaterial({
			map: METAL_BASE_TEXTURE,
			normalMap: METAL_NORMAL_TEXTURE,
			metalness: 1,
			roughness: 0.4,
			color: colorTypes[type]
		});

		mesh = object;

		mesh.scale.set(scale, scale, scale);

		mesh.traverse(function (node) {
			if (node.isMesh) node.material = material;
		});

		scene.add(mesh);

		health = 5;
		var healthMat = new THREE.SpriteMaterial({ map: HEALTH_TEXTURES[health] });
		healthSprite = new THREE.Sprite(healthMat);
		healthSprite.position.setY(scale * 14);
		healthSprite.scale.set(7, 7, 1);
		mesh.add(healthSprite);

		this.reset();
	}

	this.update = function (time, delta) {

		if (time >= nextDemage) {
			canDoDemage = true;
		}

		var dx = player.getPosition().x - mesh.position.x;
		var dy = player.getPosition().z - mesh.position.z;

		var length = Math.sqrt(dx * dx + dy * dy);
		if (length > 0.1) {
			dx /= length;
			dy /= length;

			mesh.position.x += dx * speed * delta;
			mesh.position.z += dy * speed * delta;

			var angle;
			if (dx < 0)
				angle = Math.asin(dx);
			else
				angle = Math.acos(dy);

			if (dx < 0 && dy < 0) {
				angle = Math.PI - angle;
			}
			mesh.rotation.y = angle;
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

		mesh.traverse(function (node) {
			if (node.isMesh) node.material.color.set(colorTypes[type]);
		});

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