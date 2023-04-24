function newGround(x, y, width, height) {
    let ground = newObject("ground", x, y, width, height);
    ground.collision_x = function (object, move_x) {
        if (move_x > 0) {
            object.x = ground.x - object.width;
            if (object.nature == "ennemy") {
                object.move_x = -move_x;
            }
        }
        else if (move_x < 0) {
            object.x = ground.x + ground.width;
            if (object.nature == "ennemy") {
                object.move_x = -move_x;
            }
        }
    }
    ground.collision_y = function (object) {
        if (object.move_y > 0) {
            object.y = ground.y - object.height;
            object.can_jump = true;
            object.move_y = 0;
        }
        else if (object.move_y < 0) {
            object.y = ground.y + ground.height;
            object.move_y = 0;
        }
    }
    ground.draw = function (ctx) {
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
        ctx.fillStyle = "#008000";
        ctx.fillRect(ground.x, ground.y, ground.width, 10);
    }
    System.objects.push(ground);
}