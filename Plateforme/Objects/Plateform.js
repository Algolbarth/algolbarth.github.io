function newPlateform(x, y, width) {
    let plateform = newObject("plateform", x, y, width, 10);
    plateform.collision_y = function (object) {
        if (object.move_y > 0) {
            if (!object.fall && object == object) {
                object.y = plateform.y - object.height;
                object.can_jump = true;
                object.move_y = 0;
            }
        }
    }
    plateform.draw = function (ctx) {
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(plateform.x, plateform.y, plateform.width, 10);
        ctx.fillStyle = "#000000";
        for (let n = 1; n < plateform.width/20; n++) {
            ctx.fillRect(plateform.x + 20*n, plateform.y, 2, 10);
        }
    }
    System.objects.push(plateform);
}