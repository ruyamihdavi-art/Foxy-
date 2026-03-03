//set the variables

var startImg;
var gameImg;
var winImg;
var lostImg;
var scene = "start";

const totalTime = 25;
var startMillis = 0;

var foxes = [];
const FOX_COUNT = 9;

var debug = false;

//load all images of game
function preload() {
  startImg = loadImage("Start.png");
  gameImg = loadImage("Game.png");
  winImg = loadImage("Win.png");
  lostImg = loadImage("Lost.png");
}

//set up the canvas 800x800
function setup() {
  createCanvas(800, 800);
  textAlign(CENTER, CENTER);
  initFoxes();
}

function draw() {
  background(255);

  if (scene === "start") {
    drawSceneImage(startImg);
    drawButton(width / 2, 650, 220, 60, "START");
    return;
  }

  if (scene === "game") {
    drawSceneImage(gameImg);

    const remaining = getRemainingSeconds();
    drawHUD(remaining);

    if (remaining <= 0 && !allFound()) {
      scene = "lose";
      return;
    }

    if (allFound()) {
      scene = "win";
      return;
    }

    drawDebug();
    return;
  }

  if (scene === "win") {
    drawSceneImage(winImg);
    drawButton(width / 2, 650, 260, 60, "TRY AGAIN");
    return;
  }

  if (scene === "lose") {
    drawSceneImage(lostImg);
    drawButton(width / 2, 650, 260, 60, "TRY AGAIN");
    return;
  }
}

function mousePressed() {
  if (scene === "start") {
    if (isOverButton(width / 2, 650, 220, 60)) {
      startMillis = millis();
      resetFoxes();
      scene = "game";
    }
    return;
  }

  if (scene === "win" || scene === "lose") {
    if (isOverButton(width / 2, 650, 260, 60)) {
      scene = "start";
    }
    return;
  }

  if (scene !== "game") return;

  for (let f of foxes) {
    if (!f.found && dist(mouseX, mouseY, f.x, f.y) <= f.r) {
      f.found = true;
      break;
    }
  }
}

function keyPressed() {
  if (key === "d" || key === "D") debug = !debug;
}

function resetFoxes() {
  for (let f of foxes) {
    f.found = false;
  }
}

function getRemainingSeconds() {
  const elapsed = floor((millis() - startMillis) / 1000);
  return max(0, totalTime - elapsed);
}

function foundCount() {
  let c = 0;
  for (let f of foxes) if (f.found) c++;
  return c;
}

function allFound() {
  return foundCount() === FOX_COUNT;
}

// to be able to click on the foxes
// i used help from chat gpt to do this (132-147)
function initFoxes() {
  foxes = [
    { x: 438, y: 54, r: 55, found: false },
    { x: 668, y: 165, r: 55, found: false },
    { x: 595, y: 185, r: 60, found: false },
    { x: 730, y: 245, r: 60, found: false },
    { x: 560, y: 310, r: 60, found: false },
    { x: 125, y: 335, r: 70, found: false },
    { x: 305, y: 550, r: 65, found: false },
    { x: 470, y: 545, r: 65, found: false },
    { x: 715, y: 560, r: 75, found: false },
    { x: 670, y: 690, r: 75, found: false },
    { x: 560, y: 725, r: 75, found: false },
    { x: 210, y: 705, r: 75, found: false },
  ];
}

// =====================
// DRAW HELPERS
// =====================
function drawSceneImage(img) {
  if (img) {
    image(img, 0, 0, width, height);
  } else {
    background(240);
  }
}

function drawHUD(remaining) {
  push();
  textAlign(LEFT, TOP);
  textSize(26);
  fill(0);
  stroke(255);
  strokeWeight(4);
  text(`Foxes found: ${foundCount()}/${FOX_COUNT}`, 18, 12);
  pop();

  push();
  textAlign(RIGHT, TOP);
  textSize(26);
  fill(0);
  stroke(255);
  strokeWeight(4);
  text(`Time: ${remaining}s`, width - 18, 12);
  pop();
}

// i also used help from chatgpt here because it was lagging alot and i didnt know how to fix it (182-198)
function drawDebug() {
  if (!debug) return;

  push();
  noFill();
  stroke(0, 160);
  strokeWeight(2);

  for (let i = 0; i < foxes.length; i++) {
    const f = foxes[i];
    circle(f.x, f.y, f.r * 2);
    noStroke();
    fill(0);
    text(i + 1, f.x, f.y);
    noFill();
    stroke(0, 160);
  }
  pop();
}

function drawButton(cx, cy, w, h, label) {
  push();
  rectMode(CENTER);
  stroke(0);
  strokeWeight(3);
  fill(245);
  rect(cx, cy, w, h, 14);
  noStroke();
  fill(0);
  textSize(24);
  text(label, cx, cy);
  pop();
}

function isOverButton(cx, cy, w, h) {
  return (
    mouseX >= cx - w / 2 &&
    mouseX <= cx + w / 2 &&
    mouseY >= cy - h / 2 &&
    mouseY <= cy + h / 2
  );
}
