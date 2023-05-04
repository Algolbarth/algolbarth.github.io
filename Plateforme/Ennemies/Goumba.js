function newGoumba (x, y) {
    let goumba = newEnnemy("goumba", x, y, 40, 40);
    goumba.move_x = -0.5;
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
        ctx.fillRect(goumba.x, goumba.y, 40, 30);
        ctx.fillStyle = "#FFE4B5";
        ctx.fillRect(goumba.x + 10, goumba.y + 30, 20, 10);
        ctx.fillStyle = "#000000";
        ctx.fillRect(goumba.x, goumba.y + 32.5, 15, 7.5);
        ctx.fillStyle = "#000000";
        ctx.fillRect(goumba.x + 25, goumba.y + 32.5, 15, 7.5);
    }
    System.ennemies.push(goumba);
}