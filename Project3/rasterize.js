/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const WIN_Z = 0;  // default graphics window z coord in world space
const WIN_LEFT = 0; 
const WIN_RIGHT = 1;  // default left and right x coords in world space
const WIN_BOTTOM = 0; 
const WIN_TOP = 1;  // default top and bottom y coords in world space
const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog3/triangles.json"; // triangles file loc
const INPUT_ELLIPSOIDS_URL = "https://ncsucgclass.github.io/prog3/ellipsoids.json"; // spheres file loc
const INPUT_LIGHTS_URL = "https://ncsucgclass.github.io/prog3/lights.json"; // lights file loc
var inputTriangles;
var inputEllipsoids;
var inputLights = getJSONFile(INPUT_LIGHTS_URL, "lights");;

var eyePosition = new vec3.fromValues(0.5, 0.5, -0.5); // default eye position in world space
var lookCenter = new vec3.fromValues(0.5, 0.5, 0);
var viewUp = new vec3.fromValues(0, 1, 0);
// Phong(true) or Blinn-Phong(false)
var isPhong = false;



/* webgl globals */
var gl = null; // the all powerful gl object. It's all here folks!
var shaderProgram; // the shader program
var triVertexBuffer = []; // this contains vertex coordinates in triples
var triangleBuffer = []; // this contains indices into triVertexBuffer in triples
var triNormalBuffer = [];  //this contains normals of vertices

var ellipVertexBuffer = [];
var ellipsoidBuffer = [];
var ellipNormalBuffer = [];

var selectedTriSet = -1;
var selectedEllip = -1;
var selectedScaling = new vec3.fromValues(1.2,1.2,1.2);
var selectedIndex = [];
var setCenter = [];
var ellipCenter = [];


// ASSIGNMENT HELPER FUNCTIONS

// get the JSON file from the passed URL
function getJSONFile(url,descr) {
    try {
        if ((typeof(url) !== "string") || (typeof(descr) !== "string"))
            throw "getJSONFile: parameter not a string";
        else {
            var httpReq = new XMLHttpRequest(); // a new http request
            httpReq.open("GET",url,false); // init the request
            httpReq.send(null); // send the request
            var startTime = Date.now();
            while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
                if ((Date.now()-startTime) > 3000)
                    break;
            } // until its loaded or we time out after three seconds
            if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
                throw "Unable to open "+descr+" file!";
            else
                return JSON.parse(httpReq.response); 
        } // end if good params
    } // end try    
    
    catch(e) {
        console.log(e);
        return(String.null);
    }
} // end get input spheres

// set up the webGL environment
function setupWebGL() {

    // Get the canvas and context
    var canvas = document.getElementById("myWebGLCanvas"); // create a js canvas
    gl = canvas.getContext("webgl"); // get a webgl object from it

    try {
      if (gl == null) {
        throw "unable to create gl context -- is your browser gl ready?";
      } else {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
        gl.clearDepth(1.0); // use max when we clear the depth buffer
        gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
      }
    } // end try
    
    catch(e) {
      console.log(e);
    } // end catch
 
} // end setupWebGL

// read triangles in, load them into webgl buffers
function loadTriangles() {

    inputTriangles = getJSONFile(INPUT_TRIANGLES_URL, "triangles");
    
    if (inputTriangles != String.null) {      
                
        for (var whichSet=0; whichSet<inputTriangles.length; whichSet++) {

            var whichSetVert; // index of vertex in current triangle set
            var whichSetTri; // index of triangle in current triangle set
            var coordArray = []; // 1D array of vertex coords for WebGL
            var indexArray = [];  // 1D array of triangle indices for webGL
            var normalArray = []; // 1D array of vertex normals
            var vtxToAdd = [];    
            var triToAdd = vec3.create();
            var norToAdd = vec3.create();
            var triCenter = vec3.create();

            // set up the vertex coord array
            for (whichSetVert=0; whichSetVert<inputTriangles[whichSet].vertices.length; whichSetVert++){
                vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert];
                coordArray.push(vtxToAdd[0], vtxToAdd[1], vtxToAdd[2]);
                norToAdd = inputTriangles[whichSet].normals[whichSetVert];
                normalArray.push(norToAdd[0], norToAdd[1], norToAdd[2]);
                // console.log(inputTriangles[whichSet].vertices[whichSetVert]);
            }

            // set up the triangles index array
            for (whichSetTri=0; whichSetTri<inputTriangles[whichSet].triangles.length; whichSetTri++) {
                triToAdd = inputTriangles[whichSet].triangles[whichSetTri];
                indexArray.push(triToAdd[0], triToAdd[1], triToAdd[2]);
                 //console.log(inputTriangles[whichSet].triangles[whichSetTri]);
                vec3.scaleAndAdd(triCenter, triCenter, inputTriangles[whichSet].vertices[triToAdd[0]], 1/3);
                vec3.scaleAndAdd(triCenter, triCenter, inputTriangles[whichSet].vertices[triToAdd[1]], 1/3);
                vec3.scaleAndAdd(triCenter, triCenter, inputTriangles[whichSet].vertices[triToAdd[2]], 1/3);
            }
            
            setCenter[whichSet] = vec3.create();
            vec3.scale(setCenter[whichSet], triCenter, 1/inputTriangles[whichSet].triangles.length);


            // send the vertex coords to webGL
            triVertexBuffer[whichSet] = gl.createBuffer(); // init empty vertex coord buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, triVertexBuffer[whichSet]); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(coordArray),gl.STATIC_DRAW); // coords to that buffer

            // send the triangles indices to webGL
            triangleBuffer[whichSet] = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer[whichSet]);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
            triangleBuffer[whichSet].bufferSize = inputTriangles[whichSet].triangles.length * 3;

             //send the vertex's normals to webGL
            triNormalBuffer[whichSet] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, triNormalBuffer[whichSet]); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW); // normals to that buffer
        

            // initialize transform matrix for each set
            inputTriangles[whichSet].tMatrix = mat4.create();
        } // end for each triangle set         

    } // end if triangles found
} // end load triangles

// read ellipsoids in, load them into webGL buffer
function loadEllipsoids() {
    
    inputEllipsoids = getJSONFile(INPUT_ELLIPSOIDS_URL, "ellipsoids");
    
    if (inputEllipsoids != null) {
        for(var whichEllip = 0; whichEllip < inputEllipsoids.length; whichEllip++) {

            var vertexPositionData = [];
            var normalData = [];
            var indexData = [];

            var latitudeBands = 30;
            var longitudeBands = 30;

            var a = inputEllipsoids[whichEllip].a;
            var b = inputEllipsoids[whichEllip].b;
            var c = inputEllipsoids[whichEllip].c;
            ellipCenter[whichEllip] =  [inputEllipsoids[whichEllip].x, 
                                        inputEllipsoids[whichEllip].y, 
                                        inputEllipsoids[whichEllip].z, ];

            for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
              var theta = latNumber * Math.PI / latitudeBands;
              var sinTheta = Math.sin(theta);
              var cosTheta = Math.cos(theta);

              for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;

                var ex = x * a + ellipCenter[whichEllip][0];
                var ey = y * b + ellipCenter[whichEllip][1];
                var ez = z * c + ellipCenter[whichEllip][2];

                vertexPositionData.push(ex);
                vertexPositionData.push(ey);
                vertexPositionData.push(ez);
                normalData.push(x/a);
                normalData.push(y/b);
                normalData.push(z/c);

              }
            }

            for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
              for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;
                indexData.push(first);
                indexData.push(second);
                indexData.push(first + 1);

                indexData.push(second);
                indexData.push(second + 1);
                indexData.push(first + 1);
              }
            }

            // send the vertex coords to webGL
            ellipVertexBuffer[whichEllip] = gl.createBuffer(); // init empty vertex coord buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, ellipVertexBuffer[whichEllip]); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexPositionData),gl.STATIC_DRAW); // coords to that buffer

            // send the triangles indices divided by ellipsoids to webGL
            ellipsoidBuffer[whichEllip] = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ellipsoidBuffer[whichEllip]);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
            ellipsoidBuffer[whichEllip].bufferSize = indexData.length; 

             //send the vertex's normals to webGL
            ellipNormalBuffer[whichEllip] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, ellipNormalBuffer[whichEllip]); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW); // normals to that buffer
        
            // initialize transform matrix for each set
            inputEllipsoids[whichEllip].tMatrix = mat4.create();
        }
    }
}


// setup the webGL shaders
function setupShaders() {
    
    // define fragment shader in essl using es6 template strings
    var fShaderCode = `
        // set precision
        precision mediump float;

        // Phong(true) or Blinn-Phong(false)
        uniform bool u_isPhong;

        // lights and eye
        uniform vec3 u_lightPosition;
        uniform vec3 u_lightAmbient;
        uniform vec3 u_lightDiffuse;
        uniform vec3 u_lightSpecular;
        uniform vec3 u_eyePosition;

        // material
        uniform vec3 u_materialAmbient;
        uniform vec3 u_materialDiffuse;
        uniform vec3 u_materialSpecular;
        uniform float u_materialShininess;

        // vertices and normals from vShader
        varying vec3 v_mVertexPosition;
        varying vec3 v_mVertexNormal;

        void main(void) {
            vec3 lightDirection = normalize(u_lightPosition - v_mVertexPosition);
            vec3 viewDirection = normalize(u_eyePosition - v_mVertexPosition);
            vec3 unitNormal = normalize(v_mVertexNormal);

            float diffuseFactor = max(0.0, dot(unitNormal, lightDirection));
            float specularFactor;
            
            if(u_isPhong) {
                vec3 R = reflect(-lightDirection, unitNormal);
                specularFactor = pow(max(0.0, dot(R, viewDirection)), u_materialShininess);
            }
            else {
                vec3 H = normalize(lightDirection + viewDirection);
                specularFactor = pow(max(0.0, dot(H, unitNormal)), u_materialShininess);
            }

            vec3 rgbColor = u_lightAmbient * u_materialAmbient
                            + u_lightDiffuse * u_materialDiffuse * diffuseFactor
                            + u_lightSpecular * u_materialSpecular * specularFactor;
                            
            gl_FragColor = vec4(rgbColor, 1.0); // all fragments are white
        }
    `;
    
    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
        attribute vec3 a_vertexPosition;
        attribute vec3 a_vertexNormal;

        uniform mat4 u_mMatrix;
        uniform mat4 u_pMatrix;
        uniform mat4 u_vMatrix;
        uniform mat3 u_nMatrix;

        varying vec3 v_mVertexPosition;
        varying vec3 v_mVertexNormal;

        void main(void) {
            gl_Position = u_pMatrix * u_vMatrix * u_mMatrix *  vec4(a_vertexPosition, 1.0); // use the untransformed position
            v_mVertexPosition = vec3(u_mMatrix * vec4(a_vertexPosition, 1.0));
            v_mVertexNormal = u_nMatrix * a_vertexNormal;
        }
    `;
    
    try {
        // console.log("fragment shader: "+fShaderCode);
        var fShader = gl.createShader(gl.FRAGMENT_SHADER); // create frag shader
        gl.shaderSource(fShader,fShaderCode); // attach code to shader
        gl.compileShader(fShader); // compile the code for gpu execution

        // console.log("vertex shader: "+vShaderCode);
        var vShader = gl.createShader(gl.VERTEX_SHADER); // create vertex shader
        gl.shaderSource(vShader,vShaderCode); // attach code to shader
        gl.compileShader(vShader); // compile the code for gpu execution
            
        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { // bad frag shader compile
            throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);  
            gl.deleteShader(fShader);
        } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { // bad vertex shader compile
            throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);  
            gl.deleteShader(vShader);
        } else { // no compile errors
            shaderProgram = gl.createProgram(); // create the single shader program
            gl.attachShader(shaderProgram, fShader); // put frag shader in program
            gl.attachShader(shaderProgram, vShader); // put vertex shader in program
            gl.linkProgram(shaderProgram); // link program into gl context

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { // no shader program link errors
                gl.useProgram(shaderProgram); // activate shader program (frag and vert)
                // get pointer to vertex shader input
                shaderProgram.a_vertexPosition = gl.getAttribLocation(shaderProgram, "a_vertexPosition");
                shaderProgram.a_vertexNormal = gl.getAttribLocation(shaderProgram, "a_vertexNormal");
                
                shaderProgram.u_mMatrix = gl.getUniformLocation(shaderProgram, "u_mMatrix");
                shaderProgram.u_vMatrix = gl.getUniformLocation(shaderProgram, "u_vMatrix");
                shaderProgram.u_pMatrix = gl.getUniformLocation(shaderProgram, "u_pMatrix");
                shaderProgram.u_nMatrix = gl.getUniformLocation(shaderProgram, "u_nMatrix");

                //get pointer to fragment shader input
                shaderProgram.u_isPhong = gl.getUniformLocation(shaderProgram, "u_isPhong");

                shaderProgram.u_lightPosition = gl.getUniformLocation(shaderProgram, "u_lightPosition");
                shaderProgram.u_lightAmbient = gl.getUniformLocation(shaderProgram, "u_lightAmbient");
                shaderProgram.u_lightDiffuse = gl.getUniformLocation(shaderProgram, "u_lightDiffuse");
                shaderProgram.u_lightSpecular = gl.getUniformLocation(shaderProgram, "u_lightSpecular");
                shaderProgram.u_eyePosition = gl.getUniformLocation(shaderProgram, "u_eyePosition");

                shaderProgram.u_materialAmbient = gl.getUniformLocation(shaderProgram, "u_materialAmbient");
                shaderProgram.u_materialDiffuse = gl.getUniformLocation(shaderProgram, "u_materialDiffuse");
                shaderProgram.u_materialSpecular = gl.getUniformLocation(shaderProgram, "u_materialSpecular");
                shaderProgram.u_materialShininess = gl.getUniformLocation(shaderProgram, "u_materialShininess");
            
            } // end if no shader program link errors
        } // end if no compile errors
    } // end try 
    
    catch(e) {
        console.log(e);
    } // end catch
} // end setup shaders

// render the loaded model
function renderTriangles() {
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear frame/depth buffers

    // setup lights, eyePosition and lighting model
    setupLights();

    // define viewing matrix
    var vMatrix = mat4.create();
    mat4.lookAt(vMatrix, eyePosition, lookCenter, viewUp);
    gl.uniformMatrix4fv(shaderProgram.u_vMatrix, false, vMatrix);

    // define perspective matrix
    var pMatrix = mat4.create();
    mat4.perspective(pMatrix, Math.PI/2, gl.viewportWidth/gl.viewportHeight, 0.5, 100.0);
    gl.uniformMatrix4fv(shaderProgram.u_pMatrix, false, pMatrix);

    for(var whichSet = 0; whichSet < inputTriangles.length; whichSet++) {

        // define material
        var material = inputTriangles[whichSet].material;
        gl.uniform3fv(shaderProgram.u_materialAmbient, material.ambient);
        gl.uniform3fv(shaderProgram.u_materialDiffuse, material.diffuse);
        gl.uniform3fv(shaderProgram.u_materialSpecular, material.specular);
        gl.uniform1f(shaderProgram.u_materialShininess, material.n);


        /*  define model matrix   */
        var mMatrix = mat4.create();
        // move set to origin
        mat4.translate(mMatrix, mMatrix, setCenter[whichSet]);
       
        if(selectedTriSet == whichSet) {
            mat4.scale(mMatrix, mMatrix, selectedScaling);
        } 
        
        mat4.multiply(mMatrix, mMatrix, inputTriangles[whichSet].tMatrix);

        // move set back to its own center
        mat4.translate(mMatrix, mMatrix, vec3.negate(vec3.create(), setCenter[whichSet]));

        gl.uniformMatrix4fv(shaderProgram.u_mMatrix, false, mMatrix);
        /*  define model matrix end*/

        // define normal transform matrix
        var nMatrix = mat3.create();
        mat3.normalFromMat4(nMatrix, mMatrix);
        gl.uniformMatrix3fv(shaderProgram.u_nMatrix, false, nMatrix);
        
        // vertex buffer: activate and feed into vertex shader
        gl.bindBuffer(gl.ARRAY_BUFFER, triVertexBuffer[whichSet]); // activate
        gl.vertexAttribPointer(shaderProgram.a_vertexPosition, 3, gl.FLOAT, false, 0, 0); // feed
        gl.enableVertexAttribArray(shaderProgram.a_vertexPosition); // input to shader from array

        // normal buffer: activate and feed into vertex shader
        gl.bindBuffer(gl.ARRAY_BUFFER, triNormalBuffer[whichSet]); // activate
        gl.vertexAttribPointer(shaderProgram.a_vertexNormal, 3, gl.FLOAT, false, 0, 0); // feed
        gl.enableVertexAttribArray(shaderProgram.a_vertexNormal); 

        // index buffer: activate and feed into vertex shader
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,triangleBuffer[whichSet]); // activate
        gl.drawElements(gl.TRIANGLES, triangleBuffer[whichSet].bufferSize, gl.UNSIGNED_SHORT, 0); // render

    }
} // end render triangles

// render the loaded model
function renderEllipsoids() {

    // setup lights, eyePosition and lighting model
    setupLights();

    // define viewing matrix
    var vMatrix = mat4.create();
    mat4.lookAt(vMatrix, eyePosition, lookCenter, viewUp);
    gl.uniformMatrix4fv(shaderProgram.u_vMatrix, false, vMatrix);

    // define perspective matrix
    var pMatrix = mat4.create();
    mat4.perspective(pMatrix, Math.PI/2, gl.viewportWidth/gl.viewportHeight, 0.5, 100.0);
    gl.uniformMatrix4fv(shaderProgram.u_pMatrix, false, pMatrix);

    for(var whichEllip = 0; whichEllip < inputEllipsoids.length; whichEllip++) {

        // define material
        var currentEllipsoid = inputEllipsoids[whichEllip];
        gl.uniform3fv(shaderProgram.u_materialAmbient, currentEllipsoid.ambient);
        gl.uniform3fv(shaderProgram.u_materialDiffuse, currentEllipsoid.diffuse);
        gl.uniform3fv(shaderProgram.u_materialSpecular, currentEllipsoid.specular);
        gl.uniform1f(shaderProgram.u_materialShininess, currentEllipsoid.n);


        /*  define model matrix   */
        var mMatrix = mat4.create();
        // move set to origin
        mat4.translate(mMatrix, mMatrix, ellipCenter[whichEllip]);
       
        if(selectedEllip == whichEllip) {
            mat4.scale(mMatrix, mMatrix, selectedScaling);
        } 
        
        mat4.multiply(mMatrix, mMatrix, inputEllipsoids[whichEllip].tMatrix);

        // move set back to its own center
        mat4.translate(mMatrix, mMatrix, vec3.negate(vec3.create(), ellipCenter[whichEllip]));

        gl.uniformMatrix4fv(shaderProgram.u_mMatrix, false, mMatrix);
        /*  define model matrix end*/

        // define normal transform matrix
        var nMatrix = mat3.create();
        mat3.normalFromMat4(nMatrix, mMatrix);
        gl.uniformMatrix3fv(shaderProgram.u_nMatrix, false, nMatrix);
        
        // vertex buffer: activate and feed into vertex shader
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipVertexBuffer[whichEllip]); // activate
        gl.vertexAttribPointer(shaderProgram.a_vertexPosition, 3, gl.FLOAT, false, 0, 0); // feed
        gl.enableVertexAttribArray(shaderProgram.a_vertexPosition); // input to shader from array

        // normal buffer: activate and feed into vertex shader
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipNormalBuffer[whichEllip]); // activate
        gl.vertexAttribPointer(shaderProgram.a_vertexNormal, 3, gl.FLOAT, false, 0, 0); // feed
        gl.enableVertexAttribArray(shaderProgram.a_vertexNormal); 

        // index buffer: activate and feed into vertex shader
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ellipsoidBuffer[whichEllip]); // activate
        gl.drawElements(gl.TRIANGLES, ellipsoidBuffer[whichEllip].bufferSize, gl.UNSIGNED_SHORT, 0); // render

    }
} // end render ellipsoids

// define lighting model
function setupLights() {

    // Phong(true) or Blinn-Phong(false)
    gl.uniform1i(shaderProgram.u_isPhong, isPhong);
    
    // only one light source
    var light0 = inputLights[0];

    gl.uniform3f(shaderProgram.u_lightPosition, light0.x, light0.y, light0.z);
    gl.uniform3fv(shaderProgram.u_lightAmbient, light0.ambient);
    gl.uniform3fv(shaderProgram.u_lightDiffuse, light0.diffuse);
    gl.uniform3fv(shaderProgram.u_lightSpecular, light0.specular);
    gl.uniform3fv(shaderProgram.u_eyePosition, eyePosition);
}

function renderStuff() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear frame/depth buffers
    renderTriangles();
    renderEllipsoids();
}

/* MAIN -- HERE is where execution begins after window load */

function main() {
  
  setupWebGL(); // set up the webGL environment
  setupShaders(); // setup the webGL shaders
  loadTriangles(); // load in the triangles from tri file
  loadEllipsoids();
  getSelectedIndex();
  document.onkeydown = keyDownControl;
  document.onkeypress = keyPressControl;
  renderStuff();
  
} // end main