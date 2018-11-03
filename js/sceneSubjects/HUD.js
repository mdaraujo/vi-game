function HUD(scene) {

    var killCounter;
    var killsElement;

    this.init = function () {
        killCounter = 0;
        killsElement = document.getElementById("killCounter");
        killsElement.innerHTML = killCounter;
    }

    this.update = function (time) {

    }

    this.addKill = function () {
        killCounter++;
        killsElement.innerHTML = killCounter;
    }

}