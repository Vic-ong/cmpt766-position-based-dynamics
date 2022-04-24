const { scaleAndAdd, copy } = require("gl-vec3");
const {
  applyExternalForce,
  applyVelocityDamping,
  estimateProposedPosition,
  // generateCollisionConstraints,
  projectDistanceConstraints,
  updateVelocities,
  updatePositions,
} = require('./constraints');
const { getRandomInt } = require('./utils');

// Simulate wind forcce
// v_new = v_old + (force * dt)
let forceIndex = 0;
const applyWindForces = (mesh, timestep) => {
  force = [getRandomInt(-200, 200), getRandomInt(100, 2200), getRandomInt(-200, 200)];
  const velocity = mesh.vertices[forceIndex].velocity;
  scaleAndAdd(velocity, velocity, force, timestep);

  if (forceIndex > 1 / 2 * mesh.vertices.length) {
    for (let i = 0; i < 1 / 4 * mesh.vertices.length; i++) {
      const randI = getRandomInt(0, Math.floor(1 / 4 * mesh.vertices.length));
      const f = [getRandomInt(-50, 50), getRandomInt(30, 70), getRandomInt(-50, 50)];
      const v = mesh.vertices[randI].velocity;
      scaleAndAdd(v, v, f, timestep);
    } 
  }

  if (forceIndex > mesh.vertices.length - 2) {
    forceIndex = 0;
  } else {
    forceIndex++;
  }
};

// Constraint both ends of the rope
const projectRopePointConstraints = (mesh) => {
  mesh.attrs.constraints.positions.forEach((pos) => {
    const { i, position } = pos;
    copy(mesh.vertices[i].attrs.proposedPosition, position);
  })
};

const solve = ({ mesh, damping, timestep, iterationCount, props = {} }) => {
  const { gravity, floor } = props;
  applyExternalForce(mesh, gravity, timestep);
  applyWindForces(mesh, timestep);
  applyVelocityDamping(mesh, damping);
  estimateProposedPosition(mesh, timestep);
  // generateCollisionConstraints(floor, mesh);

  while (iterationCount--) {
    projectDistanceConstraints(mesh);
    projectRopePointConstraints(mesh);
  }

  updateVelocities(mesh, timestep);
  updatePositions(mesh);
};

module.exports = {
  solve,
};
