function newSpike(x, y) {
    let spike = newObject("spike", x, y, 25, 25);
    spike.collision_x = function (object, move_x) {
        if (move_x > 0) {
            object.x = spike.x - object.width;
            if (object.nature == "entity") {
                object.move_x = -move_x;
            }
        }
        else if (move_x < 0) {
            object.x = spike.x + spike.width;
            if (object.nature == "entity") {
                object.move_x = -move_x;
            }
        }
        if (object == System.character) {
            damage();
        }
    }
    spike.collision_y = function (object) {
        if (object.move_y > 0) {
            object.y = spike.y - object.height;
            object.can_jump = true;
            object.move_y = 0;
        }
        else if (object.move_y < 0) {
            object.y = spike.y + spike.height;
            object.move_y = 0;
        }
        if (object == System.character) {
            damage();
        }
    }
    spike.collision = function () {
        
    }
    spike.draw = function (ctx) {
        ctx.fillStyle = "#808080";
        ctx.beginPath();
        ctx.moveTo(spike.x, spike.y + spike.height);
        ctx.lineTo(spike.x + spike.width/2, spike.y);
        ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
        ctx.fill();
        ctx.closePath();
    }
    System.objects.push(spike);
}