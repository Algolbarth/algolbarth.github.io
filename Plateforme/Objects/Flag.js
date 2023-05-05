function newFlag(x, y) {
    poleFlag(x, y);
    baseFlag(x, y);
}

function baseFlag(x, y) {
    let baseflag = newObject("baseflag", x, y + 450, 50, 50);
    baseflag.collision_x = function (object, move_x) {
        if (move_x > 0) {
            object.x = baseflag.x - object.width;
            if (object.nature == "entity") {
                object.move_x = -move_x;
            }
        }
        else if (move_x < 0) {
            object.x = baseflag.x + baseflag.width;
            if (object.nature == "entity") {
                object.move_x = -move_x;
            }
        }
    }
    baseflag.collision_y = function (object) {
        if (object.move_y > 0) {
            object.y = baseflag.y - object.height;
            object.can_jump = true;
            object.move_y = 0;
        }
        else if (object.move_y < 0) {
            object.y = baseflag.y + baseflag.height;
            object.move_y = 0;
        }
    }
    baseflag.draw = function (ctx) {
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(baseflag.x, baseflag.y + 10, 50, 40);
        for (let n = 0; n < 3; n++) {
            ctx.fillRect(baseflag.x + n * 20, baseflag.y, 10, 10);
        }
    }
    System.objects.push(baseflag);
}

function poleFlag(x, y) {
    let poleflag = newObject("poleflag", x + 19, y, 12, 450);
    poleflag.draw = function (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(poleflag.x + 3, poleflag.y, 6, 450);
        ctx.fillRect(poleflag.x, poleflag.y, 12, 12);
    }
    poleflag.collision = function (object) {
        if (object.nature == "character") {
            finishLevel();
        }
    }
    System.objects.push(poleflag);
}