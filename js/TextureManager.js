// global variables
var WALL_BASE_TEXTURE;
var WALL_NORMAL_TEXTURE;

var FLOOR_BASE_TEXTURE;
var FLOOR_NORMAL_TEXTURE;

var METAL_BASE_TEXTURE;
var METAL_NORMAL_TEXTURE;

var BULLET_BASE_TEXTURE;

var HEALTH_TEXTURES = [];


function TextureManager() {

    var loader = new THREE.TextureLoader();

    WALL_BASE_TEXTURE = loader.load('images/redbricks/redbricks-albedo.jpg');
    WALL_BASE_TEXTURE.wrapS = WALL_BASE_TEXTURE.wrapT = THREE.RepeatWrapping;
    WALL_NORMAL_TEXTURE = loader.load('images/redbricks/redbricks-normal.jpg');
    WALL_NORMAL_TEXTURE.wrapS = WALL_NORMAL_TEXTURE.wrapT = THREE.RepeatWrapping;

    FLOOR_BASE_TEXTURE = loader.load('images/tiledstone/tiledstone1_basecolor.jpg');
    FLOOR_BASE_TEXTURE.wrapS = FLOOR_BASE_TEXTURE.wrapT = THREE.RepeatWrapping;
    FLOOR_NORMAL_TEXTURE = loader.load('images/tiledstone/tiledstone1_normal-DX.jpg');
    FLOOR_NORMAL_TEXTURE.wrapS = FLOOR_NORMAL_TEXTURE.wrapT = THREE.RepeatWrapping;

    METAL_BASE_TEXTURE = loader.load('images/rusty-panel/rusty-panel-albedo3b.jpg');
    METAL_NORMAL_TEXTURE = loader.load('images/rusty-panel/rusty-panel-norma-dx.jpg');

    BULLET_BASE_TEXTURE = loader.load('images/bullet-pattern.jpg');
    BULLET_BASE_TEXTURE.wrapS = BULLET_BASE_TEXTURE.wrapT = THREE.RepeatWrapping;

    for (var i = 0; i <= 5; i++) {
        var healthTexture = loader.load('images/health/health' + i + '.png');
        healthTexture.minFilter = THREE.LinearFilter;
        HEALTH_TEXTURES.push(healthTexture);
    }

}

// global function
function setUv(v, index, wr, hr) {
    for (var i = index * 4; i < (index + 1) * 4; i++) {
        for (var j = 0; j < 3; j++) {
            v[i][j].x = v[i][j].x * wr;
            v[i][j].y = v[i][j].y * hr;
        }
    }
}