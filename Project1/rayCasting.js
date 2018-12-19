/*******************		
Project 1 			
Author: Hao Wu 	
Unity ID: hwu23 	
*******************/

// Color constructor
class Color {
    constructor(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number")) {
                throw "color component not a number";
            }
            else if ((r<0) || (g<0) || (b<0) || (a<0)) {
                throw "color component less than 0";
            }
            else if ((r>255) || (g>255) || (b>255) || (a>255)) {
                throw "color component bigger than 255";
            }
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number")) {
                throw "color component not a number";
            }
            else if ((r<0) || (g<0) || (b<0) || (a<0)) {
                throw "color component less than 0";
            }
            else if ((r>255) || (g>255) || (b>255) || (a>255)) {
                throw "color component bigger than 255";
            }
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number")) {
            throw "drawpixel location not a number";
        }
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height)) {
            throw "drawpixel location outside of image";
        }
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel

// Vector class
class Vector { 
    constructor(x=0,y=0,z=0) {
        this.set(x,y,z);
    } // end constructor
    
    // sets the components of a vector
    set(x,y,z) {
        try {
            if ((typeof(x) !== "number") || (typeof(y) !== "number") || (typeof(z) !== "number")) {
                throw "vector component not a number";
            }
            else {
                this.x = x; this.y = y; this.z = z; 
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end vector set
    
    // copy the passed vector into this one
    copy(v) {
        try {
            if (!(v instanceof Vector)) {
                throw "Vector.copy: non-vector parameter";
            }
            else {
                this.x = v.x; this.y = v.y; this.z = v.z;
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    }
    
    toConsole(prefix) {
        console.log(prefix+"["+this.x+","+this.y+","+this.z+"]");
    } // end to console
    
    // static dot method
    static dot(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector)) {
                throw "Vector.dot: non-vector parameter";
            }
            else {
                return(v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(NaN);
        }
    } // end dot static method
    
    // static add method
    static add(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector)) {
                throw "Vector.add: non-vector parameter";
            }
            else {
                return(new Vector(v1.x+v2.x,v1.y+v2.y,v1.z+v2.z));
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end add static method

    // static subtract method, v1-v2
    static subtract(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector)) {
                throw "Vector.subtract: non-vector parameter";
            }
            else {
                var v = new Vector(v1.x-v2.x,v1.y-v2.y,v1.z-v2.z);
                //v.toConsole("Vector.subtract: ");
                return(v);
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end subtract static method

    // static cross method
    static cross(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.cross: non-vector parameter";
            else {
                var crossX = v1.y*v2.z - v1.z*v2.y;
                var crossY = v1.z*v2.x - v1.x*v2.z;
                var crossZ = v1.x*v2.y - v1.y*v2.x;
                return(new Vector(crossX,crossY,crossZ));
            } // endif vector params
        } // end try
        
        catch(e) {
            console.log(e);
            return(NaN);
        }
    } // end dot static method

    // static scale method
    static scale(c,v) {
        try {
            if (!(typeof(c) === "number") || !(v instanceof Vector)) {
                throw "Vector.scale: malformed parameter";
            }
            else {
                return(new Vector(c*v.x,c*v.y,c*v.z));
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end scale static method
    
    // static normalize method
    static normalize(v) {
        try {
            if (!(v instanceof Vector)) {
                throw "Vector.normalize: parameter not a vector";
            }
            else {
                var lenDenom = 1/Math.sqrt(Vector.dot(v,v));
                return(Vector.scale(lenDenom,v));
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end scale static method
    
} // end Vector class

/* utility functions */

//get the input triangles from the standard class URL
function getInputTriangles() {
    const INPUT_TRIANGLES_URL = 
        //"https://ncsucgclass.github.io/prog1/triangles.json";
        "https://ncsucgclass.github.io/prog3/triangles.json";
    // load the triangles file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_TRIANGLES_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input triangles file!");
        return String.null;
    } 
    else {
        return JSON.parse(httpReq.response); 
    }
} // end get input triangles

//Raycasting triangles
function rayCastTriangles(context) {
    var inputTriangles = getInputTriangles();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    
    var ul = new Vector(0, 1, 0);
    var ur = new Vector(1, 1, 0);
    var ll = new Vector(0, 0, 0);
    var lr = new Vector(1, 0, 0);
    var eyePosition = new Vector(0.5, 0.5, -0.5);
    var c = new Color(0, 0, 0, 255);

    var i, j, t, s;
    
    for(i = 0; i < w; i++) {
        for(j = 0; j < h; j++) {
            t = i/w;
            s = j/h;
            var p = new Vector( calculateP(ul.x, ur.x, ll.x, lr.x, s, t), 
                                calculateP(ul.y, ur.y, ll.y, lr.y, s, t), 
                                calculateP(ul.z, ur.z, ll.z, lr.z, s, t));
            var ray = Vector.subtract(p, eyePosition);

            var min_tt = Number.MAX_VALUE;
            
            var recordF = -1;
            if (inputTriangles != String.null) { 
                var n = inputTriangles.length; // the number of input files
                //console.log("number of files: " + n);


                // Loop over the triangles, draw rand pixels in each
                for (var f=0; f<n; f++) {
                    var tn = inputTriangles[f].triangles.length;
                    //console.log("number of triangles in this files: " + tn);
            
                    // Loop over the triangles, draw each in 2d
                    for(var k=0; k<tn; k++){
                        var vertex1 = inputTriangles[f].triangles[k][0];
                        var vertex2 = inputTriangles[f].triangles[k][1];
                        var vertex3 = inputTriangles[f].triangles[k][2];

                        var vertexPos1 = inputTriangles[f].vertices[vertex1];
                        var vertexPos2 = inputTriangles[f].vertices[vertex2];
                        var vertexPos3 = inputTriangles[f].vertices[vertex3];

                        var A = new Vector(vertexPos1[0], vertexPos1[1], vertexPos1[2]);
                        var B = new Vector(vertexPos2[0], vertexPos2[1], vertexPos2[2]);
                        var C = new Vector(vertexPos3[0], vertexPos3[1], vertexPos3[2]);
                        
                        var BA = Vector.subtract(A, B);
                        var CA = Vector.subtract(A, C);
                        var N = Vector.cross(BA, CA);

                        var d = Vector.dot(N, A);
                        var tt = (d - Vector.dot(N, eyePosition))/Vector.dot(N, ray);
                        if(tt > min_tt) {
                            continue;
                        }
                        var I = Vector.add(eyePosition, Vector.scale(tt, ray));

                        var isInsected = inTriangles(A, B, C, I, N);

                        if(isInsected) {
                            if(tt < min_tt) {
                                min_tt = tt;
                                recordF = f;
                            }
                        }

                        if(recordF == -1) {
                            c.change(0, 0, 0, 255);   
                                                        
                        } 
                        else {
                            I = Vector.add(eyePosition, Vector.scale(min_tt, ray));

                            c = localBP(I, eyePosition, inputTriangles[recordF].material, N);
                            if((c.r<0) || (c.g<0) || (c.b<0) || (c.a<0)) {
                                console.log("i:"+i+" "+"j:"+j);
                            }
                        }
                    } // end for triangles
                } // end for files
            } // end if triangle file found
            drawPixel(imagedata, i, j, c);
        }
   }   
   context.putImageData(imagedata,0,0);
} // end draw rand pixels in input triangles

function calculateP(ul, ur, ll, lr, s, t) {
    pl = ul + s * (ll - ul);
    pr = ur + s * (lr - ur)
    p = pl + t * (pr - pl);
    return p;
}

function inTriangles(A, B, C, I, N) {
    var AB = Vector.subtract(B, A);
    var AI = Vector.subtract(I, A);
    var BC = Vector.subtract(C, B);
    var BI = Vector.subtract(I, B);
    var CA = Vector.subtract(A, C);
    var CI = Vector.subtract(I, C);
    var res1 = Vector.dot(N, Vector.cross(AB, AI));
    var res2 = Vector.dot(N, Vector.cross(BC, BI));
    var res3 = Vector.dot(N, Vector.cross(CA, CI));

    if((res1 > 0)&&(res2 > 0)&&(res3 > 0)) {
        return true;
    }
    if((res1 < 0)&&(res2 < 0)&&(res3 < 0)) {
        return true;
    }
    return false;
}

function localBP(I, eyePosition, material, N) {

    var light = {position: new Vector(-3, 1, -0.5), ambient:1, diffuse:1, specular:1};
    var L = Vector.normalize(Vector.subtract(light.position, I));
    var V = Vector.normalize(Vector.subtract(eyePosition, I));
    var normalN = Vector.normalize(N);
    var H = Vector.normalize(Vector.add(L, V));
    var NH = Vector.dot(normalN, H);
    var BPc = new Color(0, 0, 0, 255);
    var r = Math.max(0, material.ambient[0] * light.ambient) + 
            Math.max(0, material.diffuse[0] * light.diffuse * Vector.dot(normalN, L)) +
            Math.max(0, material.specular[0] * light.specular * Math.pow(NH, material.n)); 
    var g = Math.max(0, material.ambient[1] * light.ambient) + 
            Math.max(0, material.diffuse[1] * light.diffuse * Vector.dot(normalN, L)) +
            Math.max(0, material.specular[1] * light.specular * Math.pow(NH, material.n)); 
    var b = Math.max(0, material.ambient[2] * light.ambient) + 
            Math.max(0, material.diffuse[2] * light.diffuse * Vector.dot(normalN, L)) +
            Math.max(0, material.specular[2] * light.specular * Math.pow(NH, material.n));
    BPc.change(r*255, g*255, b*255, 255);
    //console.log(BPc);
    return BPc; 

}

// get the input ellipsoids from the standard class URL
function getInputSpheres() {
    const INPUT_ELLIPSOIDS_URL = 
        "https://ncsucgclass.github.io/prog1/spheres.json";
        
    // load the ellipsoids file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_ELLIPSOIDS_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input ellipses file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
} // end get input ellipsoids

//Raycasting triangles
function rayCastSpheres(context) {
    var inputSpheres = getInputSpheres();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    
    var ul = new Vector(0, 1, 0);
    var ur = new Vector(1, 1, 0);
    var ll = new Vector(0, 0, 0);
    var lr = new Vector(1, 0, 0);
    var eyePosition = new Vector(0.5, 0.5, -0.5);
    var drawColor = new Color(0, 0, 0, 255);

    var i, j, t, s;
    
    for(i = 0; i < w; i++) {
        for(j = 0; j < h; j++) {
            t = i/w;
            s = j/h;
            var p = new Vector( calculateP(ul.x, ur.x, ll.x, lr.x, s, t), 
                                calculateP(ul.y, ur.y, ll.y, lr.y, s, t), 
                                calculateP(ul.z, ur.z, ll.z, lr.z, s, t));
            var ray = Vector.subtract(p, eyePosition);

            var min_tt = Number.MAX_VALUE;
            var recordS = -1;
            var center = new Vector(0, 0, 0);
            
            if (inputSpheres != String.null) { 
                var sn = inputSpheres.length;
                //console.log("number of triangles in this files: " + sn);
        
                // Loop over the triangles, draw each in 2d
                for(var k=0; k<sn; k++){

                    center.set(inputSpheres[k].x, inputSpheres[k].y, inputSpheres[k].z);
                    var r = inputSpheres[k].r;
                    var ec = Vector.subtract(eyePosition, center);
                    var a = Vector.dot(ray, ray);
                    var b = 2 * Vector.dot(ray, ec);
                    var c = Vector.dot(ec, ec) - r*r;

                    var jdg = b*b - 4*a*c;

                    if(jdg < 0) {
                        //drawColor.change(0, 0, 0, 255); 
                        continue;
                    }

                    var tt1 = (-b + Math.sqrt(jdg))/(2*a);
                    var tt2 = (-b - Math.sqrt(jdg))/(2*a);
                    var tt;
                    if((tt1 < 1)&&(tt2 < 1)) {
                        drawColor.change(0, 0, 0, 255); 
                        continue;
                    }

                    if(tt1 > 1) {
                        if(tt2 > 1) {
                            tt = Math.min(tt1, tt2);
                        }
                        else {
                           tt = tt1;
                       }
                    }                    
                
                    if(tt < min_tt) {
                        min_tt = tt;
                        recordS = k;
                    }
                }
                
                if(recordS == -1) {
                    drawColor.change(0, 0, 0, 255);                                     
                } 
                else {
                    var material = {ambient: inputSpheres[recordS].ambient, 
                                diffuse: inputSpheres[recordS].diffuse,
                                specular: inputSpheres[recordS].specular,
                                n: inputSpheres[recordS].n};
                    var I = Vector.add(eyePosition, Vector.scale(min_tt, ray));
                    center.set(inputSpheres[recordS].x, inputSpheres[recordS].y, inputSpheres[recordS].z);
                    var N = Vector.subtract(I, center);
                    drawColor = localBP(I, eyePosition, material, N);
                }
                drawPixel(imagedata, i, j, drawColor);
            } // end for ellpsoids 
        } 
   }   
   context.putImageData(imagedata,0,0);
} // end draw rand pixels in input triangles



/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas, context, and image data
    var canvas0 = document.getElementById("viewport0");
    var canvas1 = document.getElementById("viewport1"); 
    var context0 = canvas0.getContext("2d");
    var context1 = canvas1.getContext("2d");

    rayCastTriangles(context0);
    rayCastSpheres(context1);
} // end main