function HUD(scene, lab) {

    var killCounter;
    var killsElement;

    var timeElement;
    var nextTimeUpdate;
    var date;

    var playButton;
    var gameOverElement;

    var labSelect;

    this.init = function () {

        killsElement = document.getElementById("killCounter");

        timeElement = document.getElementById("time");

        playButton = document.getElementById("playBtn");
        playButton.addEventListener("click", playPauseBtnClick);

        gameOverElement = document.getElementById("gameOver");

        document.addEventListener("keydown", onDocumentKeyDown, false);

        labSelect = document.getElementById("labSelect");
        labSelect.addEventListener("change", changeLab);

        labNumber = 1;
        for (name in LABS) {
            var opt = document.createElement("option");
            opt.value = LABS[name];
            opt.innerHTML = "Lab " + labNumber;
            labSelect.appendChild(opt);
            labNumber++;
        }

        this.reset();
    }

    this.update = function (time, delta) {
        if (time >= nextTimeUpdate) {
            fillTimeElement(time);
            nextTimeUpdate += 1;
        }
    }

    this.addKill = function () {
        killCounter++;
        killsElement.innerHTML = killCounter;
    }

    function playPauseBtnClick() {
        isPaused = !isPaused;

        if (isPaused) {
            lastStopTime += masterClock.getElapsedTime();
            masterClock.stop();
            playButton.innerHTML = "PLAY";
            labSelect.disabled = false;
        }
        else {
            if (gameEnded) {
                sceneManager.reset();
            }

            masterClock.start();
            playButton.innerHTML = "PAUSE";
            playButton.blur();
            labSelect.blur();
            labSelect.disabled = true;
        }
    }

    function changeLab() {
        lab.loadLab(labSelect.value);
        sceneManager.reset();
    }

    function fillTimeElement(time) {
        date = new Date(null);
        date.setSeconds(time);
        var timeString = date.toISOString().substr(11, 8);
        timeElement.innerHTML = timeString;
    }

    this.reset = function () {
        killCounter = 0;
        killsElement.innerHTML = killCounter;
        fillTimeElement(0);
        nextTimeUpdate = 0;
        gameOverElement.style.display = "none";
        labSelect.disabled = false;
    }

    this.endGame = function () {
        playButton.click();
        gameOverElement.style.display = "block";
    }

    function onDocumentKeyDown(event) {
        // play/pause on space key click

        var keyCode = event.which;

        if (keyCode == 32) { // space key
            playPauseBtnClick();
        }
    }
}