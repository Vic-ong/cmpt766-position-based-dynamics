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
let t = 0;
let f = [0, 0, 0];
const applyWindForces = (mesh, timestep) => {
  f = [0, getRandomInt(100, 500), 0];
  vertIndex = getRandomInt(1, mesh.vertices.length - 2);
  if (t === mesh.vertices.length - 1) {
    t = 0;
  }
  const velocity = mesh.vertices[vertIndex].velocity;
  scaleAndAdd(velocity, velocity, f, timestep);
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
  applyExternalForce(mesh, gravity, timestep);
  applyWindForces(mesh, timestep);
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
