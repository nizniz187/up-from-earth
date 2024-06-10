function setup() {
  createCanvas(windowWidth, windowHeight);
  background(120, 165, 240);
  noLoop();  // 只运行一次，避免重复绘制
}

function draw() {
  drawRandomClouds(30);
}

function drawRandomClouds(numClouds) {
  for (let i = 0; i < numClouds; i++) {
    let x = random(width);
    let y = random(height);
    drawCloud(x, y);
  }
}

function drawCloud(x, y) {
  fill(255, 245);
  noStroke();
  
  const baseSize = 100;
  ellipse(x, y, baseSize + random(100), baseSize + random(100));
  ellipse(x + 40 + random(-50, 50), y + random(-50, 50), baseSize + random(100), baseSize + random(100));
  ellipse(x + 80 + random(-50, 50), y + random(-50, 50), baseSize + random(100), baseSize + random(100));
  ellipse(x + 20 + random(-50, 50), y - 40 + random(-50, 50), baseSize + random(100), baseSize + random(100));
  ellipse(x + 60 + random(-50, 50), y - 40 + random(-50, 50), baseSize + random(100), baseSize + random(100));
}