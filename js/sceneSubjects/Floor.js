function Floor(scene) {

	const repeatValue = 5;

	var mesh;

	this.init = function () {

		var loader = new THREE.TextureLoader();
		var baseTexture = loader.load('images/tiledstone/tiledstone1_basecolor.png');
		baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping;
		baseTexture.repeat.set(repeatValue, repeatValue);

		var normalTexture = loader.load('images/tiledstone/tiledstone1_normal-DX.png');
		normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
		normalTexture.repeat.set(repeatValue, repeatValue);

		var material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			normalMap: normalTexture,
			roughness: 0.6,
			side: THREE.DoubleSide
		});

		var geometry = new THREE.PlaneGeometry(100, 100, 4, 4);
		mesh = new THREE.Mesh(geometry, material);

		mesh.rotation.x = Math.PI / 2;

		scene.add(mesh);

	}

	this.update = function (time) {

	}
}