'use strict'

const SCREEN_WIDTH = 800
const SCREEN_HEIGHT = 800
const SCREEN_DEPTH = 800
const FRAME_RATE = 60

let pg
let target, pos

function setup() {
  init()

  noStroke()
  fill(0, 15)
  background(120, 165, 240)
  
  pg.strokeWeight(1)

  target = createVector(0, 0, 0)
  pos = createVector(0, 0, 0)

  noLoop()
}

function init() {
  createCanvas(windowHeight, windowHeight)
  pg = createGraphics(SCREEN_WIDTH, SCREEN_HEIGHT, WEBGL)

  pixelDensity(1)
  noCursor()
  frameRate(FRAME_RATE)
}

function draw() {
  // 隨機生成中心點
  let centerX = random(width * 0.25, width * 0.75);
  let centerY = random(height * 0.25, height * 0.75);

  for (let i = 0; i < 200; i++) {
    drawCurvedStem(centerX, centerY);
  }
}

function drawCurvedStem(centerX, centerY) {
  // 隨機生成角度
  let angle = random(TWO_PI);

  // 計算起始點，使其緊貼畫布邊緣
  let startX, startY;
  if (angle >= 0 && angle < PI / 2) { // 右下象限
    startX = width;
    startY = centerY + tan(angle) * (width - centerX);
  } else if (angle >= PI / 2 && angle < PI) { // 左下象限
    startX = 0;
    startY = centerY + tan(PI - angle) * centerX;
  } else if (angle >= PI && angle < 3 * PI / 2) { // 左上象限
    startX = 0;
    startY = centerY - tan(angle - PI) * centerX;
  } else { // 右上象限
    startX = width;
    startY = centerY - tan(TWO_PI - angle) * (width - centerX);
  }

  let endDistance = random(100, 1000); // 保留距離
  let endX = centerX + cos(angle) * endDistance;
  let endY = centerY + sin(angle) * endDistance;

  // 設定花莖顏色
  let r = random(50, 100); // 隨機紅色分量，保持較低
  let g = random(150, 255); // 隨機綠色分量，保持較高
  let b = random(50, 100); // 隨機藍色分量，保持較低
  stroke(r, g, b); // 設置花莖的顏色
  strokeWeight(4); // 設置花莖的粗細
  noFill();

  // 隨機生成控制點來創建彎曲的花莖
  let controlPoint1X = startX + cos(angle) * random(20, 50);
  let controlPoint1Y = startY + sin(angle) * random(20, 50);
  let controlPoint2X = endX + cos(angle + PI / 2) * random(20, 50);
  let controlPoint2Y = endY + sin(angle + PI / 2) * random(20, 50);

  // 使用貝塞爾曲線繪製花莖
  bezier(startX, startY, controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, endX, endY);
  
  // 繪製簡單的花朵
  fill(random(200, 255), random(100, 150), random(100, 200));
  noStroke();
  ellipse(endX, endY, 10, 10);
}

function windowResized() {
  resizeCanvas(windowHeight, windowHeight)
}