const { initRender, updateFrame, draw } = require('./utils/renderer');
const { createAxes } = require('./meshes/axes');
const { createEncantoRoofMesh, getRopeLinesMesh } = require('./meshes/ropes');
const { solve } = require('./solvers/encantoSolver');
const { degToRad } = require('./solvers/utils');
const { getColor } = require('./utils/color');

const TIMESTEP = 1 / 30;
const ITERATIONS = 30;
const DAMPING_COEFFICIENT = 0.99;
const BASE_GAP = 15;
const BASE_DELAY = 0.8;

const WIDTH = 1;
const HEIGHT = 1;

const GAP_LENGTH = Math.floor(BASE_GAP * WIDTH);
const FORCE_MULTIPLIER = HEIGHT * WIDTH;

const main = () => {
  // Initializations
  initRender({
    camera: {
      center: [14, 5, 0],
      distance: 30,
      theta: degToRad(92),
      phi: degToRad(5),
    }
  });

  // Get meshes
  const axes = createAxes();
  const roofTopMesh = createEncantoRoofMesh({
    subdivisions: 200,
    length: 30,
    mass: 1,
    offset: [0, 10, 0],
    color: getColor(234, 111, 81),
    timestep: TIMESTEP,
    gapLength: GAP_LENGTH,
    force: [0, 20 * FORCE_MULTIPLIER, 0],
    reverse: false,
  });
  const roofLeftCenterMesh = createEncantoRoofMesh({
    subdivisions: 100,
    length: 10,
    mass: 1,
    offset: [0, 4, 3],
    color: getColor(181, 67, 38),
    timestep: TIMESTEP,
    gapLength: GAP_LENGTH,
    force: [0, 20 * FORCE_MULTIPLIER, 0],
    reverse: true,
    time: {
      delay: BASE_DELAY,
      postDelay: BASE_DELAY,
    },
  });
  const roofFrontCenterMesh = createEncantoRoofMesh({
    subdivisions: 100,
    length: 10,
    mass: 1,
    offset: [10, 4, 6],
    color: getColor(149, 12, 58),
    timestep: TIMESTEP,
    gapLength: GAP_LENGTH,
    force: [0, 20 * FORCE_MULTIPLIER, 0],
    reverse: true,
    time: {
      delay: BASE_DELAY / 2,
      postDelay: BASE_DELAY,
    },
  });
  const roofRightCenterMesh = createEncantoRoofMesh({
    subdivisions: 100,
    length: 10,
    mass: 1,
    offset: [20, 4, 3],
    color: getColor(198, 90, 147),
    timestep: TIMESTEP,
    gapLength: GAP_LENGTH,
    force: [0, 20 * FORCE_MULTIPLIER, 0],
    reverse: true,
    time: {
      delay: 0,
      postDelay: BASE_DELAY,
    },
  });

  // Get solver
  const solver = () => {
    solve({
      mesh: roofTopMesh,
      damping: DAMPING_COEFFICIENT,
      timestep: TIMESTEP,
      iterationCount: ITERATIONS,
    });
    solve({
      mesh: roofRightCenterMesh,
      damping: DAMPING_COEFFICIENT,
      timestep: TIMESTEP,
      iterationCount: ITERATIONS,
    });
    solve({
      mesh: roofFrontCenterMesh,
      damping: DAMPING_COEFFICIENT,
      timestep: TIMESTEP,
      iterationCount: ITERATIONS,
    });
    solve({
      mesh: roofLeftCenterMesh,
      damping: DAMPING_COEFFICIENT,
      timestep: TIMESTEP,
      iterationCount: ITERATIONS,
    });
  };

  // Render
  const drawer = () => {
    axes.forEach((axis) => draw(axis));
    draw(roofTopMesh);
    draw(getRopeLinesMesh(roofTopMesh));
    draw(roofLeftCenterMesh);
    draw(getRopeLinesMesh(roofLeftCenterMesh));
    draw(roofRightCenterMesh);
    draw(getRopeLinesMesh(roofRightCenterMesh));
    draw(roofFrontCenterMesh);
    draw(getRopeLinesMesh(roofFrontCenterMesh));
  };

  // Run program
  updateFrame(solver, drawer);
};

main();
