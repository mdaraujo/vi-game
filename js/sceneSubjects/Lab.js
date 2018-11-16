var labWidth;
var labHeight;

function Lab(scene, lights) {

	const scale = 5;

	const floorTextureSize = 20;

	var walls;

	this.init = function () {

		walls = [];

		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.addEventListener("load", reqListener);
		xmlhttp.open("GET", "labs/Ciber2005_FinalLab_Simple.xml", true);
		xmlhttp.send();
	}

	this.update = function (time, delta) {

	}

	function reqListener() {

		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(this.responseText, "text/xml");

		var lab = xmlDoc.getElementsByTagName('Lab')[0];
		labWidth = parseFloat(lab.getAttribute('Width')) * scale;
		labHeight = parseFloat(lab.getAttribute('Height')) * scale;

		createFloor();
		createSideWalls();

		lights.init();

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
		var wall = new Wall(scene, width, height, depth, xMin, zMin);
		wall.init();
		walls.push(wall);
	}

	function createFloor() {
		FLOOR_BASE_TEXTURE.repeat.set(labWidth / floorTextureSize, labHeight / floorTextureSize);
		FLOOR_NORMAL_TEXTURE.repeat.set(labWidth / floorTextureSize, labHeight / floorTextureSize);

		var material = new THREE.MeshStandardMaterial({
			map: FLOOR_BASE_TEXTURE,
			normalMap: FLOOR_NORMAL_TEXTURE,
			roughness: 0.6
		});

		var geometry = new THREE.PlaneGeometry(labWidth, labHeight, 4, 4);
		mesh = new THREE.Mesh(geometry, material);

		mesh.rotation.x = - Math.PI / 2;

		scene.add(mesh);
	}

	this.getWalls = function () {
		return walls;
	}
}