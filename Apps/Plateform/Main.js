function demarrage() {
    drawCanvas();
    const canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    System = {
        gravity: 0.4,
        character: newCharacter(),
        camera: {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        },
        objects: [],
        entities: [],
        coins: 0,
        max_coins: 0,
        level_width: 0,
        level_height: 0,
        background_color: "#000000"
    }
    level_1();
    startAnimating(60);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);
}

function drawCanvas() {
    initialiser();
    afficher("<canvas id='canvas'></canvas>");
    actualiser();
    const canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
}

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    System.animation = requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        moveCharacter();
        for (let n = 0; n < System.entities.length; n++) {
            moveEntity(System.entities[n]);
        }

        emptyCanvas();
        drawScore();
        for (let n = 0; n < System.objects.length; n++) {
            drawObject(System.objects[n]);
        }
        for (let n = 0; n < System.entities.length; n++) {
            drawEntity(System.entities[n]);
        }

        if (System.character.immune > 0) {
            if (Math.floor(Date.now() / System.character.immune) % 2) {
                drawCharacter();
            }
            System.character.immune--;
        }
        else {
            drawCharacter();
        }
        fixCamera();
    }
}

function emptyCanvas() {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, System.level_width, System.level_height);
        ctx.fillStyle = System.background_color;
        ctx.fillRect(System.camera.x, System.camera.y, System.camera.width, System.camera.height);
    }
}

function drawScore() {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = "#FFD700";
        ctx.fillRect(System.camera.x + 5, System.camera.y + 5, 25, 25);
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(System.camera.x + 15, System.camera.y + 10, 5, 15);

        ctx.fillStyle = "#000000";
        ctx.font = "25px serif";
        ctx.fillText(" x " + System.coins, System.camera.x + 30, System.camera.y + 25);
    }
}

async function finishLevel() {
    cancelAnimationFrame(System.animation);
    await sleep(100);
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, System.level_width, System.level_height);
        ctx.translate(System.camera.x, System.camera.y);

        ctx.fillStyle = System.background_color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FFD700";
        ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 40, 50, 50);
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(canvas.width / 2 - 30, canvas.height / 2 - 30, 10, 30);

        ctx.fillStyle = "#000000";
        ctx.font = "50px serif";
        ctx.fillText(" x " + System.coins + " / " + System.max_coins, canvas.width / 2, canvas.height / 2);
    }
}