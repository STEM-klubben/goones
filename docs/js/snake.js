let scoreParent = document.getElementById("highscore");
let allTimeScores = [];
let game = {
  boardSize: 10, step: 0, miniStep: 0, on: false, startApples: 3,
  over: function (trueover = false) {
    this.on = false;
    let scores = scoreParent.querySelectorAll("li");
    if (trueover) {
      let score = document.createElement("li");
      score.classList.add("score");
      score.innerHTML = "<b>" + snake.blocks.length + "</b> - " + this.boardSize + ":" + 1/snake.speed + ":" + this.startApples;
      allTimeScores.push(snake.blocks.length);
      score.dataset.value = snake.blocks.length;
      scoreParent.prepend(score);
      updateHighscore();
    }
    snake.dir = "ArrowUp";
    snake.prevDir = "ArrowDown";
    snake.blocks = [];
    apples = [];
    setup();
  }
};

let snake = {
  blocks: [], speed: 0.25, diameter: 1 / 2, dir: "ArrowUp", prevDir: "ArrowDown",
  show: function () {
    for (let b of this.blocks) {
      b.show();
    }
  },
  move: function () {


    let xChange = 0;
    let yChange = 0;
    switch (snake.dir) {
      case "ArrowUp":
      case "w":
        yChange = -1;
        break;
      case "ArrowDown":
      case "s":
        yChange = 1;
        break;
      case "ArrowLeft":
      case "a":
        xChange = -1;
        break;
      case "ArrowRight":
      case "d":
        xChange = 1;
        break;

    }
    let canMove = true;
    if (snake.blocks[0].x + xChange >= game.boardSize || snake.blocks[0].y + yChange >= game.boardSize || snake.blocks[0].x + xChange < 0 || snake.blocks[0].y + yChange < 0) {
      canMove = false;
    }
    for (let i = snake.blocks.length - 1; i > 0; i--) {
      if (snake.blocks[i].x == snake.blocks[0].x + xChange && snake.blocks[i].y == snake.blocks[0].y + yChange) {
        canMove = false;
      }
    }

    if (!canMove) {
      switch (snake.dir) {
        case "ArrowUp":
        case "w":
          if (snake.prevDir == "ArrowDown" || snake.prevDir == "s") {
            snake.dir = snake.prevDir;
            yChange = 1
            canMove = true;
          }
          break;
        case "ArrowDown":
        case "s":
          if (snake.prevDir == "ArrowUp" || snake.prevDir == "w") {
            snake.dir = snake.prevDir;
            yChange = -1
            canMove = true;
          }
          break;
        case "ArrowLeft":
        case "a":
          if (snake.prevDir == "ArrowRight" || snake.prevDir == "d") {
            snake.dir = snake.prevDir;
            xChange = 1
            canMove = true;
          }
          break;
        case "ArrowRight":
        case "d":
          if (snake.prevDir == "ArrowLeft" || snake.prevDir == "a") {
            snake.dir = snake.prevDir;
            xChange = -1
            canMove = true;
          }
          break;

      }
    }
    misc.executeOnceEvery(this.speed, function () {
      snake.prevDir = snake.dir;
      if (canMove) {
        for (let i = snake.blocks.length - 1; i > 0; i--) {
          snake.blocks[i].x = snake.blocks[i - 1].x
          snake.blocks[i].y = snake.blocks[i - 1].y
        }

        snake.blocks[0].x += xChange;
        snake.blocks[0].y += yChange;

      } else {
        game.over(true);
      }
    });
  }
};

let apples = [];

let misc = {
  lastExecution: 0, executeOnceEvery:
    function (interval, callback) {

      if (millis() - misc.lastExecution >= interval * 1000) {
        callback();
        misc.lastExecution = millis();
      }
    }, spaces: [], checkSpaces: function () {
      this.spaces = [];
      for (let x = 0; x < game.boardSize; x++) {
        this.spaces.push([]);
        for (let y = 0; y < game.boardSize; y++) {
          this.spaces[x].push(y);
        }
      } //console.log(this.spaces.length); 

      for (let b of snake.blocks) {
        this.spaces[b.x] = this.spaces[b.x].filter(function (item) {
          return item != b.y
        });
      }
      for (let a of apples) {
        this.spaces[a.x] = this.spaces[a.x].filter(function (item) {
          return item != a.y
        });
      }
      for (let s of this.spaces) {
        if (s.length == 0) {
          this.spaces.splice(this.spaces.indexOf(s), 1);
        }
      }
    }, showSpaces: function () {
      for (let s of this.spaces) {
        for (let sy of s) {
          noStroke();
          fill(255, 150);
          rect(this.spaces.indexOf(s) * game.step, sy * game.step, game.miniStep * 2);
        }
      }
    }
};

class Block {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = snake.diameter * game.step;
    this.realX = 0;
    this.realY = 0;
  }

  show() {

    this.realX = this.x * game.step;
    this.realY = this.y * game.step;

    noStroke();
    fill(0, 0, 255);
    rectMode(CORNER);
    rect(this.realX + game.miniStep, this.realY + game.miniStep, this.d, this.d);

    if (snake.blocks.indexOf(this) != 0) {
      if (this.x > snake.blocks[snake.blocks.indexOf(this) - 1].x) {
        rect(this.realX - game.step + game.miniStep, this.realY + game.miniStep, game.miniStep * 2 + this.d, this.d);
      } else if (this.x < snake.blocks[snake.blocks.indexOf(this) - 1].x) {
        rect(this.realX + game.step - game.miniStep, this.realY + game.miniStep, game.miniStep * 2 + this.d, this.d);
      } else if (this.y < snake.blocks[snake.blocks.indexOf(this) - 1].y) {
        rect(this.realX + game.miniStep, this.realY + this.d + game.step, this.d, game.miniStep - game.step);
      } else if (this.y > snake.blocks[snake.blocks.indexOf(this) - 1].y) {
        rect(this.realX + game.miniStep, this.realY + game.miniStep, this.d, game.miniStep - game.step);
      }
    } else {
      /*textSize(20);
      fill(0);
      text(snake.blocks.length, this.realX, this.realY, this.realX + this.d, this.realY + this.d);*/
    }
  }

}

class Apple {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = snake.diameter * game.step;
    this.realX = this.x * game.step;
    this.realY = this.y * game.step;

  }

  eat() {
    if (snake.blocks[0].x == this.x && snake.blocks[0].y == this.y) {
      snake.blocks.push(new Block(snake.blocks[snake.blocks.length - 1].x, snake.blocks[snake.blocks.length - 1].y));
      this.move();
    }
  }

  show() {

    this.realX = this.x * game.step;
    this.realY = this.y * game.step;

    noStroke();
    fill(255, 0, 0);
    rectMode(CORNER);
    rect(this.realX + game.miniStep, this.realY + game.miniStep, this.d, this.d);

  }

  move() {
    this.x = misc.spaces.indexOf(random(misc.spaces));
    this.y = random(misc.spaces[this.x]);
  }
}

function executeOnceEvery(interval, callback) {

  if (millis() - misc.lastExecution >= interval * 1000) {
    callback();
    misc.lastExecution = millis();
  }
}

function keyPressed() {
  if (str(key) == "w" || str(key) == "s" || str(key) == "a" || str(key) == "d") {
    snake.dir = str(key);
  }
}

function backdrop() {
  for (let x = 0; x < width; x += width / game.boardSize) {
    for (let y = 0; y < height; y += height / game.boardSize) {
      if ((x / game.step % 2 == 0 && y / game.step % 2 == 0) || (x / game.step % 2 != 0 && y / game.step % 2 != 0)) {
        noStroke();
        fill(color("#AAD751"));
        rectMode(CORNER);
        rect(x, y, game.step);
      }
    }
  }
}

function setup() {
  if (snakeIsOn) {
    let heightSize = floor(500 / 200) * 200;
    var cnv = createCanvas(heightSize, heightSize);
    cnv.parent("snake-canvas-holder");
    game.step = width / game.boardSize;
    game.miniStep = (game.step - snake.diameter * game.step) / 2;
    snake.blocks.push(new Block(2, 3));
    snake.blocks.push(new Block(2, 4));
    snake.blocks.push(new Block(2, 5));

    misc.checkSpaces();
    for (let i = 0; i < game.startApples; i++) {
      apples.push(new Apple(0, 0));
    }
    for (let a of apples) {
      a.move();
    }
  }

}

function draw() {
  if (snakeIsOn) {
    background(color("#A2D149"));
    backdrop();

    //check and show spaces
    misc.checkSpaces();
    //misc.showSpaces();

    if (game.on) snake.move();
    snake.show();


    for (let a of apples) {
      a.eat();
      a.show();
    }
  }
}