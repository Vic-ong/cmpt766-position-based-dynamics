const Particle = require("./Particle");

const createVertices = (coordinates) => {
  return coordinates.map((c) => {
    return new Particle({
      position: c,
    });
  })
};

module.exports = {
  createVertices,
};
