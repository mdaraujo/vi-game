function HUD(scene) {

    var killCounter;
    var killsElement;

    var timeElement;
    var nextTimeUpdate;
    var date;

    this.init = function () {
        killCounter = 0;

        killsElement = document.getElementById("killCounter");
        killsElement.innerHTML = killCounter;

        timeElement = document.getElementById("time");
        nextTimeUpdate = 0;

    }

    this.update = function (time) {
        if (time >= nextTimeUpdate) {
            date = new Date(null);
            date.setSeconds(time);
            var timeString = date.toISOString().substr(11, 8);
            timeElement.innerHTML = timeString;
            nextTimeUpdate += 1;
        }
    }

    this.addKill = function () {
        killCounter++;
        killsElement.innerHTML = killCounter;
    }

}