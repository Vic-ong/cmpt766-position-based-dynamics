const Mesh = require('./Mesh');
const { createVertices } = require('./utils');
const { red, blue, green } = require('../color');

const createAxes = () => {
  const axisLength = 50;
  axisXVertices = createVertices([
    [0, 0, 0],
    [axisLength, 0, 0],
    [0, 0, 0],
  ]);
  axisYVertices = createVertices([
    [0, 0, 0],
    [0, axisLength, 0],
  ]);
  axisZVertices = createVertices([
    [0, 0, 0],
    [0, 0, axisLength],
  ]);
  const primitive = 'lines';

  // [x, y, z]
  return [
    new Mesh({
      vertices: axisXVertices,
      primitive,
      color: red,
    }),
    new Mesh({
      vertices: axisYVertices,
      primitive,
      color: blue,
    }),
    new Mesh({
      vertices: axisZVertices,
      primitive,
      color: green,
    }),
  ];
};

module.exports = {
  createAxes,
};