function Player(scene) {

	const height = 5, radius = 2;
	const speed = 20;
	const maxBullets = 5;
	const fireRate = 0.3;

	var mesh;
	var bullets;
	var nextBullet;
	var health;
	var healthSprite;
	var healthTextures;

	var keyboard = new THREEx.KeyboardState();

	this.init = function () {

		var loader = new THREE.TextureLoader();
		var baseTexture = loader.load('images/rusty-panel/rusty-panel-albedo3b.jpg');
		var normalTexture = loader.load('images/rusty-panel/rusty-panel-norma-dx.jpg');

		var material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			normalMap: normalTexture,
			metalness: 0.6,
			roughness: 0.1,
			color: '#93EE93'
		});

		var geometry = new THREE.CylinderGeometry(radius, radius * 0.5, height, 32);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = height / 2;
		scene.add(mesh);

		bullets = [];
		nextBullet = -1;

		// pool a fixed number of bullets to avoid instantiate every time
		for (var i = 0; i < maxBullets; i++) {
			var bullet = new Bullet(scene);
			bullet.init();
			bullet.setActive(false);
			bullets.push(bullet);
		}

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

		var moveDistance = speed * delta; // speed pixels per second

		// move forwards/backwards/left/right
		if (keyboard.pressed("W"))
			mesh.translateZ(-moveDistance);
		if (keyboard.pressed("S"))
			mesh.translateZ(moveDistance);
		if (keyboard.pressed("A"))
			mesh.translateX(-moveDistance);
		if (keyboard.pressed("D"))
			mesh.translateX(moveDistance);


		if (time >= nextBullet) {
			if (keyboard.pressed("up")) {
				fire("Z", -1, time);
			}
			else if (keyboard.pressed("down")) {
				fire("Z", 1, time);
			}
			else if (keyboard.pressed("right")) {
				fire("X", 1, time);
			}
			else if (keyboard.pressed("left")) {
				fire("X", -1, time);
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
			this.setActive(false);
			return;
		}
		healthSprite.material = new THREE.SpriteMaterial({ map: healthTextures[health] });
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

	this.getRadius = function () {
		return radius;
	}

}