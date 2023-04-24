function newBrick(x, y) {
    let brick = newObject("brick", x, y, 80, 80);
    brick.collision_x = function (object, move_x) {
        if (move_x > 0) {
            object.x = brick.x - object.width;
            if (object.nature == "ennemy") {
                object.move_x = -move_x;
            }
        }
        else if (move_x < 0) {
            object.x = brick.x + brick.width;
            if (object.nature == "ennemy") {
                object.move_x = -move_x;
            }
        }
    }
    brick.collision_y = function (object) {
        if (object.move_y > 0) {
            object.y = brick.y - object.height;
            object.can_jump = true;
            object.move_y = 0;
        }
        else if (object.move_y < 0) {
            object.y = brick.y + brick.height;
            object.move_y = 0;
            if (object.height == 100) {
                removeObject(brick);
            }
        }
    }
    brick.draw = function (ctx) {
        ctx.fillStyle = "#FF8C00";
        ctx.fillRect(brick.x, brick.y, 80, 80);
        ctx.fillStyle = "#000000";
        ctx.fillRect(brick.x, brick.y + 20, 80, 10);
        ctx.fillRect(brick.x, brick.y + 50, 80, 10);
        ctx.fillRect(brick.x + 20, brick.y, 10, 20);
        ctx.fillRect(brick.x + 50, brick.y + 30, 10, 20);
        ctx.fillRect(brick.x + 20, brick.y + 60, 10, 20);
    }
    System.objects.push(brick);
}