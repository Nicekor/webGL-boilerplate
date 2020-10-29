'use strict';

const canvas = document.querySelector('canvas');
const gl =
  canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl) {
  throw new Error('WebGL not supported');
}

const setupTriangleVertexBuffer = () => {
  const triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);

  // prettier-ignore
  const triangleVertices = [
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
  ];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    gl.STATIC_DRAW
  );

  return {
    buffer: triangleVertexBuffer,
    itemSize: 3,
    numberOfItems: 3,
  };
};

const setupTriangleVertexColourBuffer = () => {
  const triangleVertexColoursBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColoursBuffer);

  // prettier-ignore
  const triangleVerticesColours = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVerticesColours),
    gl.STATIC_DRAW
  );

  return {
    buffer: triangleVertexColoursBuffer,
    itemSize: 4,
    numberOfItems: 3,
  };
};

const setupBuffers = () => {
  const triangleVertexBuffer = setupTriangleVertexBuffer();
  const triangleVertexColoursBuffer = setupTriangleVertexColourBuffer();

  return {
    positions: {
      triangleVertexBuffer,
    },
    colours: {
      triangleVertexColoursBuffer,
    },
  };
};

const getVertexShader = () => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(
    vertexShader,
    `
    attribute vec3 vertexPosition;
    attribute vec4 vertexColour;
    varying vec4 vColour;

    void main() {
      vColour = vertexColour;
      gl_Position = vec4(vertexPosition, 1.0); 
    }   
  `
  );
  gl.compileShader(vertexShader);
  shaderUtils.checkShaderCompileStatus(gl, vertexShader);
  return vertexShader;
};

const getFragmentShader = () => {
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(
    fragmentShader,
    `
    precision mediump float;
    varying vec4 vColour;

    void main() {
      gl_FragColor = vColour;   
    }
  `
  );
  gl.compileShader(fragmentShader);
  shaderUtils.checkShaderCompileStatus(gl, fragmentShader);
  return fragmentShader;
};

const setupShaders = () => {
  const vertexShader = getVertexShader();
  const fragmentShader = getFragmentShader();

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  shaderUtils.checkProgramLinkStatus(gl, shaderProgram);

  gl.useProgram(shaderProgram);

  return {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'vertexPosition'),
      vertexColour: gl.getAttribLocation(shaderProgram, 'vertexColour'),
    },
  };
};

const draw = () => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const buffers = setupBuffers();

  const programInfo = setupShaders();

  const triangleVertexBuffer = buffers.positions.triangleVertexBuffer;
  const positionLocation = programInfo.attribLocations.vertexPosition;
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer.buffer);
  gl.vertexAttribPointer(
    positionLocation,
    triangleVertexBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(positionLocation);

  const triangleVertexColoursBuffer =
    buffers.colours.triangleVertexColoursBuffer;
  const colourLocation = programInfo.attribLocations.vertexColour;
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColoursBuffer.buffer);
  gl.vertexAttribPointer(
    colourLocation,
    triangleVertexColoursBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(colourLocation);

  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexBuffer.numberOfItems);
};

draw();
