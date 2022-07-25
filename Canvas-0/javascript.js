

var x = 400;
var y = 0;
var z = 300;
var vspd = 0;
var canJump = false;

var pWidth = 50;
var pHeight = 50;

var blink = 0;

var left = false;
var right = false;
var up = false;
var down = false;
var space = false;
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var fpang = 0;
var quadsToDraw = [];

var pimage = new Image();
pimage.src = "pimage.png";

var pimage2 = new Image();
pimage2.src = "pimage2.png";

var wall = [
    [300, 300, 100, 100],
    [600, 100, 50, 350],
    [200, 500, 450, 50]
];

window.onload = function () {
    var fps = 60;
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    setInterval(gameloop, 1000 / fps);
}

function gameloop() {
    gameLogic();
    paintScreen();
}

function minMax(val, min, max) {
    return Math.min(Math.max(min, val), max);
}

function fpDrawPillar(prX, prY, prZ, prW, prH, prL) {
    var propEnds = 0.03;
    var propIn = 0.66;

    var playerHeight = 100;
    prY = playerHeight - prH - prY;

    /*drawPrism(prX, prY, prZ, prW, prH * propEnds, prL);
    drawPrism(prX + prW * (1 - propIn)/2, prY + prH * propEnds, 
        prZ + prL * (1 - propIn)/2, prW * propIn, prH - prH * propEnds, prL * propIn);
    drawPrism(prX, prY + prH - prH * propEnds, prZ, prW, prH * propEnds, prL);*/

    fillPrism(prX + prW * (1 - propIn) / 2, prY + prH * propEnds,
        prZ + prL * (1 - propIn) / 2, prW * propIn, prH - prH * propEnds, prL * propIn);



    var col = hexToRgb(ctx.fillStyle);

    ctx.fillStyle = ctx.fillStyle = 'rgb(' + parseInt(col.r / 2) + ', ' +
        parseInt(col.g / 2) + ', ' + parseInt(col.b / 2) + ')';
    fillPrism(prX, prY, prZ, prW, prH * propEnds, prL);
    fillPrism(prX, prY + prH - prH * propEnds, prZ, prW, prH * propEnds, prL);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function drawPrism(prX, prY, prZ, prW, prH, prL) {
    draw3dLine(prX, prY, prZ, prX, prY, prZ + prL);
    draw3dLine(prX, prY, prZ, prX, prY + prH, prZ);
    draw3dLine(prX, prY + prH, prZ, prX, prY + prH, prZ + prL);
    draw3dLine(prX, prY, prZ + prL, prX, prY + prH, prZ + prL);

    draw3dLine(prX + prW, prY, prZ, prX + prW, prY, prZ + prL);
    draw3dLine(prX + prW, prY, prZ, prX + prW, prY + prH, prZ);
    draw3dLine(prX + prW, prY + prH, prZ, prX + prW, prY + prH, prZ + prL);
    draw3dLine(prX + prW, prY, prZ + prL, prX + prW, prY + prH, prZ + prL);

    draw3dLine(prX, prY, prZ, prX + prW, prY, prZ);
    draw3dLine(prX, prY + prH, prZ, prX + prW, prY + prH, prZ);
    draw3dLine(prX, prY, prZ + prL, prX + prW, prY, prZ + prL);
    draw3dLine(prX, prY + prH, prZ + prL, prX + prW, prY + prH, prZ + prL);
}

function fillPrism(prX, prY, prZ, prW, prH, prL) {
    draw3dQuad(prX, prY, prZ, prX, prY, prZ + prL, prX + prW, prY, prZ + prL, prX + prW, prY, prZ);
    draw3dQuad(prX, prY, prZ, prX, prY, prZ + prL, prX, prY + prH, prZ + prL, prX, prY + prH, prZ);
    draw3dQuad(prX, prY, prZ, prX, prY + prH, prZ, prX + prW, prY + prH, prZ, prX + prW, prY, prZ);

    draw3dQuad(prX + prW, prY + prH, prZ + prL, prX + prW, prY + prH, prZ,
        prX + prW, prY, prZ, prX + prW, prY, prZ + prL);
    draw3dQuad(prX + prW, prY + prH, prZ + prL, prX + prW, prY + prH, prZ,
        prX, prY + prH, prZ, prX, prY + prH, prZ + prL);
    draw3dQuad(prX + prW, prY + prH, prZ + prL, prX + prW, prY, prZ + prL,
        prX, prY, prZ + prL, prX, prY + prH, prZ + prL);
}

function draw3dLine(x1, y1, z1, x2, y2, z2) {
    var centerOfScreenX = 400;
    var centerOfScreenY = 300;

    var x1Diff = x1 - x;
    var y1Diff = y1 - y;
    var z1Diff = z1 - z;
    var x2Diff = x2 - x;
    var y2Diff = y2 - y;
    var z2Diff = z2 - z;

    var translatedX1 = x1Diff * Math.cos(-fpang) + z1Diff * Math.sin(-fpang);
    var translatedZ1 = z1Diff * Math.cos(-fpang) - x1Diff * Math.sin(-fpang);
    var translatedX2 = x2Diff * Math.cos(-fpang) + z2Diff * Math.sin(-fpang);
    var translatedZ2 = z2Diff * Math.cos(-fpang) - x2Diff * Math.sin(-fpang);

    if (translatedZ1 < 0 || translatedZ2 < 0) {
        return;
    }

    var screenDistance = 400;

    dispX1 = (translatedX1 / translatedZ1) * screenDistance + centerOfScreenX;
    dispY1 = (y1Diff / translatedZ1) * screenDistance + centerOfScreenY;
    dispX2 = (translatedX2 / translatedZ2) * screenDistance + centerOfScreenX;
    dispY2 = (y2Diff / translatedZ2) * screenDistance + centerOfScreenY;

    ctxDrawLine(dispX1, dispY1, dispX2, dispY2);
    //ctx.fillRect(390, 290, 20, 20);
}

function draw3dQuad(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4) {
    var centerOfScreenX = 400;
    var centerOfScreenY = 300;

    var x1Diff = x1 - x;
    var y1Diff = y1 - y;
    var z1Diff = z1 - z;
    var x2Diff = x2 - x;
    var y2Diff = y2 - y;
    var z2Diff = z2 - z;
    var x3Diff = x3 - x;
    var y3Diff = y3 - y;
    var z3Diff = z3 - z;
    var x4Diff = x4 - x;
    var y4Diff = y4 - y;
    var z4Diff = z4 - z;

    var translatedX1 = x1Diff * Math.cos(-fpang) + z1Diff * Math.sin(-fpang);
    var translatedZ1 = z1Diff * Math.cos(-fpang) - x1Diff * Math.sin(-fpang);
    var translatedX2 = x2Diff * Math.cos(-fpang) + z2Diff * Math.sin(-fpang);
    var translatedZ2 = z2Diff * Math.cos(-fpang) - x2Diff * Math.sin(-fpang);
    var translatedX3 = x3Diff * Math.cos(-fpang) + z3Diff * Math.sin(-fpang);
    var translatedZ3 = z3Diff * Math.cos(-fpang) - x3Diff * Math.sin(-fpang);
    var translatedX4 = x4Diff * Math.cos(-fpang) + z4Diff * Math.sin(-fpang);
    var translatedZ4 = z4Diff * Math.cos(-fpang) - x4Diff * Math.sin(-fpang);

    if (translatedZ1 < 0 || translatedZ2 < 0 || translatedZ3 < 0 || translatedZ4 < 0) {
        return;
    }

    var screenDistance = 400;

    var dispX1 = (translatedX1 / translatedZ1) * screenDistance + centerOfScreenX;
    var dispY1 = (y1Diff / translatedZ1) * screenDistance + centerOfScreenY;
    var dispX2 = (translatedX2 / translatedZ2) * screenDistance + centerOfScreenX;
    var dispY2 = (y2Diff / translatedZ2) * screenDistance + centerOfScreenY;

    var dispX3 = (translatedX3 / translatedZ3) * screenDistance + centerOfScreenX;
    var dispY3 = (y3Diff / translatedZ3) * screenDistance + centerOfScreenY;
    var dispX4 = (translatedX4 / translatedZ4) * screenDistance + centerOfScreenX;
    var dispY4 = (y4Diff / translatedZ4) * screenDistance + centerOfScreenY;

    var avgTZ = (translatedZ1 + translatedZ2 + translatedZ3 + translatedZ4) / 4;

    quadsToDraw.push([dispX1, dispY1, dispX2, dispY2, dispX3, dispY3, dispX4, dispY4, avgTZ, ctx.fillStyle]);
}

function ctxDrawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function ctxDrawQuad(x1, y1, x2, y2, x3, y3, x4, y4) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
}

function controlLogic() {
    var walkSpd = 3;
    var turnSpd = 0.03;

    if (up) {
        x += Math.sin(fpang) * walkSpd;
        z += Math.cos(fpang) * walkSpd;
    }
    else if (down) {
        x -= Math.sin(fpang) * walkSpd;
        z -= Math.cos(fpang) * walkSpd;
    }

    if (right) {
        fpang += turnSpd;
    }
    else if (left) {
        fpang -= turnSpd;
    }
}

function gameLogic() {
    controlLogic();
}

function paintScreen() {
    quadsToDraw = [];

    ctx.fillStyle = "#696";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";

    for (var i = 0; i < 8; i++) {
        ctx.fillStyle = 'rgb(' + i * 31 + ', ' + ((i + 2) % 8) * 31 + ', ' + ((i + 5) % 8) * 31 + ')';
        fpDrawPillar(550, 0, 200 + 400 * i, 50, 300, 50);
        fpDrawPillar(200, 0, 200 + 400 * i, 50, 300, 50);
    }

    renderQuads();

}

function renderQuads() {
    quadsToDraw.sort(function (a, b) { return b[8] - a[8] });

    for (var i = 0; i < quadsToDraw.length; i++) {
        ctx.fillStyle = quadsToDraw[i][9];
        ctxDrawQuad(quadsToDraw[i][0], quadsToDraw[i][1], quadsToDraw[i][2], quadsToDraw[i][3],
            quadsToDraw[i][4], quadsToDraw[i][5], quadsToDraw[i][6], quadsToDraw[i][7]);
    }
}

function keydown(evt) {
    switch (evt.keyCode) {
        case 37: left = true; break;
        case 38: up = true; break;
        case 39: right = true; break;
        case 40: down = true; break;
    }
}

function keyup(evt) {
    switch (evt.keyCode) {
        case 37: left = false; break;
        case 38: up = false; break;
        case 39: right = false; break;
        case 40: down = false; break;
    }
}

