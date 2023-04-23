function newPlateform(x, y, width, height) {
    let plateform = newObject("plateform", x, y, width, height);
    plateform.collision_x = function (move_x) {
        if (move_x > 0) {
            System.character.x = plateform.x - System.character.width;
        }
        else if (move_x < 0) {
            System.character.x = plateform.x + plateform.width;
        }
    }
    plateform.collision_y = function () {
        if (System.character.move_y > 0) {
            System.character.y = plateform.y - System.character.height;
            System.character.can_jump = true;
            System.character.move_y = 0;
        }
        else if (System.character.move_y < 0) {
            System.character.y = plateform.y + plateform.height;
            System.character.move_y = 0;
        }
    }
    plateform.draw = function (ctx) {
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(plateform.x, plateform.y, plateform.width, plateform.height);
        ctx.fillStyle = "#008000";
        ctx.fillRect(plateform.x, plateform.y, plateform.width, 10);
    }
    System.objects.push(plateform);
}