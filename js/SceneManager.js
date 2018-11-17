// global variables
const keyboard = new THREEx.KeyboardState();
const masterClock = new THREE.Clock();

var camera;
var controls;

var isPaused;
var lastStopTime;
var gameEnded;

var canMoveUp;
var canMoveDown;
var canMoveLeft;
var canMoveRight;

function SceneManager(canvas) {

    lastStopTime = 0;
    gameEnded = false;

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);

    var cameraSubject = new Camera(scene, screenDimensions);
    var lights = new Lights(scene);
    var hud;
    var lab;
    var player;
    var enemySpawner;
    const sceneSubjects = createSceneSubjects(scene);

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#202020");

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function createSceneSubjects(scene) {
        hud = new HUD(scene);
        lab = new Lab(scene, lights);
        player = new Player(scene, lab);
        enemySpawner = new EnemySpawner(scene, player, hud);

        const sceneSubjects = [
            lab,
            player,
            enemySpawner,
            hud,
        ];

        return sceneSubjects;
    }

    this.init = function () {
        new TextureManager(); // load textures

        cameraSubject.init();
        lights.init();

        for (let i = 0; i < sceneSubjects.length; i++)
            sceneSubjects[i].init();

        isPaused = true;
    }

    this.update = function () {
        renderer.render(scene, camera);

        const delta = masterClock.getDelta();
        const elapsedTime = masterClock.getElapsedTime() + lastStopTime;

        // camera and lights updates when paused
        cameraSubject.update(elapsedTime, delta);
        lights.update(elapsedTime, delta);

        if (isPaused) return;

        detectCollisions(elapsedTime);

        for (let i = 0; i < sceneSubjects.length; i++)
            sceneSubjects[i].update(elapsedTime, delta);

    }

    function detectCollisions(elapsedTime) {

        // between player and enemies
        enemySpawner.getEnemies().forEach(enemy => {
            if (enemy.isActive() && enemy.getCanDoDemage()) {
                if (collisionBetweenCircles(player, enemy)) {
                    player.takeDemage(enemy.doDemage(elapsedTime));
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

    function collisionBetweenCircles(obj1, obj2) {
        var pos1 = obj1.getPosition();
        var pos2 = obj2.getPosition();
        var minDist = (obj1.getRadius() + obj2.getRadius()) ** 2;

        return (pos2.x - pos1.x) ** 2 + (pos1.z - pos2.z) ** 2 <= minDist;
    }

    this.reset = function () {
        enemySpawner.reset();
        player.reset();
        hud.reset();
        lastStopTime = 0;
        gameEnded = false;
    }

    this.endGame = function () {
        gameEnded = true;
        hud.endGame();
    }

    this.onWindowResize = function () {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }
}