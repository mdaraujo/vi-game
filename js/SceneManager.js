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

var LABS = ["Ciber2005_FinalLab_Simple", "Ciber2013-final-lab", "Ciber2013-m1-lab", "Ciber2013-m2-lab", "Ciber2012-final-lab", "Ciber2012-m1-lab"]

function SceneManager(canvas) {

    lastStopTime = 0;
    gameEnded = false;

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);

    var collisionManager;
    var cameraSubject = new Camera(scene, screenDimensions, renderer);
    var lights = new Lights(scene);
    var lab;
    var hud;
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
        lab = new Lab(scene, lights);
        hud = new HUD(scene, lab);
        player = new Player(scene);
        enemySpawner = new EnemySpawner(scene, player, hud);
        collisionManager = new CollisionManager(player, enemySpawner, lab);

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

        collisionManager.update(elapsedTime, delta);

        for (let i = 0; i < sceneSubjects.length; i++)
            sceneSubjects[i].update(elapsedTime, delta);

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