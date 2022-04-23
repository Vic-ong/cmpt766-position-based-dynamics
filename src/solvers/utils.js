const getRandomInt = (min = 0, max = 1) => {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
};

const degToRad = (deg) => Math.PI / 180 * deg;

module.exports = {
  getRandomInt,
  degToRad,
};
