let units;
let robot;

const FRAME_RATE = 25;
const UPDATE_RATE = 800;

const ROBOT_WIDTH = 100;
const ROBOT_HEIGHT = 100;

let xyVisualVelocity = 1;
let angleVisualVelocity = 2;

const getElement = (query) => {
  return document.querySelector(query);
};

const angleDiff = (firstAngle, secondAngle) => {
  let diff = secondAngle - firstAngle;
  while (Math.abs(diff) > PI) {
    if (diff > 0) {
      diff -= TWO_PI;
    } else if (diff < 0) {
      diff += TWO_PI;
    }
  }
  return diff;
};

const bound = (value, limit) => {
  if (Math.abs(value) > limit) {
    return Math.sign(value) * limit;
  }
  return value;
};

let userVel;

function setup() {
  // put setup code here
  createCanvas(1920, 1080);
  stroke(255);
  frameRate(FRAME_RATE);

  const unitColors = ["red", "green", "blue", "orange"];

  // Init 4 swerve units in a rect shape according to width and height
  units = Array(4)
    .fill()
    .map((_, idx) => {
      return new SwerveUnit(
        (idx % 2) * ROBOT_WIDTH + 200,
        Math.floor(idx / 2) * ROBOT_HEIGHT + 200,
        color(unitColors[idx])
      );
    });

  robot = {
    units: units,
    heading: 0,
    pos: createVector(ROBOT_WIDTH / 2 + 200, ROBOT_HEIGHT / 2 + 200),
  };

  window.addEventListener(
    "keydown",
    function (e) {
      // space and arrow keys
      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    },
    false
  );

  userVel = createVector(0, 0);
}

let pause = false;
let angleVel = 0;

function draw() {
  if (!pause) {
    background(0);

    for (let i = 0; i < Math.floor(UPDATE_RATE / FRAME_RATE); i++) {
      robot.pos.x = 0;
      robot.pos.y = 0;

      robot.units.forEach((unit) => {
        robot.pos.x += unit.pos.x;
        robot.pos.y += unit.pos.y;
      });

      robot.pos.x /= 4;
      robot.pos.y /= 4;

      robot.heading = p5.Vector.sub(
        robot.units[1].pos,
        robot.units[0].pos
      ).heading();

      spinRobot(robot, angleVel, 250, 250);
      moveRobot(robot, userVel.x, userVel.y);

      robot.units.forEach(updateUnit);

      userVel.setMag(userVel.mag() * 0.997);

      if (keyIsDown(RIGHT_ARROW)) {
        userVel.x += xyVisualVelocity / UPDATE_RATE;
      }
      if (keyIsDown(LEFT_ARROW)) {
        userVel.x -= xyVisualVelocity / UPDATE_RATE;
      }
      if (keyIsDown(DOWN_ARROW)) {
        userVel.y += xyVisualVelocity / UPDATE_RATE;
      }
      if (keyIsDown(UP_ARROW)) {
        userVel.y -= xyVisualVelocity / UPDATE_RATE;
      }

      if (keyIsDown(68)) {
        angleVel = angleVisualVelocity / UPDATE_RATE;
      } else if (keyIsDown(65)) {
        angleVel = -angleVisualVelocity / UPDATE_RATE;
      // } else if (!mouseIsPressed && getElement("#useMouse").checked) {
      //   let robotHeadingError = angleDiff(robot.heading, userVel.heading());
      //   angleVel = robotHeadingError * 0.005;
      //   angleVel = bound(angleVel, 0.005);
      } else {
        angleVel = 0;
      }

      // if (getElement("#useMouse").checked) {
      //   userVel.x = bound((mouseX - robot.pos.x) * 0.005, 1);
      //   userVel.y = bound((mouseY - robot.pos.y) * 0.005, 1);
      // }
    }

    robot.units.forEach(renderUnit);
    renderRobot(robot);
  }
}
