var currentIndex = -1;
var numAllShapes;
/*********************************************
This function is for some ASCII characters to 
control. Like uppercase and lowercase letters, 
digits and so on.
**********************************************/
function keyPressControl(e) {

	var tmp = vec3.create();	// for convience
	var adsChange = new vec3.fromValues(0.1, 0.1, 0.1); // degree of changing
	
	switch(e.charCode) {

	/* part 3: change view */
	// a
	case 97: 
		eyePosition[0] -= 0.01;
		break;
	// d
	case 100: 
		eyePosition[0] += 0.01;
		break;
	// w
	case 119:
		eyePosition[2] += 0.01;
		break;
	// s
	case 115:
		eyePosition[2] -= 0.01;
		break;
	// q
	case 113:
		eyePosition[1] += 0.01;
		break;
	// e
	case 101:
		eyePosition[1] -= 0.01;
		break;
	// A
	case 65:
		lookCenter[0] -= 0.01;
		break;
	// D
	case 68:
		lookCenter[0] += 0.01;
		break;
	// W
	case 87:
		lookCenter[1] += 0.01;
		break;
	// S
	case 83:
		lookCenter[1] -= 0.01;
		break;

	/* part 5: change lighting model */
	// b
	case 98: 
		isPhong = !isPhong;
		break;
	// n
	case 110:
		if(selectedTriSet != -1) {
			inputTriangles[selectedTriSet].material.n++;
			if(inputTriangles[selectedTriSet].material.n > 20) {
				inputTriangles[selectedTriSet].material.n = 0;
			}
		}
		if(selectedEllip != -1) {
			inputEllipsoids[selectedEllip].n++;
			if(inputEllipsoids[selectedEllip].n > 20) {
				inputEllipsoids[selectedEllip].n = 0;
			}
		}
		break;
	// 1
	case 49:
		if(selectedTriSet != -1) {
			tmp = inputTriangles[selectedTriSet].material.ambient;
			vec3.add(tmp, tmp, adsChange);
			if(tmp[0] > 1.0) {
				vec3.set(tmp, 0, 0, 0);
			}
			inputTriangles[selectedTriSet].material.ambient = tmp;
		}
		if(selectedEllip != -1) {
			tmp = inputEllipsoids[selectedEllip].ambient;
			vec3.add(tmp, tmp, adsChange);
			if(tmp[0] > 1.0) {
				vec3.set(tmp, 0, 0, 0);
			}
			inputEllipsoids[selectedEllip].ambient = tmp;
		}
		break;
	// 2
	case 50:
		if(selectedTriSet != -1) {
			tmp = inputTriangles[selectedTriSet].material.diffuse;
			vec3.add(tmp, tmp, adsChange);
			if(tmp[0] > 1.0) {
				vec3.set(tmp, 0, 0, 0);
			}
			inputTriangles[selectedTriSet].material.diffuse = tmp;
		}
		if(selectedEllip != -1) {
			tmp = inputEllipsoids[selectedEllip].diffuse;
			vec3.add(tmp, tmp, adsChange);
			if(tmp[0] > 1.0) {
				vec3.set(tmp, 0, 0, 0);
			}
			inputEllipsoids[selectedEllip].diffuse = tmp;
		}
		break;
	// 3
	case 51:
		if(selectedTriSet != -1) {
			tmp = inputTriangles[selectedTriSet].material.specular;
			vec3.add(tmp, tmp, adsChange);
			if(tmp[0] > 1.0) {
				vec3.set(tmp, 0, 0, 0);
			}
			inputTriangles[selectedTriSet].material.specular = tmp;
		}
		if(selectedEllip != -1) {
			tmp = inputEllipsoids[selectedEllip].specular;
			vec3.add(tmp, tmp, adsChange);
			if(tmp[0] > 1.0) {
				vec3.set(tmp, 0, 0, 0);
			}
			inputEllipsoids[selectedEllip].specular = tmp;
		}
		break;

	/* part 6: transfor model */
	// k
	case 107:
		if(selectedTriSet != -1) {
			mat4.translate(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, [0.01, 0, 0]);
		}
		if(selectedEllip != -1) {
			mat4.translate(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, [0.01, 0, 0]);
		}
		break;
	// ;
	case 59:
		if(selectedTriSet != -1) {
			mat4.translate(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, [-0.01, 0, 0]);
		}
		if(selectedEllip != -1) {
			mat4.translate(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, [-0.01, 0, 0]);
		}
		break;
	// o
	case 111:
		if(selectedTriSet != -1) {
			mat4.translate(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, [0, 0, 0.01]);
		}
		if(selectedEllip != -1) {
			mat4.translate(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, [0, 0, 0.01]);
		}
		break;
	// l
	case 108:
		if(selectedTriSet != -1) {
			mat4.translate(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, [0, 0, -0.01]);
		}
		if(selectedEllip != -1) {
			mat4.translate(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, [0, 0, -0.01]);
		}
		break;
	// i
	case 105:
		if(selectedTriSet != -1) {
			mat4.translate(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, [0, 0.01, 0]);
		}
		if(selectedEllip != -1) {
			mat4.translate(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, [0, 0.01, 0]);
		}
		break;
	// p
	case 112:
		if(selectedTriSet != -1) {
			mat4.translate(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, [0, -0.01, 0]);
		}
		if(selectedEllip != -1) {
			mat4.translate(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, [0, -0.01, 0]);
		}
		break;
	// K
	case 75:
		if(selectedTriSet != -1) {
			mat4.rotateY(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, Math.PI/18);
		}
		if(selectedEllip != -1) {
			mat4.rotateY(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, Math.PI/18);
		}
		break;
	// :
	case 58:
		if(selectedTriSet != -1) {
			mat4.rotateY(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, -Math.PI/18);
		}
		if(selectedEllip != -1) {
			mat4.rotateY(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, -Math.PI/18);
		}
		break;
	// O
	case 79:
		if(selectedTriSet != -1) {
			mat4.rotateX(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, Math.PI/18);
		}
		if(selectedEllip != -1) {
			mat4.rotateX(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, Math.PI/18);
		}
		break;
	// L
	case 76:
		if(selectedTriSet != -1) {
			mat4.rotateX(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, -Math.PI/18);
		}
		if(selectedEllip != -1) {
			mat4.rotateX(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, -Math.PI/18);
		}
		break;
	// I
	case 73:
		if(selectedTriSet != -1) {
			mat4.rotateZ(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, Math.PI/18);
		}
		if(selectedEllip != -1) {
			mat4.rotateZ(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, Math.PI/18);
		}
		break;
	// P
	case 80:
		if(selectedTriSet != -1) {
			mat4.rotateZ(inputTriangles[selectedTriSet].tMatrix, 
						   inputTriangles[selectedTriSet].tMatrix, -Math.PI/18);
		}
		if(selectedEllip != -1) {
			mat4.rotateZ(inputEllipsoids[selectedEllip].tMatrix, 
						   inputEllipsoids[selectedEllip].tMatrix, -Math.PI/18);
		}
		break;
	}
	requestAnimationFrame(renderStuff);
}

/*********************************************
This function is for keys on keyboards. Like
CTRL, F1-F12, delete and so on. And it doesn't
distinguish uppercase and lowercase letters.
**********************************************/
function keyDownControl(e) {
	
	switch(e.keyCode) { 

	/* part 4: select a triangle set */
	// left
	case 37:
		if(currentIndex == -1) {
			currentIndex = 0;
		} 
		else {
			currentIndex++;
		}
		if(currentIndex > numAllShapes) {
			currentIndex = 0;
		}
		selectedTriSet = -1;
		selectedEllip = -1;
		if(selectedIndex[currentIndex][1] == 0) {
			selectedTriSet = selectedIndex[currentIndex][2];
		}
		else {
			selectedEllip = selectedIndex[currentIndex][2];
		}
		break;
	// right
	case 39:
		if(currentIndex == -1) {
			currentIndex = numAllShapes;
		} 
		else {
			currentIndex--;
		}
		if(currentIndex < 0) {
			currentIndex = numAllShapes;
		}
		selectedTriSet = -1;
		selectedEllip = -1;
		if(selectedIndex[currentIndex][1] == 0) {
			selectedTriSet = selectedIndex[currentIndex][2];
		}
		else {
			selectedEllip = selectedIndex[currentIndex][2];
		}
		break;
	// space
	case 32:
		selectedTriSet = -1;
		selectedEllip = -1;
		currentIndex = -1;
		break;
	}
	requestAnimationFrame(renderStuff);
}

/* selectedIndex[i] = [cneterCoor, shapeName, setNumber]
   max index = inputTriangles.length + inputEllipsoids.length - 1;
   shapename: 0 -> triangles, 1 -> Ellipsoids
   setNumber: inputTriangles.length, inputEllipsoids.length

*/

function getSelectedIndex() {
	var index = 0;
	for(var i = 0; i < inputTriangles.length; i++) {
		selectedIndex[index] = [setCenter[i], 0, i];
		index++;
	} 
	for(var i = 0; i < inputEllipsoids.length; i++) {
		selectedIndex[index] = [ellipCenter[i], 1, i];
		index++;
	}
	selectedIndex.sort(sortByX);
	numAllShapes = index - 1;
	console.log(selectedIndex);
}

function sortByX(a ,b) {
	if(a[0][0] == b[0][0]) {
		return a[0][1] - b[0][1]
	}
	return a[0][0] - b[0][0];
}