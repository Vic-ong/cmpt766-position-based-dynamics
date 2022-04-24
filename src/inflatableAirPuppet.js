const { initRender, updateFrame, draw } = require('./utils/renderer');
const { createAxes } = require('./meshes/axes');
const { createFloor } = require('./meshes/triangles');
const { createRopeMesh, getRopeLinesMesh } = require('./meshes/ropes');
const { solve } = require('./solvers/inflatableAirPuppetSolver');
const { getColor } = require('./utils/color');
const { degToRad } = require('./solvers/utils');

const TIMESTEP = 1 / 60;
const ITERATIONS = 30;
const DAMPING_COEFFICIENT = 0.99;
const GRAVITY = [0, -10, 0];

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
const floor = createFloor();
const ropeMesh = createRopeMesh({
  subdivisions: 100,
  length: 10,
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
  solve({
    mesh: ropeMesh,
    damping: DAMPING_COEFFICIENT,
    timestep: TIMESTEP,
    iterationCount: ITERATIONS,
    props: {
      gravity: GRAVITY,
      floor,
    },
  });
};

// Render
const drawer = () => {
  axes.forEach((axis) => draw(axis));
  draw(floor);
  draw(ropeMesh);
  draw(getRopeLinesMesh(ropeMesh));
};

// Run program
updateFrame(solver, drawer);
