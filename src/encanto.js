const { initRender, updateFrame, draw } = require('./utils/renderer');
const { createAxes } = require('./meshes/axes');
const { createEncantoRoofMesh, getRopeLinesMesh } = require('./meshes/ropes');
const { solve } = require('./solvers/encantoSolver');
const { degToRad } = require('./solvers/utils');
const { getColor } = require('./utils/color');

const TIMESTEP = 1 / 30;
const ITERATIONS = 30;
const DAMPING_COEFFICIENT = 0.99;

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
  gapLength: 15,
  force: [0, 5, 0],
  reverse: false,
});
const roofLeftCenterMesh = createEncantoRoofMesh({
  subdivisions: 150,
  length: 10,
  mass: 1,
  offset: [0, 4, 3],
  color: getColor(181, 67, 38),
  timestep: TIMESTEP,
  gapLength: 20,
  force: [0, 7, 0],
  reverse: true,
  time: {
    delay: 1.5,
    postDelay: 1.5,
  },
});
const roofFrontCenterMesh = createEncantoRoofMesh({
  subdivisions: 150,
  length: 10,
  mass: 1,
  offset: [10, 4, 6],
  color: getColor(149, 12, 58),
  timestep: TIMESTEP,
  gapLength: 20,
  force: [0, 7, 0],
  reverse: true,
  time: {
    delay: 0.75,
    postDelay: 1.5,
  },
});
const roofRightCenterMesh = createEncantoRoofMesh({
  subdivisions: 150,
  length: 10,
  mass: 1,
  offset: [20, 4, 3],
  color: getColor(198, 90, 147),
  timestep: TIMESTEP,
  gapLength: 20,
  force: [0, 7, 0],
  reverse: true,
  time: {
    delay: 0,
    postDelay: 1.5,
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
