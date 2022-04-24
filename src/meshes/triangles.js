const { subtract, cross, normalize } = require("gl-vec3");
const Mesh = require('./Mesh');
const { createVertices } = require('./utils');
const { getColor } = require('../utils/color');

const e1 = [ 0, 0, 0 ];
const e2 = [ 0, 0, 0 ];

const normal = (v) => {
  const n = [ 0, 0, 0 ];

  subtract(e1, v[0], v[1]);
  subtract(e2, v[0], v[2]);
  cross(n, e1, e2);
  normalize(n, n);
  return [ n[0], n[1], n[2] ];
};

const createTriangleMesh = (vertices, color) => {
  const mesh = new Mesh({
    vertices,
    primitive: 'triangles',
    color,
  });
  mesh.attrs.normals = normal(vertices.map((v) => v.position));
  
  return mesh;
};

const createFloor = () => {
  const vertices = createVertices([
    [10, 0, -10],
    [-10, 0, 0],
    [10, 0, 10],
  ])
  return createTriangleMesh(vertices, getColor(188, 188, 188, 0.8));
};

module.exports = {
  createFloor,
};