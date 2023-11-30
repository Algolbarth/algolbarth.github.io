function newCharacter() {
    let character = {
        nature: "character",
        x: 0,
        y: 0,
        height: 35,
        width: 25,
        speed: 3,
        jumping: false,
        left: false,
        right: false,
        can_jump: false,
        move_y: 10,
        immune: 0,
        type: "little"
    }
    return character;
}

function drawCharacter() {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        switch (System.character.type) {
            case "little":
                ctx.fillStyle = "#EE0000";
                ctx.fillRect(System.character.x + 3, System.character.y, 20, 5);
                ctx.fillRect(System.character.x, System.character.y + 15, 25, 15);
                ctx.fillStyle = "#FFE4B5";
                ctx.fillRect(System.character.x + 3, System.character.y + 5, 20, 10);
                ctx.fillStyle = "#1E90FF";
                ctx.fillRect(System.character.x + 5, System.character.y + 15, 15, 8);
                ctx.fillStyle = "#A0522D";
                ctx.fillRect(System.character.x, System.character.y + 30, 10, 5);
                ctx.fillRect(System.character.x + 15, System.character.y + 30, 10, 5);
                break;
            case "tall":
                ctx.fillStyle = "#EE0000";
                ctx.fillRect(System.character.x + 3, System.character.y, 20, 5);
                ctx.fillRect(System.character.x, System.character.y + 15, 25, 30);
                ctx.fillStyle = "#FFE4B5";
                ctx.fillRect(System.character.x + 3, System.character.y + 5, 20, 10);
                ctx.fillStyle = "#1E90FF";
                ctx.fillRect(System.character.x + 5, System.character.y + 15, 15, 8);
                ctx.fillStyle = "#A0522D";
                ctx.fillRect(System.character.x, System.character.y + 45, 10, 5);
                ctx.fillRect(System.character.x + 15, System.character.y + 45, 10, 5);
                break;
            case "speed":
                ctx.fillStyle = "#DDDD00";
                ctx.fillRect(System.character.x + 3, System.character.y, 20, 5);
                ctx.fillRect(System.character.x, System.character.y + 15, 25, 30);
                ctx.fillStyle = "#FFE4B5";
                ctx.fillRect(System.character.x + 3, System.character.y + 5, 20, 10);
                ctx.fillStyle = "#1E90FF";
                ctx.fillRect(System.character.x + 5, System.character.y + 15, 15, 8);
                ctx.fillStyle = "#A0522D";
                ctx.fillRect(System.character.x, System.character.y + 45, 10, 5);
                ctx.fillRect(System.character.x + 15, System.character.y + 45, 10, 5);
                break;
        }
    }
}

function moveCharacter() {
    let listObject = [];
    for (let n = 0; n < System.objects.length; n++) {
        listObject.push(System.objects[n]);
    }
    let listEntity = [];
    for (let n = 0; n < System.entities.length; n++) {
        listEntity.push(System.entities[n]);
    }

    let move_x = 0;
    if (System.character.left) {
        move_x -= System.character.speed;
    }
    if (System.character.right) {
        move_x += System.character.speed;
    }
    System.character.x += move_x;
    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(System.character, listObject[n])) {
            listObject[n].collision_x(System.character, move_x);
        }
    }
    for (let n = 0; n < listEntity.length; n++) {
        if (checkCollision(System.character, listEntity[n])) {
            listEntity[n].collision_x(System.character, move_x);
        }
    }
    if (System.character.x < 0) {
        System.character.x = 0;
    }
    else if (System.character.x + System.character.width > System.level_width) {
        System.character.x = System.level_width - System.character.width;
    }

    if (System.character.jumping && System.character.can_jump) {
        System.character.can_jump = false;
        System.character.move_y = -12;
    }
    System.character.move_y += System.gravity;
    System.character.y += System.character.move_y;
    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(System.character, listObject[n])) {
            listObject[n].collision_y(System.character);
        }
    }
    for (let n = 0; n < listEntity.length; n++) {
        if (checkCollision(System.character, listEntity[n])) {
            listEntity[n].collision_y(System.character);
        }
    }
    if (System.character.y > System.level_height) {
        death();
    }

    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(System.character, listObject[n])) {
            listObject[n].collision(System.character);
        }
    }
    for (let n = 0; n < listEntity.length; n++) {
        if (checkCollision(System.character, listEntity[n])) {
            listEntity[n].collision(System.character);
        }
    }
}

function damage() {
    if (System.character.immune == 0) {
        if (System.character.type != "little") {
            System.character.height = 35;
            System.character.y += 15;
            System.character.speed = 3;
            System.character.type = "little";
            System.character.immune = 150;
        }
        else {
            death();
        }
    }
}

function death() {
    cancelAnimationFrame(System.animation);
    demarrage();
}

function keyUpHandler(e) {
    if (e.keyCode == 37) {
        System.character.left = false;
    }
    if (e.keyCode == 39) {
        System.character.right = false;
    }
    if (e.keyCode == 38) {
        System.character.jumping = false;
    }
    if (e.keyCode == 40) {
        System.character.fall = false;
    }
}

function keyDownHandler(e) {
    if (e.keyCode == 37) {
        System.character.left = true;
    }
    if (e.keyCode == 39) {
        System.character.right = true;
    }
    if (e.keyCode == 38) {
        System.character.jumping = true;
    }
    if (e.keyCode == 40) {
        System.character.fall = true;
    }
}

function initCamera(y) {
    System.camera.y = y;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.translate(0, -y);
}

function fixCamera() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let move_x = 0;
    if (System.character.left) {
        move_x -= System.character.speed;
    }
    if (System.character.right) {
        move_x += System.character.speed;
    }
    if ((move_x > 0 && System.character.x + System.character.width / 2 + canvas.width / 2 > System.camera.x + System.camera.width) || (move_x < 0 && System.character.x - System.character.width / 2 - canvas.width / 2 < System.camera.x)) {
        System.camera.x += move_x;
        ctx.translate(-move_x, 0);
    }
    if (System.camera.x < 0) {
        ctx.translate(System.camera.x, 0);
        System.camera.x = 0;
    }
    else if (System.camera.x + System.camera.width > System.level_width) {
        ctx.translate(System.camera.x + System.camera.width - System.level_width, 0);
        System.camera.x = System.level_width - System.camera.width;
    }

    if ((System.character.move_y > 0 && System.character.y + System.character.height / 2 + canvas.height / 2 > System.camera.y + System.camera.height) || (System.character.move_y < 0 && System.character.y - System.character.height / 2 - canvas.height / 2 < System.camera.y)) {
        System.camera.y += System.character.move_y;
        ctx.translate(0, -System.character.move_y);
    }
    if (System.camera.y < 0) {
        ctx.translate(0, System.camera.y);
        System.camera.y = 0;
    }
    else if (System.camera.y + System.camera.height > System.level_height) {
        ctx.translate(0, System.camera.y + System.camera.height - System.level_height);
        System.camera.y = System.level_height - System.camera.height;
    }
}