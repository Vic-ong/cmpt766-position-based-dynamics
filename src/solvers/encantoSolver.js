const { scaleAndAdd, copy } = require("gl-vec3");
const {
  applyVelocityDamping,
  estimateProposedPosition,
  projectDistanceConstraints,
  updateVelocities,
  updatePositions,
} = require('./constraints');

let k = 0;
const clog = (v) => {
  if (k < 300) console.log(v);
  k++;
}

// Simulate upward moving forces to simulate roof opening
// v_new = v_old + (force * dt)
const applyMovingForces = (mesh, timestep) => {
  const { currIndex, forces } = mesh.attrs.movingForces;

  forces[currIndex].forEach(({ force, i }) => {
    const v = mesh.vertices[i].velocity;
    scaleAndAdd(v, v, force, timestep);
  });

  // const velocity = mesh.vertices[forces[currIndex].i].velocity;
  // scaleAndAdd(velocity, velocity, forces[currIndex].force, timestep);
  
  // const velocity2 = mesh.vertices[forces[currIndex].i - 1].velocity;
  // scaleAndAdd(velocity2, velocity2, forces[currIndex].force, timestep);
  
  // const velocity3 = mesh.vertices[forces[currIndex].i + 1].velocity;
  // scaleAndAdd(velocity3, velocity3, forces[currIndex].force, timestep);
};

// Project moving point constraints
const projectRopePointConstraints = (mesh) => {
  const { currIndex } = mesh.attrs.constraints.movingPositions;
  const [i1, i2] = mesh.attrs.constraints.movingPositions.indexes[currIndex];

  for (let i = 0; i <= i1; i++) {
    const p1 = mesh.vertices[i].attrs.restPosition;
    copy(mesh.vertices[i].attrs.proposedPosition, p1);
  }
  for (let i = i2; i < mesh.vertices.length; i++) {
    const p2 = mesh.vertices[i].attrs.restPosition;
    copy(mesh.vertices[i].attrs.proposedPosition, p2);
  }

  // copy(mesh.vertices[0].attrs.proposedPosition, mesh.vertices[0].attrs.restPosition);
  // copy(mesh.vertices[mesh.attrs.subdivisions].attrs.proposedPosition, mesh.vertices[mesh.attrs.subdivisions].attrs.restPosition);
};

// Project rest state
const projectRopePointRestConstraints = (mesh) => {
  for (let i = 0; i < mesh.vertices.length; i++) {
    const p = mesh.vertices[i].attrs.restPosition;
    copy(mesh.vertices[i].attrs.proposedPosition, p);
  }
};

const solve = ({ mesh, damping, timestep, iterationCount }) => {
  const { delay, postDelay } = mesh.attrs.time;

  if (!delay || performance.now() / 1000 > delay) {
    applyMovingForces(mesh, timestep);
    applyVelocityDamping(mesh, damping);
    estimateProposedPosition(mesh, timestep);

    if (postDelay && mesh.attrs.time.timer) {
      projectRopePointRestConstraints(mesh);
    } else {
      while (iterationCount--) {
        projectDistanceConstraints(mesh);
        projectRopePointConstraints(mesh);
      }
    }

    updateVelocities(mesh, timestep);
    updatePositions(mesh);

    if (!postDelay || !mesh.attrs.time.timer) {
      // Increment iterators
      // - Resets the iterator when it reaches the end of the array
      if (mesh.attrs.movingForces.currIndex === mesh.attrs.movingForces.forces.length - 1) {
        mesh.attrs.movingForces.currIndex = 0;
        mesh.attrs.time.timer = true;
        setTimeout(() => {
          mesh.attrs.time.timer = false;
        }, postDelay * 1000);
      } else {
        mesh.attrs.movingForces.currIndex++;
      }

      if (mesh.attrs.constraints.movingPositions.currIndex === mesh.attrs.constraints.movingPositions.indexes.length - 1) {
        mesh.attrs.constraints.movingPositions.currIndex = 0;
      } else {
        mesh.attrs.constraints.movingPositions.currIndex++;
      }
    }
  }
};

module.exports = {
  solve,
};
