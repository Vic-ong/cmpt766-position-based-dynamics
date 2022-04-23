const { scaleAndAdd, copy } = require("gl-vec3");
const {
  applyExternalForce,
  applyVelocityDamping,
  estimateProposedPosition,
  projectConstraints,
  updateVelocities,
  updatePositions,
} = require('./constraints');
const { getRandomInt } = require('./utils');

// Simulate wind using random force values
// v_new = v_old + (force * dt)
let t = 2;
let f = [0, 0, 0];
const applyMovingForces = (mesh, timestep) => {
  f = [0, 300, 0];
  f2 = [0, 150, 0];
  f3 = [0, 75, 0];
  if (t === mesh.vertices.length - 4) {
    t = 2;
  }
  const velocity = mesh.vertices[t].velocity;
  scaleAndAdd(velocity, velocity, f, timestep);
  
  const velocity2 = mesh.vertices[t - 1].velocity;
  scaleAndAdd(velocity2, velocity2, f2, timestep);
  
  const velocity3 = mesh.vertices[t - 2].velocity;
  scaleAndAdd(velocity3, velocity3, f3, timestep);
  
  const velocity4 = mesh.vertices[t + 1].velocity;
  scaleAndAdd(velocity4, velocity4, f2, timestep);
  
  const velocity5 = mesh.vertices[t + 2].velocity;
  scaleAndAdd(velocity5, velocity5, f3, timestep);
  t++;
};

// Constraint both ends of the rope
const projectRopePointConstraints = (mesh) => {
  mesh.attrs.constraints.positions.forEach((pos) => {
    const { i, position } = pos;
    copy(mesh.vertices[i].attrs.proposedPosition, position);
  })
};

const solve = ({ mesh, damping, timestep, iterationCount, gravity }) => {
  // applyExternalForce(mesh, gravity, timestep);
  applyMovingForces(mesh, timestep);
  applyVelocityDamping(mesh, damping);
  estimateProposedPosition(mesh, timestep);

  while (iterationCount--) {
    projectConstraints(mesh);
    projectRopePointConstraints(mesh);
  }

  updateVelocities(mesh, timestep);
  updatePositions(mesh);
};

module.exports = {
  solve,
};
