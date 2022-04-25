const { initRender, updateFrame, draw } = require('./utils/renderer');
const { createAxes } = require('./meshes/axes');
const { createRopeMesh, getRopeLinesMesh } = require('./meshes/ropes');
const { solve } = require('./solvers/ropeAndWindSolver');
const { getColor } = require('./utils/color');
const { degToRad } = require('./solvers/utils');

const TIMESTEP = 1 / 60;
const ITERATIONS = 30;
const DAMPING_COEFFICIENT = 0.99;
const GRAVITY = [0, -10, 0];
const GRAVITYx10 = [0, -100, 0];
const GRAVITYx100 = [0, -1000, 0];

const main = () => {
  // Initializations
  initRender({
    camera: {
      center: [3, -3, 0],
      distance: 25,
      theta: degToRad(80),
      phi: degToRad(10),
    }
  });

  // Get meshes
  const axes = createAxes();
  const ropeMesh = createRopeMesh({
    subdivisions: 50,
    length: 10,
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
  const ropeMesh2 = createRopeMesh({
    subdivisions: 50,
    length: 10,
    mass: 1,
    offset: [0, 0, 2],
    color: getColor(46, 132, 212),
  });
  ropeMesh2.attrs.constraints.positions = [
    {
      i: 0,
      position: ropeMesh2.vertices[0].position,
    },
    {
      i: ropeMesh.attrs.subdivisions,
      position: ropeMesh2.vertices[ropeMesh2.attrs.subdivisions].position,
    },
  ];
  const ropeMesh3 = createRopeMesh({
    subdivisions: 50,
    length: 10,
    mass: 1,
    offset: [0, 0, 4],
    color: getColor(234, 148, 81),
  });
  ropeMesh3.attrs.constraints.positions = [
    {
      i: 0,
      position: ropeMesh3.vertices[0].position,
    },
    {
      i: ropeMesh.attrs.subdivisions,
      position: ropeMesh3.vertices[ropeMesh3.attrs.subdivisions].position,
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
      },
    });
    solve({
      mesh: ropeMesh2,
      damping: DAMPING_COEFFICIENT,
      timestep: TIMESTEP,
      iterationCount: ITERATIONS,
      props: {
        gravity: GRAVITYx10,
      },
    });
    solve({
      mesh: ropeMesh3,
      damping: DAMPING_COEFFICIENT,
      timestep: TIMESTEP,
      iterationCount: ITERATIONS,
      props: {
        gravity: GRAVITYx100,
      },
    });
  };

  // Render
  const drawer = () => {
    axes.forEach((axis) => draw(axis));
    draw(ropeMesh);
    draw(getRopeLinesMesh(ropeMesh));
    draw(ropeMesh2);
    draw(getRopeLinesMesh(ropeMesh2));
    draw(ropeMesh3);
    draw(getRopeLinesMesh(ropeMesh3));
  };

  // Run program
  updateFrame(solver, drawer);  
};

main();
