function EnemySpawner(scene, player, hud) {

	const maxEnemies = 12;
	const spawnRate = 2.5;

	var enemies;
	var nextEnemy;
	var spawnPositions;

	var clock = new THREE.Clock();
	var delta;

	this.init = function () {

		enemies = [];
		nextEnemy = -1;
		spawnPositions = []
		spawnPositions.push(new THREE.Vector3(-floorWidth / 2, 0, -floorHeight / 2));
		spawnPositions.push(new THREE.Vector3(-floorWidth / 2, 0, floorHeight / 2));
		spawnPositions.push(new THREE.Vector3(floorWidth / 2, 0, -floorHeight / 2));
		spawnPositions.push(new THREE.Vector3(floorWidth / 2, 0, floorHeight / 2));

		// pool a fixed number of enemies to avoid instantiate every time
		for (var i = 0; i < maxEnemies; i++) {
			var enemy = new Enemy(scene, player, hud);
			enemy.init();
			enemy.setActive(false);
			enemies.push(enemy);
		}
	}

	this.update = function (time) {

		if (time >= nextEnemy) {

			for (var i = 0; i < enemies.length; i++) {
				if (!enemies[i].isActive()) {
					var pos = Math.floor(Math.random() * spawnPositions.length);
					enemies[i].respawn(spawnPositions[pos]);
					break;
				}
			}

			nextEnemy = time + spawnRate;
		}

		delta = clock.getDelta();

		enemies.forEach(e => {
			if (e.isActive()) {
				e.update(time, delta);
			}
		});
	}

	this.getEnemies = function () {
		return enemies;
	}

}