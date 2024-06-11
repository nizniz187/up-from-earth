'use strict'

// Canvas settings
const FRAME_RATE = 60

// Cloud settings
const NUM_CLOUDS = 30
const CLOUD_SIZE_RATIO = 0.1
const CLOUD_OPACITY = 240

// Flower settings
const MIN_NUM_FLOWERS = 200
const MAX_NUM_FLOWERS = 300
const MIN_NUM_LEAVES = 3
const MAX_NUM_LEAVES = 7
const MIN_LEAF_LENGTH = 50
const MAX_LEAF_LENGTH = 100
const LEAF_WIDTH_RATIO = 0.2
const NUM_PETALS = 8 // Cosmos typically have 8 petals
const MIN_PETAL_LENGTH = 30
const MAX_PETAL_LENGTH = 60
const MIN_PETAL_WIDTH = 10
const MAX_PETAL_WIDTH = 20
const FLOWER_COLOR_DEVIATION = 50

let canvasSize

function setup() {
  canvasSize = min(windowWidth, windowHeight)
  createCanvas(canvasSize, canvasSize)

  noLoop()
}

function draw() {
  // Randomly generate center point
  const centerX = random(width * 0.25, width * 0.75)
  const centerY = random(height * 0.25, height * 0.75)

  background(120, 165, 240)

  // Draw clouds
  for (let i = 0; i < NUM_CLOUDS; i++) {
    drawCloud(random(width), random(height))
  }

  // Draw flowers
  for (let i = 0; i < random(MIN_NUM_FLOWERS, MAX_NUM_FLOWERS); i++) {
    drawCurvedStem(centerX, centerY)
  }
}

function drawCloud(x, y) {
  fill(240, CLOUD_OPACITY)
  noStroke()
  
  const baseSize = canvasSize * CLOUD_SIZE_RATIO
  ellipse(x, y, baseSize + random(100), baseSize + random(100))
  ellipse(x + 40 + random(-50, 50), y + random(-50, 50), baseSize + random(100), baseSize + random(100))
  ellipse(x + 80 + random(-50, 50), y + random(-50, 50), baseSize + random(100), baseSize + random(100))
  ellipse(x + 20 + random(-50, 50), y - 40 + random(-50, 50), baseSize + random(100), baseSize + random(100))
  ellipse(x + 60 + random(-50, 50), y - 40 + random(-50, 50), baseSize + random(100), baseSize + random(100))
}

function drawCurvedStem(centerX, centerY) {
  // Randomly generate angle
  const angle = random(TWO_PI)

  // Calculate starting point, making it flush with the canvas edge
  let startX, startY
  if (angle >= 0 && angle < PI / 2) { // Bottom right quadrant
    startX = width
    startY = centerY + tan(angle) * (width - centerX)
  } else if (angle >= PI / 2 && angle < PI) { // Bottom left quadrant
    startX = 0
    startY = centerY + tan(PI - angle) * centerX
  } else if (angle >= PI && angle < 3 * PI / 2) { // Top left quadrant
    startX = 0
    startY = centerY - tan(angle - PI) * centerX
  } else { // Top right quadrant
    startX = width
    startY = centerY - tan(TWO_PI - angle) * (width - centerX)
  }

  const endDistance = random(100, 1000) // Reserved distance
  const endX = centerX + cos(angle) * endDistance
  const endY = centerY + sin(angle) * endDistance

  const stemColor = color(
    random(50, 100), // Random red component, kept low
    random(150, 255), // Random green component, kept high
    random(50, 100) // Random blue component, kept low
  )

  // Draw Cosmos flower
  drawCosmos(endX, endY, stemColor)
  
  stroke(stemColor) // Set the color of the stem
  strokeWeight(random(2, 4)) // Set the thickness of the stem
  noFill()

  // Randomly generate control points to draw the curved stem
  const controlPoint1X = startX + cos(angle) * random(-50, 50)
  const controlPoint1Y = startY + sin(angle) * random(-50, 50)
  const controlPoint2X = endX + cos(angle + PI / 2) * random(-50, 50)
  const controlPoint2Y = endY + sin(angle + PI / 2) * random(-50, 50)

  // Use Bezier curves to draw the stem
  bezier(startX, startY, controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, endX, endY)
  
  // Randomly generate the position and direction of the leaves
  const leafCount = floor(random(MIN_NUM_LEAVES, MAX_NUM_LEAVES)) // Randomly generate the number of leaves
  for (let i = 0; i < leafCount; i++) {
    let t = random() // Random position on the Bezier curve
    let leafX = bezierPoint(startX, controlPoint1X, controlPoint2X, endX, t)
    let leafY = bezierPoint(startY, controlPoint1Y, controlPoint2Y, endY, t)
    drawLeaf(leafX, leafY, angle + random(-PI / 4, PI / 4), stemColor) // Randomly generate the angle of the leaves
  }
}

function drawCosmos(x, y, stemColor) {
  const petalColors = [
    color(255, 105, 180), // Pink
    color(255, 255, 255), // White
    color(255, 165, 0),   // Orange
    color(160, 32, 240)   // Purple
  ]
  
  const petalColor = random(petalColors)
  const petalLength = random(MIN_PETAL_LENGTH, MAX_PETAL_LENGTH)
  const petalWidth = random(MIN_PETAL_WIDTH, MAX_PETAL_WIDTH)
  
  noStroke()

  for (let i = 0; i < NUM_PETALS; i++) {
    const angle = map(i, 0, NUM_PETALS, 0, TWO_PI)
    push()
    translate(x, y)
    rotate(angle)
    drawGradientEllipse(0, petalLength / 2, petalWidth, petalLength, petalColor) // Apply gradient
    pop()
  }
  
  const centerPetalLength = petalWidth / 2
  const centerPetalWidth = petalWidth / 2
  
  for (let i = 0; i < NUM_PETALS; i++) {
    const angle = map(i, 0, NUM_PETALS, 0, TWO_PI)
    push()
    translate(x, y)
    rotate(angle)
    drawGradientEllipse(0, centerPetalLength / 2, centerPetalWidth, centerPetalLength, stemColor) // Apply gradient to the center
    pop()
  }
}

function drawGradientEllipse(x, y, w, h, col1) {
  const col2 = color(
    red(col1) + FLOWER_COLOR_DEVIATION, 
    green(col1) + FLOWER_COLOR_DEVIATION, 
    blue(col1) + FLOWER_COLOR_DEVIATION, 
    random(0, 255)
  )
  for (let i = 0; i <= 1; i += 0.01) {
    const inter = lerpColor(col1, col2, i)
    fill(inter)
    ellipse(x, y, w * (1 - i), h * (1 - i))
  }
}

function drawLeaf(x, y, angle, color) {
  const leafLength = random(MIN_LEAF_LENGTH, MAX_LEAF_LENGTH) // Randomly generate the length of the leaf
  const leafWidth = leafLength * LEAF_WIDTH_RATIO // Set the width of the leaf

  push()
  translate(x, y)
  rotate(angle)

  noStroke()

  beginShape()
  vertex(0, 0)
  bezierVertex(-leafWidth, -leafLength / 3, -leafWidth, -2 * leafLength / 3, 0, -leafLength)
  bezierVertex(leafWidth, -2 * leafLength / 3, leafWidth, -leafLength / 3, 0, 0)
  endShape(CLOSE)

  drawGradientLeaf(0, 0, leafWidth, leafLength, color) // Apply gradient

  pop()
}

function drawGradientLeaf(x, y, w, h, col1) {
  const col2 = color(random(100, 150), random(150, 200), random(100, 150), random(0, 255))
  for (let i = 0; i <= 1; i += 0.01) {
    const inter = lerpColor(col1, col2, i)
    fill(inter)
    beginShape()
    vertex(x, y)
    bezierVertex(x - w / 2, y - h / 3, x - w / 2, y - 2 * h / 3, x, y - h * (1 - i))
    bezierVertex(x + w / 2, y - 2 * h / 3, x + w / 2, y - h / 3, x, y)
    endShape(CLOSE)
  }
}

function mousePressed() {
  draw()
}

function windowResized() {
  canvasSize = min(windowWidth, windowHeight)
  resizeCanvas(canvasSize, canvasSize)
}