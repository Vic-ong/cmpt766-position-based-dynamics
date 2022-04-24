const { initRender, updateFrame, draw } = require('./utils/renderer');
const { createAxes } = require('./meshes/axes');
const { createEncantoRoofMesh, getRopeLinesMesh } = require('./meshes/ropes');
const { solve } = require('./solvers/encantoSolver');
const { degToRad } = require('./solvers/utils');

const TIMESTEP = 1 / 30;
const ITERATIONS = 30;
const DAMPING_COEFFICIENT = 0.99;
const GAP_LENGTH = 10;

const main = () => {
  // Initializations
  initRender({
    camera: {
      center: [5, 0, 0],
      distance: 10,
      theta: degToRad(80),
      phi: degToRad(10),
    }
  });

  // Get meshes
  const axes = createAxes();
  const roofMesh = createEncantoRoofMesh({
    subdivisions: 120,
    length: 10,
    mass: 1,
    offset: [0, 0, 0],
    timestep: TIMESTEP,
    gapLength: GAP_LENGTH,
    force: [0, 10, 0],
    reverse: true,
  });

  console.log(roofMesh);

  // Get solver
  const solver = () => {
    solve({
      mesh: roofMesh,
      damping: DAMPING_COEFFICIENT,
      timestep: TIMESTEP,
      iterationCount: ITERATIONS,
    });
  };

  // Render
  const drawer = () => {
    axes.forEach((axis) => draw(axis));
    draw(roofMesh);
    draw(getRopeLinesMesh(roofMesh));
  };

  // Run program
  updateFrame(solver, drawer);
};

main();
