const { scaleAndAdd, copy, add } = require("gl-vec3");
const {
  applyExternalForce,
  applyVelocityDamping,
  estimateProposedPosition,
  projectDistanceConstraints,
  updateVelocities,
  updatePositions,
} = require('./constraints');

// Simulate wind forcce
// v_new = v_old + (force * dt)
let forceIndex = 0;
const applyAdditionalPressureForces = (mesh, force, timestep) => {
  const velocity = mesh.vertices[forceIndex].velocity;
  scaleAndAdd(velocity, velocity, force, timestep);

  for(let i = 0; i < forceIndex; i++) {
      const velocity2 = mesh.vertices[i].velocity;
      scaleAndAdd(velocity2, velocity2, force, timestep);
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
  const { gravity, pressure, wind } = props;
  const totalForce = [0, 0, 0];
  const existingPressure = [0, 8, 0]; // existing in the air puppet to keep it midly afloat
  add(totalForce, gravity, existingPressure);
  add(totalForce, totalForce, wind)

  applyExternalForce(mesh, totalForce, timestep);
  applyAdditionalPressureForces(mesh, pressure, timestep);
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
