'use strict';

const shaderUtils = {
  checkShaderCompileStatus: (gl, shader) => {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }
  },
  checkProgramLinkStatus: (gl, shaderProgram) => {
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(shaderProgram));
    }
  },
};
