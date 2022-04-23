const defaultMassInv = 1;
const defaultPosition = [0, 0, 0];
const defaultVelocity = [0, 0, 0];
const defaultAttrs = {};

class Particle {
  constructor(props = {}) {
    this.massInv = props.massInv || defaultMassInv;
    this.position = props.position || defaultPosition;
    this.velocity = props.velocity || defaultVelocity;
    this.attrs = props.attrs || defaultAttrs;
  }
}

module.exports = Particle;
