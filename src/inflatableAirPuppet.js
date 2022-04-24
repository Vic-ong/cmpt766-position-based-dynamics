const { scale } = require("gl-vec3");
const { initRender, updateFrame, draw } = require('./utils/renderer');
const { createAxes } = require('./meshes/axes');
const { createRopeMesh, getRopeLinesMesh } = require('./meshes/ropes');
const { solve } = require('./solvers/inflatableAirPuppetSolver');
const { getColor } = require('./utils/color');
const { getRandomInt, degToRad } = require('./solvers/utils');

const TIMESTEP = 1 / 60;
const ITERATIONS = 30;
const DAMPING_COEFFICIENT = 0.99;
const GRAVITY = [0, -10, 0];

// Adjustable parameters
const PRESSURE_STRENGTH = 1;
const WIND_STRENGTH = 1;

// Initializations
initRender({
  camera: {
    center: [3, 5, 0],
    distance: 25,
    theta: degToRad(80),
    phi: degToRad(10),
  }
});

// Get meshes
const axes = createAxes();
const ropeMesh = createRopeMesh({
  subdivisions: 100,
  length: 15,
  mass: 1,
  offset: [0, 0, 0],
  color: getColor(213, 197, 47),
});
ropeMesh.attrs.constraints.positions = [
  {
    i: 0,
    position: ropeMesh.vertices[0].position,
  },
];

// Get solver
const solver = () => {
  const pressure = [0, getRandomInt(10, 30), 0];
  const wind = [getRandomInt(-20, 20), 0, getRandomInt(-20, 20)];
  scale(pressure, pressure, PRESSURE_STRENGTH);
  scale(wind, wind, WIND_STRENGTH);

  solve({
    mesh: ropeMesh,
    damping: DAMPING_COEFFICIENT,
    timestep: TIMESTEP,
    iterationCount: ITERATIONS,
    props: {
      gravity: GRAVITY,
      pressure,
      wind,
    },
  });
};

// Render
const drawer = () => {
  axes.forEach((axis) => draw(axis));
  draw(ropeMesh);
  draw(getRopeLinesMesh(ropeMesh));
};

// Run program
updateFrame(solver, drawer);
