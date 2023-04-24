function newObject(type, x, y, width, height) {
    let object = {
        nature: "object",
        place: System.objects.length,
        type: type,
        x: x,
        y: y,
        height: height,
        width: width,
        draw: function () { },
        collision: function () { },
        collision_x: function (move_x) { },
        collision_y: function () { }
    }
    return object;
}

function drawObject(object) {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        object.draw(ctx);
    }
}

function checkCollision(object1, object2) {
    if (object1.x + object1.width > object2.x && object1.x < object2.x + object2.width && object1.y + object1.height > object2.y && object1.y < object2.y + object2.height) {
        return true;
    }
}

function removeObject (object) {
    System.objects.splice(object.place, 1);
    for (let n = object.place; n < System.objects.length; n++) {
        System.objects[n].place--;
    }
}