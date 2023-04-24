function newGoumba (x, y) {
    let goumba = newEnnemy("goumba", x, y, 80, 80);
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
                removeEnnemy(goumba);
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
        ctx.fillRect(goumba.x, goumba.y, 80, 60);
        ctx.fillStyle = "#FFE4B5";
        ctx.fillRect(goumba.x + 20, goumba.y + 60, 40, 20);
        ctx.fillStyle = "#000000";
        ctx.fillRect(goumba.x, goumba.y + 65, 30, 15);
        ctx.fillStyle = "#000000";
        ctx.fillRect(goumba.x + 50, goumba.y + 65, 30, 15);
    }
    System.ennemies.push(goumba);
}