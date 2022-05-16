const reset = document.getElementById("resetButton");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const synth = new Tone.Synth().toDestination();

const canvasWidth = 600;
const canvasHeight = 400;
const playerOffset = 30;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let hardMode = document.getElementById("hardRadio");
let rightPressed = false;
let leftPressed = false;
let enterPressed = false;
let pause = false;
let cubeCounter = 0;
let cubeColliderCounter = 0;
let scoreCounter = 0;
let level = 0;
let levelName = 0;
let levelOneCounter = 10;
let levelTwoCounter = 20;
let levelThreeCounter = 30;

reset.addEventListener("click", unCheck);

function unCheck() {
    hardMode.checked = false;
    console.log("unchecked");
}

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function randomItem(arrayName) {
    const item = arrayName[Math.floor(Math.random() * arrayName.length)];
    return item;
}

function Cube(size, color, velX, velY, x, y) {
    this.size = size;
    this.color = color;
    this.velX = velX;
    this.velY = velY;
    this.x = x;
    this.y = y;
}

function Player(size, color, velX, x, y) {
    this.size = size;
    this.color = color;
    this.velX = velX;
    this.x = x;
    this.y = y;
}

cubes = [];
let colors = ["red", "orange", "green", "white", "blue", "yellow"];
let size = 30;

function createCubes() {
    if (hardMode.checked) {
        let cube = new Cube(
            size,
            randomItem(colors),
            random(-2, 2),
            random(4, 6),
            random(size, canvasWidth - size),
            0
        );
        cubes.push(cube);
    } else {
        let cube = new Cube(
            size,
            randomItem(colors),
            random(-2, 2),
            random(2, 4),
            random(size, canvasWidth - size),
            0
        );
        cubes.push(cube);
    }
}

let playerSize = 50;
let player = new Player(
    playerSize,
    randomItem(colors),
    5,
    canvasWidth / 2 - (playerSize / 2),
    canvasHeight - (playerSize / 2)
);

Cube.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.size, this.size);
    ctx.fill();
}

Player.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.size, this.size / 2);
    ctx.fill();
}

Cube.prototype.update = function() {
    this.x += this.velX;
    this.y += this.velY;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 13) {
        enterPressed = true;
        console.log("Enter");
    } else if (e.keyCode == 68 || e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
        console.log("Right");
    } else if (e.keyCode == 65 || e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        console.log("Left");
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 13) {
        enterPressed = false;
    } else if (e.keyCode == 68 || e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.keyCode == 65 || e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

Cube.prototype.collisionDetect = function() {
    if (this.x >= canvasWidth - this.size) {
        this.velX = -(this.velX);
    }
    if (this.x <= 0) {
        this.velX = -(this.velX);
    }
}

Player.prototype.collisionDetect = function(collider) {
    const dx = this.x - collider.x;
    const dy = this.y - collider.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (this.x >= canvasWidth - this.size) {
        this.x = this.x - 5;
    }
    if (this.x <= 0) {
        this.x = this.x + 5;
    }
    return r;
}

function randomCube(index) {
    cubes[index].y = 0;
    cubes[index].color = randomItem(colors);
    cubes[index].velX = random(-2, 2);
    if (hardMode.checked) {
        cubes[index].velY = random(4, 6);
    } else {
        cubes[index].velY = random(2, 4);
    }
    cubes[index].x = random(size, canvasWidth - size);
}

function gameOver() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2);
    ctx.font = "30px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Your score: " + scoreCounter, canvasWidth / 2, canvasHeight / 2 + canvasHeight / 4)
}

function drawScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(scoreCounter, canvasWidth / 7, canvasHeight / 10);
}

function drawLevel() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Level: " + levelName, canvasWidth - canvasWidth / 7, canvasHeight / 10);
}

function drawTitle() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Falling Cubes", canvasWidth / 2, canvasHeight / 2);
    ctx.fillStyle = "yellow";
    ctx.fillText("click enter to begin", canvasWidth / 2, canvasHeight / 2 + canvasHeight / 4);
}

function updateCanvas() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

let notes = ["G4", "B4", "C5", "D5", "E5"];

function createSound() {
    let note = randomItem(notes);
    synth.triggerAttackRelease(note, "8n");
}

function loop() {
    switch (level) {
        case 0:
            updateCanvas();
            if (enterPressed) {
                pause = true;
                createCubes();
                pause = false;
                levelName++;
                level++;
            }
            drawTitle();
            if (pause == false) {
                requestAnimationFrame(loop);
            }
            break;
        case 1:
            updateCanvas();
            drawScore();
            drawLevel();
            player.draw();
            if (cubes[0].y < canvasHeight) {
                cubes[0].collisionDetect();
                cubes[0].draw();
                cubes[0].update();
            } else {
                randomCube(0);
                cubeCounter++;
                scoreCounter -= 2;
                drawScore();
                if (cubeCounter >= 5) {
                    pause = true;
                    cubes.pop(cubes[0]);
                    gameOver();
                }
            }
            if (player.collisionDetect(cubes[0]) < player.size + cubes[0].size - playerOffset) {
                scoreCounter += 5;
                cubeColliderCounter++;
                createSound();
                drawScore();
                randomCube(0);
            }
            if (cubeColliderCounter >= levelOneCounter) {
                cubes.pop(cubes[0]);
                while (cubes.length < 2) {
                    createCubes();
                }
                cubeColliderCounter = 0;
                levelName++;
                level++;
            }
            if (rightPressed) {
                player.x += player.velX;
            }
            if (leftPressed) {
                player.x -= player.velX;
            }
            if (pause == false) {
                requestAnimationFrame(loop);
            }
            break;
        case 2:
            updateCanvas();
            drawScore();
            drawLevel();
            player.draw();
            for (let i = 0; i < cubes.length; i++) {
                if (cubes[i].y < canvasHeight) {
                    cubes[i].collisionDetect();
                    cubes[i].draw();
                    cubes[i].update();
                } else {
                    randomCube(i);
                    cubeCounter++;
                    scoreCounter -= 2;
                    drawScore();
                    if (cubeCounter >= 5) {
                        pause = true;
                        for (let i = 0; i < cubes.length; i++) {
                            cubes.pop(cubes[i]);
                        }
                        gameOver();
                    }
                }
            }
            for (let i = 0; i < cubes.length; i++) {
                if (player.collisionDetect(cubes[i]) < player.size + cubes[i].size - playerOffset) {
                    scoreCounter += 10;
                    cubeColliderCounter++;
                    createSound();
                    drawScore();
                    randomCube(i);
                }
            }
            if (cubeColliderCounter >= levelTwoCounter) {
                for (let i = 0; i < cubes.length; i++) {
                    cubes.pop(cubes[i]);
                }
                while (cubes.length < 3) {
                    createCubes();
                }
                cubeColliderCounter = 0;
                levelName++;
                level++;
            }
            if (rightPressed) {
                player.x += player.velX;
            }
            if (leftPressed) {
                player.x -= player.velX;
            }
            if (pause == false) {
                requestAnimationFrame(loop);
            }
            break;
        case 3:
            updateCanvas();
            drawScore();
            drawLevel();
            player.draw();
            for (let i = 0; i < cubes.length; i++) {
                if (cubes[i].y < canvasHeight) {
                    cubes[i].collisionDetect();
                    cubes[i].draw();
                    cubes[i].update();
                } else {
                    randomCube(i);
                    cubeCounter++;
                    scoreCounter -= 2;
                    drawScore();
                    if (cubeCounter >= 5) {
                        pause = true;
                        for (let i = 0; i < cubes.length; i++) {
                            cubes.pop(cubes[i]);
                        }
                        gameOver();
                    }
                }
            }
            for (let i = 0; i < cubes.length; i++) {
                if (player.collisionDetect(cubes[i]) < player.size + cubes[i].size - playerOffset) {
                    scoreCounter += 20;
                    cubeColliderCounter++;
                    createSound();
                    drawScore();
                    randomCube(i);
                }
            }
            if (cubeColliderCounter >= levelThreeCounter) {
                for (let i = 0; i < cubes.length; i++) {
                    cubes.pop(cubes[i]);
                }
                createCubes();
                cubeColliderCounter = 0;
                levelName++;
                level -= 2;
            }
            if (rightPressed) {
                player.x += player.velX;
            }
            if (leftPressed) {
                player.x -= player.velX;
            }
            if (pause == false) {
                requestAnimationFrame(loop);
            }
            break;
        case 4:
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            break;
        default:
            break;
    }
}
loop();

/*
TO DO:
- 2 player
- piano tiles song
*/
