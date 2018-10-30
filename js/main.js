const canvas = document.getElementById("canvas");

const sceneManager = new SceneManager(canvas);
sceneManager.init();

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

bindEventListeners();
animate();

function bindEventListeners() {
	window.onresize = resizeCanvas;
	resizeCanvas();
}

function resizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height = '100%';

	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

	sceneManager.onWindowResize();
}

function animate() {

	requestAnimationFrame(animate);

	stats.begin();

	// monitored code goes here
	sceneManager.update();

	stats.end();
}