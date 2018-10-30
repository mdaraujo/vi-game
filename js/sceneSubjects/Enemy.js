function Enemy(scene) {

	const height = 3;

	var mesh;

	this.init = function () {

		var loader = new THREE.TextureLoader();
		var baseTexture = loader.load('images/rusty-panel/rusty-panel-albedo3b.png');
		var normalTexture = loader.load('images/rusty-panel/rusty-panel-norma-dx.png');

		var material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			normalMap: normalTexture,
			metalness: 1,
			roughness: 0.6,
			color: '#202020'
		});

		var geometry = new THREE.CylinderGeometry(2, 2, height, 16);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = height / 2;
		mesh.position.z = -30;
		mesh.position.x = -30;
		scene.add(mesh);
	}

	this.update = function (time) {

	}

}