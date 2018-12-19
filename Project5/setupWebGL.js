// gl object
var gl = null;
var shaderProgram;

var eyePosition = new vec3.fromValues(0, 0, 5);
var lookCenter = new vec3.fromValues(0, 0, 0);
var viewUp = new vec3.fromValues(-1, 0, 0);
const CUBELENGTH = 0.2;
const INNERLENGTH = 3;

var rootCubeCoordsBuffer;
var rootCubeIndicesBuffer;

// setup webgl
function setupWebGL() {
    var snakeCanvas = document.getElementById("snakeCanvas");
    gl = snakeCanvas.getContext("webgl");
    try{
        if(gl == null) {
            throw "unable to create gl context -- is your browser gl ready?";
        }
        else {
            gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
			gl.clearDepth(1.0); // use max when we clear the depth buffer
			gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
			gl.viewportWidth = snakeCanvas.width;
			gl.viewportHeight = snakeCanvas.height;
		}
    }

    catch(e) {
        console.log(e);
    }
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);    
    
    // if success, return, else output error and delete this shader
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) {
        return shader;
    }
    else {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(); 
    }
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    // if success, return, else output error and delete this program
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success) {
        return program;
    }
    else {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}

function setupShaderProgram() {

    // define vertex shader code in essl using es6 template strings
    var vertexShaderCode = `
		attribute vec4 a_vertexPosition;
		
		uniform mat4 u_pvmMatrix;

        void main() {
			gl_Position = u_pvmMatrix * a_vertexPosition;
        }     
    `;

    // define fragment shader code in essl using es6 template strings
    var fragmentShaderCode = `
		precision mediump float;

        void main() {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        } 
    `;

    var vShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
    var fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);
    shaderProgram = createProgram(gl, vShader, fShader);
	
	// activate shader program (frag and vert)
	gl.useProgram(shaderProgram); 

	shaderProgram.a_vertexPosition = gl.getAttribLocation(shaderProgram, "a_vertexPosition");
	
	
	shaderProgram.u_pvmMatrix = gl.getUniformLocation(shaderProgram, "u_pvmMatrix");


}

function setupCubeBuffer() {

	var cubeCoords = new Float32Array([
        0.1,  0.1,  0.1,     1.0, 1.0, 1.0,  // v0 White
		-0.1,  0.1,  0.1,    1.0, 1.0, 1.0,  // v1 Magenta
		-0.1, -0.1,  0.1,    1.0, 1.0, 1.0,  // v2 Red
		0.1, -0.1,  0.1,     1.0, 1.0, 1.0,  // v3 Yellow
		0.1, -0.1, -0.1,     1.0, 1.0, 1.0,  // v4 Green
		0.1,  0.1, -0.1,     1.0, 1.0, 1.0,  // v5 Cyan
		-0.1,  0.1, -0.1,    1.0, 1.0, 1.0,  // v6 Blue
		-0.1, -0.1, -0.1,    1.0, 1.0, 1.0,  // v7 Black
    ]);

    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    
        0, 3, 4,   0, 4, 5,    
        0, 5, 6,   0, 6, 1,    
        1, 6, 7,   1, 7, 2,    
        7, 4, 3,   7, 3, 2,    
        4, 7, 6,   4, 6, 5     
	]);

    // create buffer
	rootCubeCoordsBuffer = gl.createBuffer();
	rootCubeIndicesBuffer = gl.createBuffer();
 
	// send cube coords to WebGL
	gl.bindBuffer(gl.ARRAY_BUFFER, rootCubeCoordsBuffer); // activate that buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeCoords), gl.STATIC_DRAW); // coords to that buffer

    // send coords indices to WebGL
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rootCubeIndicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	
}

function drawOneCube(tMatrix) {

	// define perspective matrix
	var pMatrix = mat4.create();
	mat4.perspective(pMatrix, Math.PI/2, gl.viewportWidth/gl.viewportHeight, 1, 100.0);
	
	// define viewing matrix
	var vMatrix = mat4.create();
	mat4.lookAt(vMatrix, eyePosition, lookCenter, viewUp);

	// define model matrix
    var mMatrix = mat4.create();
    mat4.multiply(mMatrix, mMatrix, tMatrix);

	// caculate pvmMatrix
	var pvmMatrix = mat4.create();
	mat4.multiply(pvmMatrix, pMatrix, vMatrix);
	mat4.multiply(pvmMatrix, pvmMatrix, mMatrix);

	gl.uniformMatrix4fv(shaderProgram.u_pvmMatrix, false, pvmMatrix);

	

	// vertex buffer: activate and feed into vertex shader
	// 4 == fsize = cubeCoords.BYTES_PER_ELEMENT
	gl.bindBuffer(gl.ARRAY_BUFFER, rootCubeCoordsBuffer); // activate
	gl.vertexAttribPointer(shaderProgram.a_vertexPosition, 3, gl.FLOAT, false, 6 * 4, 0); // feed
	gl.enableVertexAttribArray(shaderProgram.a_vertexPosition); // input to shader from array


	// index buffer: activate and feed into vertex shader
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rootCubeIndicesBuffer); // activate
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0); // render
}

function main() {
	setupWebGL();
	setupShaderProgram();
    setupCubeBuffer();
    initDomEle();
    initGame();
    document.onkeypress = keyPressControl;
}