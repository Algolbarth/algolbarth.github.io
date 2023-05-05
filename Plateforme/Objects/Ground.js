function newGround(x, y, width, height) {
    let ground = newObject("ground", x, y, width, height);
    ground.collision_x = function (object, move_x) {
        if (move_x > 0) {
            object.x = ground.x - object.width;
            if (object.nature == "entity") {
                object.move_x = -move_x;
            }
        }
        else if (move_x < 0) {
            object.x = ground.x + ground.width;
            if (object.nature == "entity") {
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
        ctx.fillStyle = "#D2691E";
        ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
        ctx.fillStyle = "#32CD32";
        ctx.fillRect(ground.x, ground.y, ground.width, 10);
        ctx.beginPath();
        for (let n = 0; n < ground.width/25; n++) {
            ctx.moveTo(ground.x + n*25, ground.y + 10);
            ctx.lineTo(ground.x + n*25 + 12.5, ground.y + 20);
            ctx.lineTo(ground.x + n*25 + 25, ground.y + 10);
        }
        ctx.fill();
        ctx.closePath();
    }
    System.objects.push(ground);
}