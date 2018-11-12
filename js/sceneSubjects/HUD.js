function HUD(scene) {

    var killCounter;
    var killsElement;

    var timeElement;
    var nextTimeUpdate;
    var date;

    var playButton;

    this.init = function () {
        killCounter = 0;

        killsElement = document.getElementById("killCounter");
        killsElement.innerHTML = killCounter;

        timeElement = document.getElementById("time");
        nextTimeUpdate = 0;

        playButton = document.getElementById("playBtn");
        playButton.addEventListener("click", playBtnClick);
    }

    this.update = function (time, delta) {
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

    function playBtnClick() {
        isPaused = !isPaused;

        if (isPaused) {
            lastStopTime += masterClock.getElapsedTime();
            masterClock.stop();
            masterDelta.stop();
            playButton.innerHTML = "PLAY";
        }
        else {
            masterClock.start();
            masterDelta.start();
            playButton.innerHTML = "PAUSE";
        }
    }
}