const regl = require('regl')();

const degToRad = (deg) => Math.PI / 180 * deg;


let Regl = null;
let camera = null;

const initRender = (props = {}) => {
  // Shaders
  const frag = `
    precision mediump float;
    uniform vec4 color;

    void main () {
      gl_FragColor = color; 
    }
  `;
  const vert = `
    precision mediump float;
    attribute vec3 position;
    uniform mat4 view; 
    uniform mat4 projection;
    uniform float size;
    uniform vec4 color;

    void main () {
      gl_PointSize = size;
      gl_Position = projection * view * vec4(position, 1);
    }
  `;

  Regl = regl({
    frag,
    vert,
    cull: {
      enable: true,
    },
    uniforms: {
      size: (c, p) => p.size || 10,
      color: regl.prop('color'),
    },
    attributes: {
      position: regl.prop('positions'),
    },
    count: regl.prop('count'),
    primitive: regl.prop('primitive'),
  });

  camera = require('regl-camera')(
    regl,
    props.camera || {
      distance: 10,
      theta: degToRad(60),
      phi: degToRad(15),
    },
  );  

  return Regl;
};

const updateFrame = (solver, draw) => {
  const update = () => {
    solver();
    camera(draw);
  };
  regl.frame(update);
};

const draw = (mesh) => {
  Regl({
    positions: mesh.vertices.map((vert) =>  vert.position),
    count: mesh.vertices.length,
    primitive: mesh.primitive,
    color: mesh.color,
  });
}

module.exports = {
  initRender,
  updateFrame,
  draw,
};
