const { length, scale, scaleAndAdd, subtract, copy, dot } = require("gl-vec3");

// v_new = v_old + (force * dt)
const applyExternalForce = (mesh, force, timestep) => {
  mesh.vertices.forEach(({ velocity }) => {
    scaleAndAdd(velocity, velocity, force, timestep);
  });
};

// v_new = v_old * damping_coefficient
const applyVelocityDamping = (mesh, damping) => {
  mesh.vertices.forEach(({ velocity }) => {
    scale(velocity, velocity, damping);
  });
};

// Estimate position if there's no internal force
// p = x + (v_new * dt)
const estimateProposedPosition = (mesh, timestep) => {
  mesh.vertices.forEach(({ position, velocity, attrs }) => {
    scaleAndAdd(attrs.proposedPosition, position, velocity, timestep);
  });
};

// Update p to satisfy constraints
const projectDistanceConstraints = (mesh) => {
  const delta_p = [0, 0, 0];
  const n = [0, 0, 0];

  for (let i = 0; i < mesh.attrs.constraints.distances.length; i++) {
    const { i1, i2, length: restLength } = mesh.attrs.constraints.distances[i];
    let p1 = mesh.vertices[i1];
    let p2 = mesh.vertices[i2];
    let p1_proposed = p1.attrs.proposedPosition;
    let p2_proposed = p2.attrs.proposedPosition;

    // C(p1, p2) = |p1 - p2| - d
    // length at rest position or the original length --> d
    subtract(delta_p, p1_proposed, p2_proposed);
    const distance_p = length(delta_p); // |p1 - p2|
    const c = distance_p - restLength;

    // Move to the next iterator if constraints are satisfied
    // Use Number.EPSILON to approximate 0 because we're comparing with floating numbers
    if (c > -Number.EPSILON && c < Number.EPSILON) {
      continue;
    }

    // Compute normal of (p1 - p2) vector
    // n = (p1 - p2) / |p1 - p2|
    scale(n, delta_p, 1 / distance_p);

    // Compute scaling factor
    // s = (|p1 - p2| - d) / (w1 + w2)
    // massInv --> w
    const s = c / (p1.massInv + p2.massInv);

    // Scale updates by inverse mass
    // delta_p = (-s * w) * n
    // p = p + delta_p
    scaleAndAdd(p1_proposed, p1_proposed, n, -p1.massInv * s);
    scaleAndAdd(p2_proposed, p2_proposed, n, p2.massInv * s);
  }
};

const updateVelocities = (mesh, timestep) => {
  if (timestep === 0) return;
  mesh.vertices.forEach(({ position, velocity, attrs }) => {
    subtract(velocity, attrs.proposedPosition, position);
    scale(velocity, velocity, 1 / timestep);
  });
}

// Set final position as proposed position
// x = p
const updatePositions = (mesh) => {
  mesh.vertices.forEach(({ position, attrs }) => {
    copy(position, attrs.proposedPosition);
  });
};

module.exports = {
  applyExternalForce,
  applyVelocityDamping,
  estimateProposedPosition,
  projectDistanceConstraints,
  updateVelocities,
  updatePositions,
};
