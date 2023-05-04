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
    }
    System.objects.push(plateform);
}