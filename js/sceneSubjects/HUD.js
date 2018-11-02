function HUD(scene) {

    const size = 7, height = 1;

    var killCount;
    var mesh = new THREE.Mesh();
    var geometry;
    var font;

    this.init = function () {

        killCount = 0;

        var loader = new THREE.FontLoader();
        loader.load('fonts/gentilis_regular.typeface.json', function (fontLoaded) {
            font = fontLoaded;
            updateMesh();
        });

    }

    this.update = function (time) {

        mesh.rotation.x = camera.rotation.x;
        mesh.rotation.y = camera.rotation.y;
    }

    this.addKill = function () {
        killCount++;

        scene.remove(mesh);
        updateMesh();
    }

    function updateMesh() {
        geometry = new THREE.TextGeometry(killCount + "", {
            font: font,
            size: size,
            height: height
        });

        var material = new THREE.MeshPhongMaterial({
            color: "#148114",
            shininess: 10
        });

        mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = 0;
        mesh.position.y = height / 2;
        mesh.position.z = -80;
        mesh.rotation.x = camera.rotation.x;
        mesh.rotation.y = camera.rotation.y;

        scene.add(mesh);
    }
}