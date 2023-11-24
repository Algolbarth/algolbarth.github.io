function newPipe(x, y, height) {
    let pipe = newObject("pipe", x, y, 100, height);
    pipe.collision_x = function (object, move_x) {
        if (move_x > 0) {
            object.x = pipe.x - object.width;
            if (object.nature == "entity") {
                object.move_x = -move_x;
            }
        }
        else if (move_x < 0) {
            object.x = pipe.x + pipe.width;
            if (object.nature == "entity") {
                object.move_x = -move_x;
            }
        }
    }
    pipe.collision_y = function (object) {
        if (object.move_y > 0) {
            object.y = pipe.y - object.height;
            object.can_jump = true;
            object.move_y = 0;
        }
        else if (object.move_y < 0) {
            object.y = pipe.y + pipe.height;
            object.move_y = 0;
        }
    }
    pipe.draw = function (ctx) {
        ctx.fillStyle = "#228B22";
        ctx.fillRect(pipe.x, pipe.y, 100, pipe.height);
        ctx.fillRect(pipe.x - 10, pipe.y, 120, 20);
        ctx.fillStyle = "#006400";
        ctx.fillRect(pipe.x, pipe.y + 20, 100, 10);
    }
    System.objects.push(pipe);
}