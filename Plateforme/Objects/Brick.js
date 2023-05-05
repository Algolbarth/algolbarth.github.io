function newBrick(x, y) {
    let brick = newObject("brick", x, y, 40, 40);
    brick.collision_x = function (object, move_x) {
        if (move_x > 0) {
            object.x = brick.x - object.width;
            if (object.nature == "entity") {
                object.move_x = -move_x;
            }
        }
        else if (move_x < 0) {
            object.x = brick.x + brick.width;
            if (object.nature == "entity") {
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
            if (object.height == 50) {
                removeObject(brick);
            }
        }
    }
    brick.draw = function (ctx) {
        ctx.fillStyle = "#FF8C00";
        ctx.fillRect(brick.x, brick.y, 40, 40);
        ctx.fillStyle = "#000000";
        ctx.fillRect(brick.x, brick.y + 10, 40, 5);
        ctx.fillRect(brick.x, brick.y + 25, 40, 5);
        ctx.fillRect(brick.x + 10, brick.y, 5, 10);
        ctx.fillRect(brick.x + 25, brick.y + 15, 5, 10);
        ctx.fillRect(brick.x + 10, brick.y + 30, 5, 10);
    }
    System.objects.push(brick);
}

function newCoinBrick(x, y) {
    newCoin(x + 7, y + 7);
    newBrick(x, y);
}