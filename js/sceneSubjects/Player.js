function Player(scene) {

	const height = 5;
	const maxBullets = 5;
	const fireRate = 0.3;

	var mesh;
	var bullets;
	var nextBullet;

	var healthBar;
	var healthSprite;

	var clock = new THREE.Clock();
	var keyboard = new THREEx.KeyboardState();

	this.init = function () {

		bullets = [];
		nextBullet = -1;

		healthBar = document.getElementById("health")
		healthBar.value -= 10;

		var loader = new THREE.TextureLoader();
		var baseTexture = loader.load('images/rusty-panel/rusty-panel-albedo3b.png');
		var normalTexture = loader.load('images/rusty-panel/rusty-panel-norma-dx.png');

		var material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			normalMap: normalTexture,
			metalness: 0.6,
			roughness: 0.1
		});

		var geometry = new THREE.CylinderGeometry(2, 2, height, 16);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = height / 2;
		scene.add(mesh);

		// pool a fixed number of bullets to avoid instantiate every time
		for (var i = 0; i < maxBullets; i++) {
			var bullet = new Bullet(scene);
			bullet.init();
			bullet.setActive(false);
			bullets.push(bullet);

			// instantiate bullets to avoid frame drops on first fires
			fire("X", -1, 1);
		}

		var healthTexture = loader.load('images/health/health5.png');
		healthTexture.minFilter = THREE.LinearFilter;
		var healthMat = new THREE.SpriteMaterial({ map: healthTexture });
		healthSprite = new THREE.Sprite(healthMat);
		healthSprite.position.copy(mesh.position);
		healthSprite.position.setY(height * 0.5);
		healthSprite.scale.set(5, 5, 1);
		scene.add(healthSprite);
	}

	this.update = function (time) {

		var delta = clock.getDelta(); // seconds.
		var moveDistance = 20 * delta; // 20 pixels per second

		// move forwards/backwards/left/right
		if (keyboard.pressed("W"))
			mesh.translateZ(-moveDistance);
		if (keyboard.pressed("S"))
			mesh.translateZ(moveDistance);
		if (keyboard.pressed("A"))
			mesh.translateX(-moveDistance);
		if (keyboard.pressed("D"))
			mesh.translateX(moveDistance);

		healthSprite.position.copy(mesh.position);
		healthSprite.position.setY(height);

		if (time >= nextBullet) {
			if (keyboard.pressed("up")) {
				fire("Z", -1, time);
				healthBar.value += 10;
			}
			else if (keyboard.pressed("down")) {
				fire("Z", 1, time);
				healthBar.value -= 10;
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

}