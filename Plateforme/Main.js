function demarrage() {
    initialiser();
    afficher("<canvas id='canvas'></canvas>");
    actualiser();
    const canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    System = {
        gravity: 0.05,
        character: newCharacter(100, 300),
        objects: [],
        score: 0
    }
    level_1();
    draw();
    setInterval(draw, 1);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);
}

function draw() {
    moveCharacter();
    emptyCanvas();
    drawScore();
    for (let n = 0; n < System.objects.length; n++) {
        drawObject(System.objects[n]);
    }
    drawCharacter();
}

function emptyCanvas() {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = System.background_color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawScore() {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = "#FFD700";
        ctx.fillRect(10, 10, 50, 50);
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(30, 20, 10, 30);

        ctx.fillStyle = "#000000";
        ctx.font = "50px serif";
        ctx.fillText(" x " + System.score, 60, 50);
    }
}