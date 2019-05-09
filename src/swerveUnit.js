const timeRes = 10;

const min = (compFunc, ...numbers) => {
    let minNum = compFunc(numbers[0]);

    numbers.forEach(num => {
        if (compFunc(num) < minNum) {
            minNum = num;
        }
    });

    return minNum;
};

class SwerveUnit {
    constructor(robotX, robotY, color = color(255), maxVel = 100, maxAcc = 0.01, jerk = 1) {
        // Positioning in the robot
        this.robotPos = createVector(robotX, robotY);

        // Current state
        this.pos = createVector(robotX, robotY);
        this.vel = createVector(0, 0);
        this.acc = 0;
        this.jerk = jerk;

        // Physical constraints
        this.maxAcc = maxAcc;
        this.maxVel = maxVel;
        this.efficiency;

        // User commands
        this.targetVel = createVector(0, 0);

        this.color = color;
    }
}

// Render the module
const renderUnit = unit => {
    const vectEnd = p5.Vector.add(unit.pos,
        p5.Vector.fromAngle(unit.vel.heading(), unit.vel.mag() * 120));

    stroke(unit.color);
    strokeWeight(4);
    ellipse(unit.pos.x, unit.pos.y, 20, 20);
    line(unit.pos.x, unit.pos.y, vectEnd.x, vectEnd.y);
};

// Set a command for the module to do
const setUnit = (heading, velocity, unit) => {
    unit.targetVel = p5.Vector.fromAngle(heading, velocity);
};

// Update the module state parameters
const updateUnit = unit => {
    const velMag = unit.vel.mag();
    const dir = Math.sign(unit.targetVel.mag() - velMag)
    const velPrec = (Math.abs(unit.maxVel) - Math.abs(velMag)) / unit.maxVel;

    unit.acc = min(Math.abs, unit.acc + dir * unit.jerk, unit.maxAcc * velPrec);

    // Update velocity vector according to the target values
    // and ceil it with max velocity and acceleration

    // const ceiledVel = min(Math.abs, velMag + dir * unit.acc, unit.maxVel, unit.targetVel.mag());
    //     unit.vel = p5.Vector.fromAngle(unit.targetVel.heading(), ceiledVel);

    unit.vel = unit.targetVel;
    // Update position
    unit.pos = p5.Vector.add(unit.pos, unit.vel);
};