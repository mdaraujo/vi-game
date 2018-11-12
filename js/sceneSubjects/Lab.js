var labWidth;
var labHeight;

function Lab(scene) {

	const scale = 5;

	const floorTextureSize = 20;
	const wallTextureSize = 8;

	this.init = function () {

		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.addEventListener("load", reqListener);
		xmlhttp.open("GET", "../../labs/Ciber2005_FinalLab_Simple.xml", false);
		xmlhttp.send();
	}

	this.update = function (time) {

	}

	function reqListener() {

		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(this.responseText, "text/xml");

		var lab = xmlDoc.getElementsByTagName('Lab')[0];
		labWidth = parseFloat(lab.getAttribute('Width')) * scale;
		labHeight = parseFloat(lab.getAttribute('Height')) * scale;

		createFloor();
		createSideWalls();

		var xmlWalls = xmlDoc.getElementsByTagName('Wall');

		var i, j;
		for (i = 0; i < xmlWalls.length; i++) {
			var height = parseFloat(xmlWalls[i].getAttribute('Height')) * scale;

			var corners = xmlWalls[i].children;
			if (corners.length != 4) {
				console.warn("Skipped wall for not having 4 corners.");
				continue;
			}

			var xMax = Number.MIN_VALUE;
			var xMin = Number.MAX_VALUE;
			var yMax = Number.MIN_VALUE;
			var yMin = Number.MAX_VALUE;

			for (j = 0; j < corners.length; j++) {
				var x = parseFloat(corners[j].getAttribute('X')) * scale;
				var y = parseFloat(corners[j].getAttribute('Y')) * scale;

				xMax = Math.max(xMax, x);
				xMin = Math.min(xMin, x);
				yMax = Math.max(yMax, y);
				yMin = Math.min(yMin, y);
			}

			var width = xMax - xMin;
			var depth = yMax - yMin;

			createWall(width, height, depth, xMin, yMin);

		}
	}

	function createSideWalls() {
		var height = 2.5 * scale;
		createWall(scale, height, labHeight, -scale, 0);
		createWall(scale, height, labHeight, labWidth, 0);
		createWall(labWidth + 2 * scale, height, scale, -scale, -scale);
		createWall(labWidth + 2 * scale, height, scale, -scale, labHeight);
	}

	function createWall(width, height, depth, xMin, zMin) {

		var material1 = getWallMaterial(depth, height);
		var material2 = getWallMaterial(width, depth);
		var material3 = getWallMaterial(width, height);

		var materials = [];
		materials.push(material1);
		materials.push(material1);
		materials.push(material2);
		materials.push(material2);
		materials.push(material3);
		materials.push(material3);

		var geometry = new THREE.BoxGeometry(width, height, depth);

		var mesh = new THREE.Mesh(geometry, materials);

		mesh.position.y = height / 2;

		mesh.position.x = xMin + (width / 2);
		mesh.position.z = -zMin - (depth / 2);

		mesh.position.x -= labWidth / 2;
		mesh.position.z += labHeight / 2;

		scene.add(mesh);

	}

	function getWallMaterial(x, y) {
		var loader = new THREE.TextureLoader();
		var baseTexture = loader.load('images/redbricks/redbricks-albedo.jpg');
		var normalTexture = loader.load('images/redbricks/redbricks-normal.jpg');

		baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping;
		baseTexture.repeat.set(x / wallTextureSize, y / wallTextureSize);

		normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
		normalTexture.repeat.set(x / wallTextureSize, y / wallTextureSize);

		var material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			normalMap: normalTexture,
			roughness: 0.52,
			color: '#161c10'
		});
		return material;
	}

	function createFloor() {
		var loader = new THREE.TextureLoader();
		var baseTexture = loader.load('images/tiledstone/tiledstone1_basecolor.jpg');
		baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping;
		baseTexture.repeat.set(labWidth / floorTextureSize, labHeight / floorTextureSize);

		var normalTexture = loader.load('images/tiledstone/tiledstone1_normal-DX.jpg');
		normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
		normalTexture.repeat.set(labWidth / floorTextureSize, labHeight / floorTextureSize);

		var material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			normalMap: normalTexture,
			roughness: 0.6,
			side: THREE.DoubleSide
		});

		var geometry = new THREE.PlaneGeometry(labWidth, labHeight, 4, 4);
		mesh = new THREE.Mesh(geometry, material);

		mesh.rotation.x = - Math.PI / 2;

		scene.add(mesh);
	}
}