const Particle = require('./Particle');
const Mesh = require('./Mesh');
const { createVertices } = require('./utils');
const { getColor } = require('../color');

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
        restPosition: pos,
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

  // mesh.attrs.constraints.positions = [
  //   {
  //     i: 0,
  //     position: mesh.vertices[0].position,
  //   },
  //   {
  //     i: subdivisions,
  //     position: mesh.vertices[subdivisions].position,
  //   },
  // ];
  
  return mesh;
};

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
  getRopeLinesMesh,
};
