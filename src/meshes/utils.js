const Particle = require("./Particle");

const createVertices = (coordinates) => {
  return coordinates.map((c) => {
    return new Particle({
      position: c,
    });
  })
};

const calcEncantoPartitionRatio = (partition, sigma = 2/3, tau = 0.14815) => {
  // ratio = 1 - ((sigma  * partition - sigma)^2 + (sigma * partition - sigma)^3) / tau
  // sigma --> shifts curve left and right
  // tau --> scale curve vertically
  return 1 - ((sigma * partition - sigma)**2 + (sigma * partition - sigma)**3) / tau;
}

module.exports = {
  createVertices,
  calcEncantoPartitionRatio,
};
