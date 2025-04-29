var snakeIsOn = false;

function changeStatus (game) {
    let newStatus = (game.dataset.isActive != "true");
    game.dataset.isActive = newStatus;
    if (newStatus) {
        var bgColor = "lime";
    } else {
        var bgColor = "red";
    }
    game.children[0].style.backgroundColor = bgColor;
    
}

function switchSnake () {
    snakeIsOn = !snakeIsOn;

    if (snakeIsOn) {
        document.getElementById("snake-canvas-holder").style.display = "flex";
        setup();
    } else {
        document.getElementById("snake-canvas-holder").style.display = "none";
        game.over();
    }
}

function updateHighscore () {
    
    let scores = document.querySelectorAll(".score");
    let highscore = scores[0];
    for (let i = 1; i < scores.length; i++) {
        scores[i].style.color = "cyan";
        if (parseFloat(scores[i].getAttribute("data-value")) > parseFloat(highscore.getAttribute("data-value"))) {
            highscore = scores[i];
        }
    }
    highscore.style.color = "gold";
}