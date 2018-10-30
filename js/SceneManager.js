var camera;

function SceneManager(canvas) {

    const clock = new THREE.Clock();

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    camera = buildCamera(screenDimensions, scene);

    const sceneSubjects = createSceneSubjects(scene);

    var player;
    var enemy;

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

    function buildCamera({ width, height }, scene) {
        const aspectRatio = width / height;
        const fieldOfView = 45;
        const nearPlane = 0.1;
        const farPlane = 20000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.set(0, 50, 40);
        camera.lookAt(scene.position);

        new THREE.OrbitControls(camera);

        return camera;
    }

    function createSceneSubjects(scene) {
        player = new Player(scene);
        enemy = new Enemy(scene, player);

        const sceneSubjects = [
            new GeneralLights(scene),
            new Floor(scene),
            player,
            enemy
        ];

        return sceneSubjects;
    }

    this.init = function () {
        for (let i = 0; i < sceneSubjects.length; i++)
            sceneSubjects[i].init();
    }

    this.update = function () {
        const elapsedTime = clock.getElapsedTime();

        for (let i = 0; i < sceneSubjects.length; i++)
            sceneSubjects[i].update(elapsedTime);

        detectCollisions(elapsedTime);

        renderer.render(scene, camera);
    }

    function detectCollisions(elapsedTime) {
        if (!player.isActive()) return;

        // between player and enemies
        if (enemy.isActive() && enemy.getCanDoDemage()) {
            if (collisionBetweenCircles(player, enemy)) {
                player.takeDemage(enemy.doDemage(elapsedTime));
            }
        }

        // between bullets and enemies
        player.getBullets().forEach(b => {
            if (b.isActive()) {
                if (enemy.isActive()) {
                    if (collisionBetweenCircles(b, enemy)) {
                        b.setActive(false);
                        enemy.takeDemage(b.doDemage());
                    }
                }
            }
        });
    }

    function collisionBetweenCircles(obj1, obj2) {
        var pos1 = obj1.getPosition();
        var pos2 = obj2.getPosition();
        var minDist = (obj1.getRadius() + obj2.getRadius()) ** 2;

        return (pos2.x - pos1.x) ** 2 + (pos1.z - pos2.z) ** 2 <= minDist;
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