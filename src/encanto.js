const { initRender, updateFrame, draw } = require('./renderer');
const { createAxes } = require('./meshes/axes');
const { createRopeMesh, getRopeLinesMesh } = require('./meshes/ropes');
const { solve } = require('./solvers/encantoSolver');
const { getColor } = require('./color');
const { degToRad } = require('./solvers/utils');

const TIMESTEP = 1 / 60;
const ITERATIONS = 30;
const DAMPING_COEFFICIENT = 0.99;
const GRAVITY = [0, -10, 0];

// Initializations
initRender({
  camera: {
    center: [10, 0, 0],
    distance: 30,
    theta: degToRad(80),
    phi: degToRad(10),
  }
});

// Get meshes
const axes = createAxes();
const ropeMesh = createRopeMesh({
  subdivisions: 200,
  length: 25,
  mass: 1,
  offset: [0, 0, 0],
});
ropeMesh.attrs.constraints.positions = [
  {
    i: 0,
    position: ropeMesh.vertices[0].position,
  },
  {
    i: ropeMesh.attrs.subdivisions,
    position: ropeMesh.vertices[ropeMesh.attrs.subdivisions].position,
  },
];

// Get solver
const solver = () => {
  solve({
    mesh: ropeMesh,
    damping: DAMPING_COEFFICIENT,
    timestep: TIMESTEP,
    iterationCount: ITERATIONS,
    gravity: GRAVITY,
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
