const Particle = require('./Particle');

const defaultVertices = [new Particle()];
const defaultPrimitive = 'points';
const defaultColor = [0, 0, 0, 1];
const defaultAttrs = {};

class Mesh {
  constructor(props) {
    this.vertices = props.vertices || defaultVertices;
    this.primitive = props.primitive || defaultPrimitive;
    this.color = props.color || defaultColor;
    this.attrs = props.attrs || defaultAttrs;
  }
}

module.exports = Mesh;
