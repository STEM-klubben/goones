var snakeIsOn = false;
let spinTime = 1;

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

//slots
let scrolls = [];
let spinCounts = [0];
let speed = 0.1;
function scrollSlots (element, target, scrollID) {
    element.dataset.offset = Math.round((parseFloat(element.dataset.offset) + speed) % 16 * 10000)/10000;
    element.style.transform = "translate(0," + String((parseFloat(element.dataset.offset)+2)*(154)-2772) + "px)";

    if (parseFloat(element.dataset.offset) == target) {
        if (spinCounts[scrollID] <= 0) {
            clearInterval(scrolls[scrollID]);
            element.dataset.offset = target;
            element.style.transform = "translate(0," + String((parseFloat(element.dataset.offset)+2)*(154)-2772) + "px)";
        }
        spinCounts[scrollID]--;
    }
}

function randomAll (spins) {

    if (spinCounts[spinCounts.length-1] <= 0) {
        scrolls = [];
        spinCounts = [];
        for (let i = 0; i < 5; i++) {
            scrolls.push(setInterval(scrollSlots, 1, document.getElementById(i), Math.round(Math.random()*15), i));
            spinCounts.push((spins + i)*spinTime);
        }
    }
}