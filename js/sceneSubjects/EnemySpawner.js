function EnemySpawner(scene, player, hud) {

	const maxEnemies = 5;
	const spawnRate = 3;

	var enemies;
	var nextEnemy;
	var spawnPosition;

	var clock = new THREE.Clock();
	var delta;

	this.init = function () {

		enemies = [];
		nextEnemy = -1;
		spawnPosition = new THREE.Vector3(-60, 0, -60);

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
					enemies[i].respawn(spawnPosition);
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