function demarrage() {
    initialiser();
    afficher("<canvas id='canvas'></canvas>");
    actualiser();
    const canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    System = {
        gravity: 0.2,
        character: newCharacter(),
        camera: {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        },
        objects: [],
        ennemies: [],
        score: 0,
        level_width: 0,
        level_height: 0,
        background_color: "#000000"
    }
    level_1();
    draw();
    System.animation = setInterval(draw, 10);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);
}

function draw() {
    moveCharacter();
    for (let n = 0; n < System.ennemies.length; n++) {
        moveEnnemy(System.ennemies[n]);
    }

    emptyCanvas();
    drawScore();
    for (let n = 0; n < System.objects.length; n++) {
        drawObject(System.objects[n]);
    }
    for (let n = 0; n < System.ennemies.length; n++) {
        drawEnnemy(System.ennemies[n]);
    }
    
    if (System.character.immune > 0) {
        if (System.character.immune%2 == 0) {
            drawCharacter();
        }
        System.character.immune--;
    }
    else {
        drawCharacter();
    }
    fixCamera();
}

function emptyCanvas() {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, System.max_width, System.max_height);
        ctx.fillStyle = System.background_color;
        ctx.fillRect(System.camera.x, System.camera.y, System.camera.width, System.camera.height);
    }
}

function drawScore() {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = "#FFD700";
        ctx.fillRect(System.camera.x + 10, System.camera.y + 10, 50, 50);
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(System.camera.x + 30, System.camera.y + 20, 10, 30);

        ctx.fillStyle = "#000000";
        ctx.font = "50px serif";
        ctx.fillText(" x " + System.score, System.camera.x + 60, System.camera.y + 50);
    }
}