
function CollisionManager(player, enemySpawner, lab) {

    this.update = function (time, delta) {

        // between player and enemies
        enemySpawner.getEnemies().forEach(enemy => {
            if (enemy.isActive() && enemy.getCanDoDemage()) {
                if (collisionBetweenCircles(player, enemy)) {
                    player.takeDemage(enemy.doDemage(time));
                }
            }
        });

        // between bullets and enemies
        player.getBullets().forEach(b => {
            if (b.isActive()) {
                enemySpawner.getEnemies().forEach(enemy => {
                    if (enemy.isActive()) {
                        if (collisionBetweenCircles(b, enemy)) {
                            b.setActive(false);
                            enemy.takeDemage(b.doDemage());
                        }
                    }
                });
            }
        });

        // between enemies
        var enemies = enemySpawner.getEnemies();
        for (var i = 0; i < enemies.length - 1; i++) {
            var e1 = enemies[i];
            if (e1.isActive()) {
                for (var j = i + 1; j < enemies.length; j++) {
                    var e2 = enemies[j];
                    if (e2.isActive()) {
                        if (collisionBetweenCircles(e1, e2)) {

                            var pos1 = e1.getPosition();
                            var pos2 = e2.getPosition();
                            var dx = pos1.x - pos2.x;
                            var dy = pos1.z - pos2.z;

                            var length = Math.sqrt(dx * dx + dy * dy);

                            var intersection = 2 * e1.getRadius() - length + (e1.getRadius() * 0.01);

                            dx /= length;
                            dy /= length;

                            dx *= intersection / 2;
                            dy *= intersection / 2;

                            e1.setPositionX(pos1.x + dx);
                            e1.setPositionZ(pos1.z + dy);

                            e2.setPositionX(pos2.x - dx);
                            e2.setPositionZ(pos2.z - dy);
                        }
                    }
                }
            }
        }

        canMoveUp = true;
        canMoveDown = true;
        canMoveLeft = true;
        canMoveRight = true;

        // between player and walls
        lab.getWalls().forEach(w => {
            if (collisionCircleRectangle(player, w)) {
                var playerPos = player.getPosition();
                var wallPos = w.getPosition();
                var dx = playerPos.x - wallPos.x;
                var dy = playerPos.z - wallPos.z;

                var length = Math.sqrt(dx * dx + dy * dy);

                if (dx > 0 && dx > w.getWidth() / 2) {
                    canMoveLeft = false;
                }
                else if (dx < 0 && Math.abs(dx) > w.getWidth() / 2) {
                    canMoveRight = false;
                }
                else if (dy > 0 && dy > w.getDepth() / 2) {
                    canMoveUp = false;
                }
                else if (dy < 0 && Math.abs(dy) > w.getDepth() / 2) {
                    canMoveDown = false;
                }
            }
        });

        // between bullets and walls
        player.getBullets().forEach(b => {
            if (b.isActive()) {
                lab.getWalls().forEach(w => {
                    if (collisionCircleRectangle(b, w)) {
                        b.setActive(false);
                    }
                });
            }
        });

    }

    function collisionBetweenCircles(obj1, obj2) {
        var pos1 = obj1.getPosition();
        var pos2 = obj2.getPosition();
        var minDist = (obj1.getRadius() + obj2.getRadius()) ** 2;

        return (pos2.x - pos1.x) ** 2 + (pos1.z - pos2.z) ** 2 <= minDist;
    }

    function collisionCircleRectangle(circle, rect) {
        var circlePos = circle.getPosition();
        var rectPos = rect.getPosition();

        var dx = Math.abs(circlePos.x - rectPos.x);
        var dy = Math.abs(circlePos.z - rectPos.z);

        if (dx > (rect.getWidth() / 2 + circle.getRadius())) { return false; }
        if (dy > (rect.getDepth() / 2 + circle.getRadius())) { return false; }

        if (dx <= (rect.getWidth() / 2)) { return true; }
        if (dy <= (rect.getDepth() / 2)) { return true; }

        var cornerDistance_sq = (dx - rect.getWidth() / 2) ^ 2 +
            (dy - rect.getDepth() / 2) ^ 2;

        return (cornerDistance_sq <= (circle.getRadius() ^ 2));
    }

}