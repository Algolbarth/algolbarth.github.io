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
    newObject("plateform", canvas.width / 4, canvas.height / 4, canvas.width / 4 + 1, canvas.height / 10);
    newObject("plateform", canvas.width / 2, canvas.height / 4, canvas.width / 4, canvas.height / 4);
    for (let n = 0; n < 3; n++) {
        newObject("coin", canvas.width / 2 + 100 * n, canvas.height / 8, 50, 50);
    }
    for (let n = 0; n < 5; n++) {
        newObject("coin", canvas.width / 4 + 100 * n, canvas.height / 2.5, 50, 50);
    }
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
        place: System.objects.length,
        type: type,
        x: x,
        y: y,
        height: height,
        width: width,
        collision: function () { },
        collision_x: function (move_x) { },
        collision_y: function () { }
    }
    switch (object.type) {
        case "coin":
            object.collision = function () {
                System.objects.splice(object.place, 1);
                for (let n = object.place; n < System.objects.length; n++) {
                    System.objects[n].place--;
                }
            }
            break;
        case "plateform":
            object.collision_x = function (move_x) {
                if (move_x > 0) {
                    System.character.x = object.x - System.character.width;
                }
                else if (move_x < 0) {
                    System.character.x = object.x + object.width;
                }
            }
            object.collision_y = function () {
                if (System.character.move_y > 0) {
                    System.character.y = object.y - System.character.height;
                    System.character.can_jump = true;
                    System.character.move_y = 0;
                }
                else if (System.character.move_y < 0) {
                    System.character.y = object.y + object.height;
                    System.character.move_y = 0;
                }
            }
            break;
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
    let listObject = [];
    for (let n = 0; n < System.objects.length; n++) {
        listObject.push(System.objects[n]);
    }

    let move_x = 0;
    if (System.character.left) {
        move_x -= 2;
    }
    if (System.character.right) {
        move_x += 2;
    }
    System.character.x += move_x;
    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(System.character, listObject[n])) {
            listObject[n].collision_x(move_x);
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
    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(System.character, listObject[n])) {
            listObject[n].collision_y();
        }
    }

    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(System.character, listObject[n])) {
            listObject[n].collision();
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

function checkCollision(object1, object2) {
    if (object1.x + object1.width > object2.x && object1.x < object2.x + object2.width && object1.y + object1.height > object2.y && object1.y < object2.y + object2.height) {
        return true;
    }
}