function newEntity (type, x, y, width, height) {
    let entity = {
        nature: "entity",
        place: System.entities.length,
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
    return entity;
}

function moveEntity(entity) {
    let listObject = [];
    for (let n = 0; n < System.objects.length; n++) {
        listObject.push(System.objects[n]);
    }
    let listEntity = [];
    for (let n = 0; n < System.entities.length; n++) {
        if (n != entity.place) {
            listEntity.push(System.entities[n]);
        }
    }

    entity.x += entity.move_x;
    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(entity, listObject[n])) {
            listObject[n].collision_x(entity, entity.move_x);
        }
    }
    for (let n = 0; n < listEntity.length; n++) {
        if (checkCollision(entity, listEntity[n])) {
            listEntity[n].collision_x(entity, entity.move_x);
        }
    }
    if (entity.x + entity.width < 0) {
        removeEntity(entity);
    }
    else if (entity.x > System.level_width) {
        removeEntity(entity);
    }

    entity.move_y += System.gravity;
    entity.y += entity.move_y;
    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(entity, listObject[n])) {
            listObject[n].collision_y(entity);
        }
    }
    for (let n = 0; n < listEntity.length; n++) {
        if (checkCollision(entity, listEntity[n])) {
            listEntity[n].collision_y(entity);
        }
    }
    if (entity.y > System.level_height) {
        removeEntity(entity);
    }

    for (let n = 0; n < listObject.length; n++) {
        if (checkCollision(entity, listObject[n])) {
            listObject[n].collision(entity);
        }
    }
    for (let n = 0; n < listEntity.length; n++) {
        if (checkCollision(entity, listEntity[n])) {
            listEntity[n].collision(entity);
        }
    }
}

function drawEntity(entity) {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        entity.draw(ctx);
    }
}

function removeEntity (entity) {
    System.entities.splice(entity.place, 1);
    for (let n = entity.place; n < System.entities.length; n++) {
        System.entities[n].place--;
    }
}