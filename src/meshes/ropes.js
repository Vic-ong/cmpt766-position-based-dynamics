const Particle = require('./Particle');
const Mesh = require('./Mesh');
const { createVertices, calcEncantoPartitionRatio } = require('./utils');
const { getColor } = require('../utils/color');

const createRopeMesh = ({
  subdivisions = 10,
  length = 10,
  mass = 1,
  offset = [0, 0, 0],
  color = getColor(79, 219, 176),
  stiffness = 1,
} = {}) => {
  const [offsetX, offsetY, offsetZ] = offset;
  const subDivLength = length / subdivisions;
  const mesh = new Mesh({
    primitive: 'points',
    color,
    vertices: [],
    attrs: {
      subdivisions,
      length,
      constraints: {
        distances: [],
        positions: [],
        constraints: [],
      },
    },
  });

  // Construct rope vertices and constraints
  for (let i = 0; i <= subdivisions; i++) {
    const pos = [
      (subDivLength * i) + offsetX,
      offsetY,
      offsetZ,
    ];
    mesh.vertices.push(new Particle({
      massInv: 1 / (mass / (subdivisions + 1)),
      position: pos,
      velocity: [0, 0, 0],
      attrs: {
        restPosition: JSON.parse(JSON.stringify(pos)), // deep copy
        proposedPosition: [0, 0, 0],
      },
    }));
    if (i > 0) {
      mesh.attrs.constraints.distances.push({
        i1: i - 1,
        i2: i,
        length: subDivLength,
        stiffness,
      });
    }
  }
  
  return mesh;
};

const createEncantoRoofMesh = ({
  subdivisions,
  length,
  mass,
  offset,
  color,
  timestep = 1 / 60,
  gapLength = 3,
  force = [0, 5, 0],
  time = {
    delay: 0,
    postDelay: 0,
  },
  reverse = false,
} = {}) => {
  const mesh = createRopeMesh({
    subdivisions,
    length,
    mass,
    offset,
    color,
  });

  mesh.attrs.time = {
    timer: false,
    ...time,
  };

  // Set moving point constraint indexes
  const posStartIndex = 0;
  mesh.attrs.constraints.movingPositions = {
    currIndex: 0,
    indexes: [],
  };
  if (reverse) {
    // +x to -x
    for(let i = mesh.vertices.length - 1 - (gapLength * 2); i >= posStartIndex; i--) {
      mesh.attrs.constraints.movingPositions.indexes.push([
        i,
        i + (gapLength * 2),
      ]);
    }
  } else {
    // -x to +x
    for(let i = posStartIndex; i < mesh.vertices.length - (gapLength * 2); i++) {
      mesh.attrs.constraints.movingPositions.indexes.push([
        i,
        i + (gapLength * 2),
      ]);
    }
  }

  // Set moving forces
  const startIndex = gapLength;
  mesh.attrs.movingForces = {
    currIndex: 0,
    forces: [],
  };
  if (reverse) {
    // +x to -x
    for(let i = mesh.vertices.length - 1 - startIndex; i >= startIndex; i--) {
      const forces = [];
      for (let j = 1; j <= gapLength; j++) {
        const partition = j / gapLength;
        const fy = force[1] * calcEncantoPartitionRatio(partition);
        if (j === 1) {
          forces.push({
            i,
            force: [0, fy, 0],
          });
        } else {
          forces.unshift({
            i: i - j + 1,
            force: [0, fy, 0],
          });
          forces.push({
            i: i + j - 1,
            force: [0, fy, 0],
          });
        }
      }
      mesh.attrs.movingForces.forces.push(forces);
    }
  } else {
    // -x to +x
    for(let i = startIndex; i < mesh.vertices.length - startIndex; i++) {
      const forces = [];
      for (let j = 1; j <= gapLength; j++) {
        const partition = j / gapLength;
        const fy = force[1] * calcEncantoPartitionRatio(partition);
        if (j === 1) {
          forces.push({
            i,
            force: [0, fy, 0],
          });
        } else {
          forces.unshift({
            i: i - j + 1,
            force: [0, fy, 0],
          });
          forces.push({
            i: i + j - 1,
            force: [0, fy, 0],
          });
        }
      }
      mesh.attrs.movingForces.forces.push(forces);
    }
  }

  return mesh;
};

// Generate data render lines based on the rope point mesh
const getRopeLinesMesh = (mesh) => {
  const positions = mesh.attrs.constraints.distances.reduce((acc, curr) => {
    acc.push(mesh.vertices[curr.i1].position);
    acc.push(mesh.vertices[curr.i2].position);
    return acc;
  }, []);
  
  return new Mesh({
    vertices: createVertices(positions),
    color: getColor(121, 53, 131),
    primitive: 'lines',
  });
};

module.exports = {
  createRopeMesh,
  createEncantoRoofMesh,
  getRopeLinesMesh,
};
