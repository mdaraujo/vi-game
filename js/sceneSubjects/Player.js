function Player(scene) {

	const scale = 1.5;
	const radius = scale;

	const speed = 20;

	const maxBullets = 5;
	const fireRate = 0.3;

	var mesh;
	var bullets;
	var nextBullet;
	var health;
	var healthSprite;

	this.init = function () {

		nextBullet = -1;
		// pool a fixed number of bullets to avoid instantiate every time
		bullets = [];
		for (var i = 0; i < maxBullets; i++) {
			var bullet = new Bullet(scene);
			bullet.init();
			bullet.setActive(false);
			bullets.push(bullet);
		}

		health = 5;
		var healthMat = new THREE.SpriteMaterial({ map: HEALTH_TEXTURES[health] });
		healthSprite = new THREE.Sprite(healthMat);
		healthSprite.position.setY(scale * 2);
		healthSprite.scale.set(5, 5, 1);

		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath('models/Muhammer/');
		var url = "Muhammer.mtl";
		mtlLoader.load(url, function (materials) {

			materials.preload();

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath('models/Muhammer/');
			objLoader.load('Muhammer.obj', function (object) {

				mesh = object;

				mesh.scale.set(scale, scale, scale);

				mesh.position.set(0, scale, 0);

				mesh.add(healthSprite);

				scene.add(mesh);

			}, null, null);

		});
	}

	this.update = function (time, delta) {

		var moveDistance = speed * delta; // speed pixels per second

		if (keyboard.pressed("W")) {
			if (canMoveUp)
				mesh.position.z -= moveDistance;
		}
		else if (keyboard.pressed("S")) {
			if (canMoveDown)
				mesh.position.z += moveDistance;
		}

		if (keyboard.pressed("A")) {
			if (canMoveLeft)
				mesh.position.x -= moveDistance;
		}
		else if (keyboard.pressed("D")) {
			if (canMoveRight)
				mesh.position.x += moveDistance;
		}

		if (time >= nextBullet) {
			if (keyboard.pressed("up")) {
				fire("Z", -1, time);
				mesh.rotation.y = Math.PI;
			}
			else if (keyboard.pressed("down")) {
				fire("Z", 1, time);
				mesh.rotation.y = 0;
			}
			else if (keyboard.pressed("right")) {
				fire("X", 1, time);
				mesh.rotation.y = Math.PI / 2;
			}
			else if (keyboard.pressed("left")) {
				fire("X", -1, time);
				mesh.rotation.y = -Math.PI / 2;
			}
		}

		bullets.forEach(b => {
			if (b.isActive()) {
				b.update(time, delta);
			}
		});
	}

	function fire(direction, rotation, time) {

		var position = new THREE.Vector3();
		mesh.getWorldPosition(position);
		position.y += scale * 2;

		for (var i = 0; i < maxBullets; i++) {
			if (!bullets[i].isActive()) {
				bullets[i].setPosition(position);
				bullets[i].setDirection(direction);
				bullets[i].setRotation(rotation);
				bullets[i].setActive(true);
				break;
			}
		}
		nextBullet = time + fireRate;
	}

	this.takeDemage = function (demage) {
		if (demage <= 0) return;
		health -= demage;
		if (health < 0) {
			sceneManager.endGame();
			return;
		}
		healthSprite.material = new THREE.SpriteMaterial({ map: HEALTH_TEXTURES[health] });
	}

	this.reset = function () {
		health = 5;
		healthSprite.material = new THREE.SpriteMaterial({ map: HEALTH_TEXTURES[health] });
		mesh.position.x = -1;
		mesh.position.z = 0;
		mesh.rotation.y = 0;

		bullets.forEach(b => {
			if (b.isActive()) {
				b.setActive(false);
			}
		});
		nextBullet = -1;
	}

	this.setActive = function (active) {
		mesh.visible = active;
	}

	this.isActive = function () {
		return mesh.visible;
	}

	this.getBullets = function () {
		return bullets;
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