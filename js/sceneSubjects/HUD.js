function HUD(scene) {

    var killCounter;
    var killsElement;

    var timeElement;
    var nextTimeUpdate;
    var date;

    var playButton;
    var gameOverElement;

    this.init = function () {

        killsElement = document.getElementById("killCounter");

        timeElement = document.getElementById("time");

        playButton = document.getElementById("playBtn");
        playButton.addEventListener("click", playBtnClick);

        gameOverElement = document.getElementById("gameOver");

        this.reset();
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
            playButton.innerHTML = "PLAY";
        }
        else {
            if (gameEnded) {
                sceneManager.reset();
            }

            masterClock.start();
            playButton.innerHTML = "PAUSE";
        }
    }

    this.reset = function () {
        killCounter = 0;
        killsElement.innerHTML = killCounter;
        nextTimeUpdate = 0;
        gameOverElement.style.display = "none";
    }

    this.endGame = function () {
        playButton.click();
        gameOverElement.style.display = "block";
    }
}