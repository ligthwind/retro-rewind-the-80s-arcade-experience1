let grinch;
let walls;
let trees;
let gifts;
let wallRects = [];

let score = 500;
let winningScore = 1200;
let gameState = "loading";
let hitCooldown = 0;

let faceSheet;
let deadSheet;
let treeSheet;
let giftSheet;
let faceFrame;
let treeFrame;
let giftFrame;

const playfieldColor = "#041f08";
const wallColor = "#213f7a";
const wallGlow = "#25f4ff";
const giftColor = "#ffda3a";
const dangerColor = "#ff2d55";

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
  imageMode(CENTER);
  rectMode(CENTER);
  faceFrame = cropFrame(faceSheet, 0, 0);
  treeFrame = cropFrame(treeSheet, 0, 0);
  giftFrame = cropFrame(giftSheet, 0, 0);
  gameState = "title";
}

function setupGame() {

  score = 500;
  hitCooldown = 0;
  wallRects = [];

  walls = new Group();
  trees = new Group();
  gifts = new Group();

  walls.collider = "static";
  walls.visible = false;

  grinch = new Sprite(width * 0.12, height * 0.18, 42, 42);
  grinch.rotationLock = true;
  grinch.image = faceFrame;
  grinch.scale = spriteScale(2.1);

  createMaze();
  createTrees();
  createGifts();
}

function createTrees() {

  const spots = [
    [0.26, 0.24],
    [0.72, 0.24],
    [0.48, 0.36],
    [0.22, 0.55],
    [0.78, 0.55],
    [0.36, 0.74],
    [0.62, 0.74],
    [0.86, 0.36]
  ];

  for (let pos of spots) {

  let tree = new trees.Sprite(width * pos[0], height * pos[1], 42, 42);
    tree.collider = "static";
    tree.image = treeFrame;
    tree.scale = spriteScale(1.8);
  }
}

function createGifts() {

  const spots = [
    [0.18, 0.33],
    [0.39, 0.2],
    [0.6, 0.2],
    [0.84, 0.26],
    [0.32, 0.46],
    [0.67, 0.46],
    [0.2, 0.78],
    [0.82, 0.78],
    [0.5, 0.62]
  ];

  for (let pos of spots) {

    let gift = new gifts.Sprite(width * pos[0], height * pos[1], 34, 34);
    gift.image = giftFrame;
    gift.scale = spriteScale(1.7);
  }
}

function createMaze() {

  const margin = Math.max(28, Math.min(width, height) * 0.045);
  const thick = Math.max(18, Math.min(width, height) * 0.035);

  makeWall(width / 2, margin, width - margin * 2, thick);
  makeWall(width / 2, height - margin, width - margin * 2, thick);
  makeWall(margin, height / 2, thick, height - margin * 2);
  makeWall(width - margin, height / 2, thick, height - margin * 2);

  makeWall(width * 0.28, height * 0.25, width * 0.28, thick * 0.8);
  makeWall(width * 0.72, height * 0.25, width * 0.28, thick * 0.8);
  makeWall(width * 0.5, height * 0.42, thick * 0.8, height * 0.28);
  makeWall(width * 0.27, height * 0.58, width * 0.24, thick * 0.8);
  makeWall(width * 0.73, height * 0.58, width * 0.24, thick * 0.8);
  makeWall(width * 0.5, height * 0.78, width * 0.38, thick * 0.8);
}

function makeWall(x, y, w, h) {

  let wall = new walls.Sprite(x, y, w, h);
  wall.visible = false;
  wallRects.push({ x, y, w, h });
}

function draw() {

  drawBackdrop();

  if (gameState === "loading") {

    drawCenteredMessage("LOADING...");
    return;
  }

  if (gameState === "title") {

    drawTitleScreen();

    if (kb.presses("space")) {

      setupGame();
      gameState = "play";
    }

    return;
  }

  if (gameState === "play") {

    movement();
    collisions();
    drawMazeArt();
    drawScore();
    return;
  }

  if (gameState === "gameover") {

    drawGameOver();
    return;
  }

  if (gameState === "win") {

    drawWinScreen();
  }
}

function drawBackdrop() {

  background(playfieldColor);

  push();
  noFill();
  stroke(0, 255, 150, 35);
  strokeWeight(1);

  for (let x = 0; x < width; x += 32) {
    line(x, 0, x, height);
  }

  for (let y = 0; y < height; y += 32) {
    line(0, y, width, y);
  }

  stroke(255, 0, 100, 110);
  strokeWeight(4);
  rect(width / 2, height / 2, width - 20, height - 20);
  pop();
}

function drawTitleScreen() {

  push();
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  imageMode(CENTER);
  noStroke();

  fill(0, 0, 0, 150);
  rect(width / 2, height * 0.46, width * 0.84, height * 0.68, 10);

  fill("#9cff4d");
  textSize(Math.min(68, width * 0.075));
  text("GRINCH GIFT GRAB", width / 2, height * 0.23);

  fill(wallGlow);
  textSize(Math.min(30, width * 0.035));
  text("RETRO MAZE CHASE", width / 2, height * 0.34);

  image(faceFrame, width * 0.38, height * 0.5, 96, 96);
  image(giftFrame, width * 0.5, height * 0.5, 76, 76);
  image(treeFrame, width * 0.62, height * 0.5, 96, 96);

  fill(giftColor);
  textSize(Math.min(32, width * 0.038));
  text("PRESS SPACE TO START", width / 2, height * 0.68);

  fill("#ffffff");
  textSize(Math.min(20, width * 0.025));
  text("Collect gifts. Dodge trees. Keep the score alive.", width / 2, height * 0.75);
  pop();
}

function drawMazeArt() {

  push();
  rectMode(CENTER);
  strokeWeight(5);
  stroke(wallGlow);
  fill(wallColor);

  for (let wall of wallRects) {
    rect(wall.x, wall.y, wall.w, wall.h, 6);
  }

  stroke(255, 0, 160, 120);
  strokeWeight(1);
  noFill();

  for (let wall of wallRects) {
    rect(wall.x, wall.y, wall.w + 8, wall.h + 8, 8);
  }

  pop();
}

function drawCenteredMessage(message) {

  push();
  fill("#ffffff");
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(40);
  text(message, width / 2, height / 2);
  pop();
}

function movement() {

  let speed = Math.max(4.5, Math.min(width, height) * 0.007);

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

function collisions() {

  grinch.collide(walls);
  hitCooldown = Math.max(0, hitCooldown - 1);

  for (let tree of trees) {

    if (grinch.collides(tree) && hitCooldown === 0) {

      score -= 100;
      hitCooldown = 35;
      bounceAwayFrom(tree);
    }
  }

  grinch.collide(trees);

  for (let gift of gifts) {

    if (grinch.collides(gift)) {

      score += 100;
      moveSpriteToOpenSpot(gift);
    }
  }

  if (score <= 0) {

    score = 0;
    endGame("gameover");
  }

  if (score >= winningScore) {

    endGame("win");
  }
}

function moveSpriteToOpenSpot(sprite) {

  sprite.x = random(width * 0.12, width * 0.88);
  sprite.y = random(height * 0.16, height * 0.84);
}

function bounceAwayFrom(sprite) {

  let dx = grinch.x - sprite.x;
  let dy = grinch.y - sprite.y;
  let distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));

  grinch.x += dx / distance * 32;
  grinch.y += dy / distance * 32;
  grinch.vel.x = dx / distance * 4;
  grinch.vel.y = dy / distance * 4;
}

function drawScore() {

  push();
  rectMode(CORNER);
  textAlign(LEFT, TOP);
  noStroke();
  fill(0, 0, 0, 150);
  rect(16, 16, 225, 52, 8);
  fill("#ffffff");
  textSize(28);
  text("SCORE " + score, 28, 25);

  textAlign(RIGHT, TOP);
  fill(0, 0, 0, 150);
  rect(width - 241, 16, 225, 52, 8);
  fill("#ffffff");
  text("GOAL " + winningScore, width - 28, 25);
  pop();
}

function drawGameOver() {

  push();
  background("#000000");
  textAlign(CENTER, CENTER);
  noStroke();
  fill(dangerColor);
  textSize(Math.min(82, width * 0.1));
  text("GAME OVER", width / 2, height * 0.43);
  fill("#ffffff");
  textSize(34);
  text("FINAL SCORE: " + score, width / 2, height * 0.55);
  fill(giftColor);
  textSize(24);
  text("PRESS R TO PLAY AGAIN", width / 2, height * 0.65);
  pop();

  if (kb.presses("r")) {
    resetGame();
  }
}

function drawWinScreen() {

  push();
  background("#06133a");
  textAlign(CENTER, CENTER);
  noStroke();
  fill("#9cff4d");
  textSize(Math.min(82, width * 0.1));
  text("YOU WIN!", width / 2, height * 0.43);
  fill("#ffffff");
  textSize(34);
  text("FINAL SCORE: " + score, width / 2, height * 0.55);
  fill(giftColor);
  textSize(24);
  text("PRESS R TO PLAY AGAIN", width / 2, height * 0.65);
  pop();

  if (kb.presses("r")) {
    resetGame();
  }
}

function resetGame() {

  removeGameSprites();
  score = 500;
  hitCooldown = 0;
  gameState = "title";
}

function endGame(nextState) {

  removeGameSprites();
  gameState = nextState;
}

function removeGameSprites() {

  if (grinch) {
    grinch.remove();
    grinch = null;
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

  wallRects = [];
}

function spriteScale(baseScale) {

  return baseScale * Math.min(width, height) / 720;
}

function cropFrame(sheet, col, row) {

  return sheet.get(col * sheet.width / 2, row * sheet.height / 2, sheet.width / 2, sheet.height / 2);
}
