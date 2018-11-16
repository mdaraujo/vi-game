function Camera(scene, { width, height }) {

    const aspectRatio = width / height;
    const fieldOfView = 45;
    const nearPlane = 0.1;
    const farPlane = 20000;

    this.init = function () {
        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        controls = new THREE.OrbitControls(camera);

        setPosOne();
    }

    this.update = function (time, delta) {

        if (keyboard.pressed("1"))
            setPosOne();

        if (keyboard.pressed("2"))
            setPosTwo();

        if (keyboard.pressed("3"))
            setPosThree();

        if (keyboard.pressed("4"))
            setPosFour();

    }

    function setPosOne() {
        camera.position.set(0, 120, 0);
        camera.rotation.x = 1.57;
        controls.update();
    }

    function setPosTwo() {
        camera.position.set(0, 85, 87);
        camera.rotation.x = 0.77;
        controls.update();
    }

    function setPosThree() {
        camera.position.set(-118, 68, 42);
        camera.rotation.x = -1;
        controls.update();
    }

    function setPosFour() {
        camera.position.set(118, 68, 42);
        camera.rotation.x = -1;
        controls.update();
    }
}