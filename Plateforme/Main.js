function demarrage() {
    initialiser();
    afficher("<canvas id='canvas'></canvas>");
    actualiser();
    const canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    System = {
        gravity: 0.05,
        character: {
            x: 100,
            y: 0,
            height: 100,
            width: 50,
            jumping: false,
            left: false,
            right: false,
            can_jump: false,
            move_y: 1
        },
        objects: []
    }
    newObject("plateform", 0, canvas.height / 2, canvas.width, canvas.height / 2);
    newObject("plateform", canvas.width / 4, canvas.height / 4, canvas.width / 4, canvas.height / 10);
    newObject("plateform", canvas.width / 2, canvas.height / 4, canvas.width / 4, canvas.height / 4);
    newObject("coin", canvas.width / 2, canvas.height / 8, 50, 50);
    draw();
    setInterval(draw, 1);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);
}

function draw() {
    moveCharacter();
    emptyCanvas();
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
    }
}

function drawCharacter() {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = "#EE0000";
        ctx.fillRect(System.character.x, System.character.y, System.character.width, System.character.height);
    }
}

function newObject(type, x, y, width, height) {
    let object = {
        type: type,
        x: x,
        y: y,
        height: height,
        width: width
    }
    System.objects.push(object);
}

function drawObject(object) {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        switch (object.type) {
            case "coin":
                ctx.fillStyle = "#FFFF00";
                ctx.fillRect(object.x, object.y, object.width, object.height);
                break;
            case "plateform":
                ctx.fillStyle = "#333333";
                ctx.fillRect(object.x, object.y, object.width, object.height);
                break;
        }
    }
}

function moveCharacter() {
    let move_x = 0;
    if (System.character.left) {
        move_x -= 2;
    }
    if (System.character.right) {
        move_x += 2;
    }
    System.character.x += move_x;
    for (let n = 0; n < System.objects.length; n++) {
        if (System.objects[n].type == "plateform" && collision(System.character, System.objects[n])) {
            if (move_x > 0) {
                System.character.x = System.objects[n].x - System.character.width;
            }
            else if (move_x < 0) {
                System.character.x = System.objects[n].x + System.objects[n].width;
            }
        }
    }
    if (System.character.x < 0) {
        System.character.x = 0;
    }
    else if (System.character.x > canvas.width - System.character.width) {
        System.character.x = canvas.width - System.character.width;
    }

    if (System.character.jumping && System.character.can_jump) {
        System.character.can_jump = false;
        System.character.move_y = -5;
    }
    System.character.move_y += System.gravity;
    System.character.y += System.character.move_y;
    for (let n = 0; n < System.objects.length; n++) {
        if (System.objects[n].type == "plateform" && collision(System.character, System.objects[n])) {
            if (System.character.move_y > 0) {
                System.character.y = System.objects[n].y - System.character.height;
                System.character.can_jump = true;
                System.character.move_y = 0;
            }
            else if (System.character.move_y < 0) {
                System.character.y = System.objects[n].y + System.objects[n].height;
                System.character.move_y = 0;
            }
        }
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 37) {
        System.character.left = false;
    }
    else if (e.keyCode == 39) {
        System.character.right = false;
    }
    else if (e.keyCode == 38) {
        System.character.jumping = false;
    }
}

function keyDownHandler(e) {
    if (e.keyCode == 37) {
        System.character.left = true;
    }
    else if (e.keyCode == 39) {
        System.character.right = true;
    }
    if (e.keyCode == 38) {
        System.character.jumping = true;
    }
}

function collision(object1, object2) {
    if (object1.x + object1.width > object2.x && object1.x < object2.x + object2.width && object1.y + object1.height > object2.y && object1.y < object2.y + object2.height) {
        return true;
    }
}