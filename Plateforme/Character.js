function newCharacter(x, y) {
    let character = {
        x: x,
        y: y,
        height: 70,
        width: 50,
        jumping: false,
        left: false,
        right: false,
        can_jump: false,
        move_y: 1
    }
    return character;
}

function drawCharacter() {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = "#EE0000";
        ctx.fillRect(System.character.x, System.character.y, System.character.width, System.character.height);
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