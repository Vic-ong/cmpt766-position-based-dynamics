const { scaleAndAdd, copy } = require("gl-vec3");
const {
  applyExternalForce,
  applyVelocityDamping,
  estimateProposedPosition,
  projectDistanceConstraints,
  updateVelocities,
  updatePositions,
} = require('./constraints');
const { getRandomInt } = require('./utils');

// Simulate wind forcce
// v_new = v_old + (force * dt)
const applyWindForces = (mesh, timestep) => {
  force = [0, getRandomInt(100, 500), 0];
  vertIndex = getRandomInt(1, mesh.vertices.length - 2);
  const velocity = mesh.vertices[vertIndex].velocity;
  scaleAndAdd(velocity, velocity, force, timestep);
};

// Constraint both ends of the rope
const projectRopePointConstraints = (mesh) => {
  mesh.attrs.constraints.positions.forEach((pos) => {
    const { i, position } = pos;
    copy(mesh.vertices[i].attrs.proposedPosition, position);
  })
};

const solve = ({ mesh, damping, timestep, iterationCount, props = {} }) => {
  const { gravity } = props;
  applyExternalForce(mesh, gravity, timestep);
  applyWindForces(mesh, timestep);
  applyVelocityDamping(mesh, damping);
  estimateProposedPosition(mesh, timestep);

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
