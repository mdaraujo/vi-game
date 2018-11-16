function Wall(scene, width, height, depth, xMin, zMin) {

    const wallTextureSize = 8;

    var mesh;

    this.init = function () {

        var material = new THREE.MeshStandardMaterial({
            map: WALL_BASE_TEXTURE,
            normalMap: WALL_NORMAL_TEXTURE,
            roughness: 0.52,
            color: '#161c10'
        });

        var geometry = new THREE.BoxGeometry(width, height, depth);

        mesh = new THREE.Mesh(geometry, material);

        mesh.position.y = height / 2;

        mesh.position.x = xMin + (width / 2);
        mesh.position.z = -zMin - (depth / 2);

        mesh.position.x -= labWidth / 2;
        mesh.position.z += labHeight / 2;

        scene.add(mesh);

        var v = mesh.geometry.faceVertexUvs[0];

        setUv(v, 0, depth / wallTextureSize, height / wallTextureSize);
        setUv(v, 1, width / wallTextureSize, depth / wallTextureSize);
        setUv(v, 2, width / wallTextureSize, height / wallTextureSize);
    }

    this.getPosition = function () {
        return mesh.position;
    }

    this.getWidth = function () {
        return width;
    }

    this.getHeight = function () {
        return height;
    }

    this.getDepth = function () {
        return depth;
    }

}