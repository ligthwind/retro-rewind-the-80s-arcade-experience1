let grinch;

let walls;
let trees;
let gifts;

let score = 500;
let winningScore = 1200;

let gameState = "loading";

// images
let faceSheet;
let deadSheet;
let treeSheet;
let giftSheet;

function preload() {

  faceSheet = loadImage("./face.png");
  deadSheet = loadImage("./dead.png");
  treeSheet = loadImage("./tree.png");
  giftSheet = loadImage("./gift.png");
}

function setup() {

  new Canvas(windowWidth, windowHeight);

  world.gravity.y = 0;

  textAlign(CENTER, CENTER);

  gameState = "title";
}

// game setup

function setupGame() {

  walls = new Group();
  trees = new Group();
  gifts = new Group();

  walls.collider = "static";

  // player
  grinch = new Sprite(120, 120, 40, 40);

  grinch.rotationLock = true;

  grinch.image = faceSheet;
  grinch.scale = 0.55;

  // trees
  for (let i = 0; i < 10; i++) {

    let tree = new trees.Sprite(
      random(150, width - 150),
      random(150, height - 150),
      50,
      50
    );

    tree.collider = "static";

    tree.image = treeSheet;
    tree.scale = 0.55;
  }

  // gifts
  for (let i = 0; i < 8; i++) {

    let gift = new gifts.Sprite(
      random(150, width - 150),
      random(150, height - 150),
      40,
      40
    );

    gift.image = giftSheet;
    gift.scale = 0.55;
  }

  createMaze();
}

// maze

function createMaze() {

  // OUTER WALLS
  new walls.Sprite(width / 2, 20, width, 40);

  new walls.Sprite(width / 2, height - 20, width, 40);

  new walls.Sprite(20, height / 2, 40, height);

  new walls.Sprite(width - 20, height / 2, 40, height);

  // INNER WALLS
  new walls.Sprite(300, 150, 400, 30);

  new walls.Sprite(700, 150, 400, 30);

  new walls.Sprite(500, 300, 30, 250);

  new walls.Sprite(250, 500, 300, 30);

  new walls.Sprite(750, 500, 300, 30);

  new walls.Sprite(500, 650, 500, 30);
}

function draw() {

  background("#0a280a");

  // LOADING
  if (gameState === "loading") {

    fill("white");

    textSize(40);

    text("Loading...", width / 2, height / 2);

    return;
  }

  // TITLE
  if (gameState === "title") {

    fill("white");

    textSize(70);

    text("GRINCH GIFT GRAB", width / 2, 180);

    textSize(30);

    text("Inspired by Pac-Man", width / 2, 260);

    text("Collect gifts and avoid trees!", width / 2, 340);

    fill("red");

    textSize(35);

    text("PRESS SPACE TO START", width / 2, 500);

    if (kb.presses("space")) {

      setupGame();

      gameState = "play";
    }

    return;
  }

  // play
  if (gameState === "play") {

    movement();

    collisions();

    drawScore();
  }

  // game over situation
  if (gameState === "gameover") {

    background("#000000");

    fill("red");

    textSize(80);

    text("GAME OVER", width / 2, 350);

    fill("white");

    textSize(40);

    text("FINAL SCORE: " + score, width / 2, 450);

    textSize(28);

    text("PRESS R TO TRY AGAIN", width / 2, 530);

    if (kb.presses("r")) {

      resetGame();
    }
  }

  // win situation
  if (gameState === "win") {

    background("#052350");

    fill("lime");

    textSize(72);

    text("YOU WIN!", width / 2, 330);

    fill("white");

    textSize(34);

    text("FINAL SCORE: " + score, width / 2, 430);

    textSize(28);

    text("PRESS R TO PLAY AGAIN", width / 2, 520);

    if (kb.presses("r")) {

      resetGame();
    }
  }
}

// moving

function movement() {

  let speed = 5;

  grinch.vel.x = 0;
  grinch.vel.y = 0;

  if (kb.pressing("left")) {
    grinch.vel.x = -speed;
  }

  if (kb.pressing("right")) {
    grinch.vel.x = speed;
  }

  if (kb.pressing("up")) {
    grinch.vel.y = -speed;
  }

  if (kb.pressing("down")) {
    grinch.vel.y = speed;
  }
}

// colliding

function collisions() {

  grinch.collide(walls);

  // with trees
  for (let tree of trees) {

    if (grinch.collides(tree)) {

      score -= 100;

      tree.x = random(100, width - 100);

      tree.y = random(100, height - 100);
    }
  }

  // with gifts
  for (let gift of gifts) {

    if (grinch.collides(gift)) {

      score += 100;

      gift.x = random(100, width - 100);

      gift.y = random(100, height - 100);
    }
  }

  // game over
  if (score <= 0) {

    score = 0;

    endGame("gameover");
  }

  // win
  if (score >= winningScore) {

    endGame("win");
  }
}

// score

function drawScore() {

  fill("white");

  textAlign(LEFT, TOP);

  textSize(30);

  text("Score: " + score, 55, 50);

  textAlign(RIGHT, TOP);

  text("Goal: " + winningScore, width - 55, 50);
}

function resetGame() {

  score = 500;

  if (grinch) {

    grinch.remove();
  }

  if (walls) {

    walls.removeAll();
  }

  if (trees) {

    trees.removeAll();
  }

  if (gifts) {

    gifts.removeAll();
  }

  gameState = "title";
}

function endGame(nextState) {

  if (grinch) {

    grinch.remove();
  }

  if (walls) {

    walls.removeAll();
  }

  if (trees) {

    trees.removeAll();
  }

  if (gifts) {

    gifts.removeAll();
  }

  gameState = nextState;
}
