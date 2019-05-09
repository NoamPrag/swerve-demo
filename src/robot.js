const spinRobot = (robot, vel, pivotX, pivotY) => {
    const pivotPoint = createVector(pivotX, pivotY);

    robot.units.forEach(unit => {
      const centerVect = p5.Vector.sub(pivotPoint, unit.robotPos);
      const velVect = createVector(centerVect.y, -centerVect.x);

      velVect.setMag(velVect.mag()*vel);

      setUnit(velVect.heading() + robot.heading, velVect.mag(), unit);

    });
    // robot.heading += vel;
  };

  const moveRobot = (robot, velX, velY) => {
    const moveVect = createVector(velX, velY);

    robot.units.forEach(unit => {
      const addedVelVec = p5.Vector.add(unit.targetVel, moveVect);

      setUnit(addedVelVec.heading(), addedVelVec.mag(), unit);
    });

    // robot.pos = p5.Vector.add(robot.pos, moveVect);
  };

  const renderRobot = (robot) => {
    const vectEnd = p5.Vector.add(robot.pos,
      p5.Vector.fromAngle(robot.heading, 100));
    stroke(255)
    ellipse(robot.pos.x, robot.pos.y, 5, 5);
    line(robot.pos.x, robot.pos.y, vectEnd.x, vectEnd.y);
  }
