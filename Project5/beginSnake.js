class oneGrid {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    setType(type) {
        this.type = type;
    }
}

class GridState {
    static get EMPTY() {
        return 0;
    }
    static get SNAKE() {
        return 1;
    }
    static get FOOD() {
        return 2;
    }
    static get WALL() {
        return 3;
    }
}

class SnakeDirection {
    static get UP() {
        return 0;
    }
    static get DOWN() {
        return 1;
    }
    static get LEFT() {
        return 2;
    }
    static get RIGHT() {
        return 3;
    }
}

class GameState {
    static get READY() {
        return 0;
    }
    static get RUNNING() {
        return 1;
    }
    static get DEAD() {
        return 2;
    }
}

var grid = [];      // an array of oneGrid object
var wall = [];
var snake0 = [];
var food = [];
var glbDirection0;

var sTimer;
var timePerStep = 100; // move one step per time.
var score;
var scoreEle;
var beginEle;
var endEle;
var currState = GameState.READY;

function coordsToMatirx(x, y) {
    var tMatrix = mat4.create();
    var tVector = new vec3.fromValues(x, y, 0);
    mat4.translate(tMatrix, tMatrix, tVector);

    return tMatrix;
}

function drawStuff(stuff) {
    for(var i = 0; i < stuff.length; i++) {
        tMatrix = coordsToMatirx(grid[stuff[i]].x, grid[stuff[i]].y);
        drawOneCube(tMatrix);
    }
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function initGrid(lines, columns) {
    var i, j;
    var upEdge = columns / 2;
    var bottomEdge = -columns / 2;
    var leftEdge = -lines / 2;
    var rightEdge = lines / 2;
    var tmp;

    grid.length = 0;
    
    for(i = leftEdge; i <= rightEdge; i++) {
        for(j = bottomEdge; j <= upEdge; j++) {
            if((i == leftEdge) || (i == rightEdge)
             || (j == bottomEdge) || (j == upEdge)) {
                tmp = new oneGrid(i * CUBELENGTH, j * CUBELENGTH, GridState.WALL);
                wall.push(grid.length);
            } 
            else {
                tmp = new oneGrid(i * CUBELENGTH, j * CUBELENGTH, GridState.EMPTY);
            }
            grid.push(tmp);
        }
    }
}

function initGame() {
    initGrid(50, 50);
    render();    
}

function render() {
    // clear frame/depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    drawStuff(wall);
    drawStuff(food);
    drawStuff(snake0);
}

function generateFood() {
    food[0] = 0;
    while(grid[food[0]].type != GridState.EMPTY) {
        food[0] = randomNum(0, grid.length - 1);
    }
    grid[food[0]].type = GridState.FOOD;
    food.length = 1;
}

function initSnake(direction, lines, columns) {
    var i;
    var newSnake = [];
    var head = 0;
    while((grid[head].type != GridState.EMPTY) || 
     (head % columns < INNERLENGTH) || (head % columns > columns - INNERLENGTH - 1) ||
     Math.floor((head / columns) < INNERLENGTH) || 
     Math.floor((head / columns) > lines - INNERLENGTH - 1)) {
        
        head = randomNum(0, grid.length - 1);
    }

    for(i = 0; i < INNERLENGTH; i++) {
        switch(direction) {
            case SnakeDirection.UP: {
                newSnake.push(head + i * columns);
                break;
            }
            case SnakeDirection.DOWN: {
                newSnake.push(head - i * columns);
                break;
            }
            case SnakeDirection.LEFT: {
                newSnake.push(head + i);
                break;
            }
            case SnakeDirection.RIGHT: {
                newSnake.push(head - i);
                break;
            }
        }

        grid[newSnake[i]].setType(GridState.SNAKE);
    }
    
    return newSnake;
}

function move(theSnake, direction, columns) {

    if(theSnake.length == 0) {
        return theSnake;
    }

    var head = theSnake[0];
    var tmp;

    switch(direction) {
        case SnakeDirection.UP: {
            tmp = head - columns;
            break;
        }
        case SnakeDirection.DOWN: {
            tmp = head + columns;
            break;
        }
        case SnakeDirection.LEFT: {
            tmp = head - 1;
            break;
        }
        case SnakeDirection.RIGHT: {
            tmp = head + 1;
            break;
        }
    }

    if(grid[tmp].type == GridState.SNAKE || grid[tmp].type == GridState.WALL) {       

        clearInterval(sTimer);
        food.length = 0;
        for(var i = 0; i < endEle.length; i++) {
            endEle[i].style.display = "block";
        }
        currState = GameState.DEAD;

        return theSnake;
    }

    if(grid[tmp].type != GridState.FOOD) {
        grid[theSnake.pop()].setType(GridState.EMPTY);
    }
    else {

        score += 10;
        if((score % 50 == 0) && (score != 0)) {
            timePerStep -= 10;
        }
        scoreEle.innerText = score; 
        
        generateFood();
    }


    theSnake.unshift(tmp);
    grid[tmp].setType(GridState.SNAKE);
    
    return theSnake;
}

function initDomEle() {
    scoreEle = document.getElementById("score");
    scoreEle.innerHTML = 0;
    beginEle = document.getElementsByClassName("begin");
    endEle = document.getElementsByClassName("end");
}

function keyPressControl(e) {
	
	switch(e.charCode) {
        // space
        case 32: {

            if(currState == GameState.READY) {
                snake0.length = 0;
                score = 0;
                timePerStep = 100;
                scoreEle.innerHTML = 0;
                initGrid(50, 50);
                glbDirection0 = randomNum(0, 3);
                snake0 = initSnake(glbDirection0, 51, 51);
                generateFood();

                for(var i = 0; i < beginEle.length; i++) {
                    beginEle[i].style.display = "none";
                }
                currState = GameState.RUNNING;
            }

            if(currState == GameState.DEAD) {
                for(var i = 0; i < beginEle.length; i++) {
                    endEle[i].style.display = "none";
                    beginEle[i].style.display = "block";
                }
                currState = GameState.READY;
            }
         
            break;   
        }

        // w
        case 119: {
            if(glbDirection0 != SnakeDirection.DOWN){
                glbDirection0 = SnakeDirection.UP;
            }
            break;
        }
        // s
        case 115: {
            if(glbDirection0 != SnakeDirection.UP){
                glbDirection0 = SnakeDirection.DOWN;
            }
            break;
        }
        // a
        case 97: {
            if(glbDirection0 != SnakeDirection.RIGHT){
                glbDirection0 = SnakeDirection.LEFT;
            }
            break;
        }  
        // d
        case 100: {
            if(glbDirection0 != SnakeDirection.LEFT){
                glbDirection0 = SnakeDirection.RIGHT;
            }
            break;
        }
    }

    if(currState == GameState.RUNNING) {
        
        clearInterval(sTimer);

        sTimer = setInterval(() => {
            snake0 = move(snake0, glbDirection0, 51);
            requestAnimationFrame(() => {
                render();
            });
       
        }, timePerStep);
    
    }
    
}