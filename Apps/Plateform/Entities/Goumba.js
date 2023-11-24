function newGoumba (x, y) {
    let goumba = newEntity("goumba", x, y, 35, 35);
    goumba.move_x = -1;
    goumba.collision_x = function (object) {
        if (object.nature == "character") {
            damage();
        }
    }
    goumba.collision_y = function (object) {
        if (object.move_y > 0) {
            if (object.nature == "character") {
                object.y = goumba.y - object.height;
                object.can_jump = true;
                object.move_y = -6;
                removeEntity(goumba);
            }
        }
        else {
            if (object.nature == "character") {
                damage();
            }
        }
    }
    goumba.draw = function (ctx) {
        ctx.fillStyle = "#A0522D";
        ctx.fillRect(goumba.x, goumba.y, 35, 22);
        ctx.fillStyle = "#FFE4B5";
        ctx.fillRect(goumba.x + 5, goumba.y + 22, 25, 7);
        ctx.fillStyle = "#000000";
        ctx.fillRect(goumba.x, goumba.y + 29, 12, 6);
        ctx.fillRect(goumba.x + 23, goumba.y + 29, 12, 6);
    }
    System.entities.push(goumba);
}