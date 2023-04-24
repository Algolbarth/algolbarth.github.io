function newEnnemy (type, x, y, width, height) {
    let ennemy = {
        nature: "ennemy",
        place: System.ennemies.length,
        type: type,
        x: x,
        y: y,
        height: height,
        width: width,
        move_x: 0,
        move_y: 0,
        draw: function () { },
        collision: function () { },
        collision_x: function (move_x) { },
        collision_y: function () { }
    }
    return ennemy;
}

function moveEnnemy(ennemy) {
    let listObject = [];
    for (let n = 0; n < System.objects.length; n++) {
        listObject.push(System.objects[n]);
    }
    let listEnnemy = [];
    for (let n = 0; n < System.ennemies.length; n++) {
        if (n != ennemy.place) {
            listEnnemy.push(System.ennemies[n]);
        }
    }

    ennemy.x += ennemy.move_x;
    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(ennemy, listObject[n])) {
            listObject[n].collision_x(ennemy, ennemy.move_x);
        }
    }
    for (let n = 0; n < listEnnemy.length; n++) {
        if (checkCollision(ennemy, listEnnemy[n])) {
            listEnnemy[n].collision_x(ennemy, ennemy.move_x);
        }
    }
    if (ennemy.x + ennemy.width < 0) {
        removeEnnemy(ennemy);
    }
    else if (ennemy.x > System.level_width) {
        removeEnnemy(ennemy);
    }

    ennemy.move_y += System.gravity;
    ennemy.y += ennemy.move_y;
    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(ennemy, listObject[n])) {
            listObject[n].collision_y(ennemy);
        }
    }
    for (let n = 0; n < listEnnemy.length; n++) {
        if (checkCollision(ennemy, listEnnemy[n])) {
            listEnnemy[n].collision_y(ennemy);
        }
    }
    if (ennemy.y > System.level_height) {
        removeEnnemy(ennemy);
    }

    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(ennemy, listObject[n])) {
            listObject[n].collision(ennemy);
        }
    }
}

function drawEnnemy(ennemy) {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ennemy.draw(ctx);
    }
}

function removeEnnemy (ennemy) {
    System.ennemies.splice(ennemy.place, 1);
    for (let n = ennemy.place; n < System.ennemies.length; n++) {
        System.ennemies[n].place--;
    }
}