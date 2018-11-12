function EnemySpawner(scene, player, hud) {

	const maxEnemies = 12;

	var spawnRate;
	var nextSpawnRateChange;
	var enemies;
	var nextEnemy;
	var spawnPositions;

	var clock = new THREE.Clock();
	var delta;

	this.init = function () {

		spawnRate = 3;
		nextSpawnRateChange = 30;
		enemies = [];
		nextEnemy = -1;

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
					var posX = (Math.random() > 0.5) ? -labWidth : labWidth;
					var posY = (Math.random() > 0.5) ? -labHeight : labHeight;
					enemies[i].respawn(new THREE.Vector3(posX / 2, 0, posY / 2));
					break;
				}
			}
			nextEnemy = time + spawnRate;
		}

		if (spawnRate > 0.5 && time >= nextSpawnRateChange) {

			spawnRate -= 0.5;
			nextSpawnRateChange = time + 30;
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