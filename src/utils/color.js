const getColor = (r = 0, g = 0, b = 0, a = 1) => {
  return [
    r / 255,
    g / 255,
    b / 255,
    a,
  ];
};

const red = [1, 0, 0, 0.5];
const green = [0, 1, 0, 0.5];
const blue = [0, 0, 1, 0.5];

module.exports = {
  getColor,
  red,
  green,
  blue,
};
