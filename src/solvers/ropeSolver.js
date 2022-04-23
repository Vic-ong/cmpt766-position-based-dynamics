const { copy } = require("gl-vec3");
const {
  applyExternalForce,
  applyVelocityDamping,
  estimateProposedPosition,
  projectConstraints,
  updateVelocities,
  updatePositions,
} = require('./constraints');
const { getRandomInt } = require('./utils');

// Constraint both ends of the rope
const projectRopePointConstraints = (mesh) => {
  mesh.attrs.constraints.positions.forEach((pos) => {
    const { i, position } = pos;
    copy(mesh.vertices[i].attrs.proposedPosition, position);
  })
};
// const projectMovingRopePointConstraints = (mesh, timestep) => {
//   mesh.attrs.constraints.positions.forEach((pos, posIndex) => {
//     const { i, position } = pos;
//     let newPos = position;
//     if (posIndex === 1) {
//       newPos = [
//         position[0],
//         position[1] + Math.sin(performance.now() / 1000) * timestep,
//         position[2] + Math.sin(performance.now() / 1000) * timestep,
//       ];
//     }
//     copy(mesh.vertices[i].attrs.proposedPosition, newPos);
//   })
// };

const solve = ({ mesh, damping, timestep, iterationCount, gravity }) => {
  applyExternalForce(mesh, gravity, timestep);
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
