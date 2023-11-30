function newThunder(x, y) {
    let thunder = newEntity("thunder", x, y, 30, 30);
    thunder.collision = function (object) {
        if (object == System.character && object.type != "speed" ) {
            removeEntity(thunder);
            object.type = "speed";
            object.speed = 5;
            if (object.height == 35) {
                object.height = 50;
                object.y -= 15;
            }
        }
    }
    thunder.draw = function (ctx) {
        ctx.fillStyle = "#FFFF00";
        ctx.beginPath();
        ctx.moveTo(thunder.x + 15, thunder.y);
        ctx.lineTo(thunder.x + 5, thunder.y + 15);
        ctx.lineTo(thunder.x + 20, thunder.y + 15);
        ctx.lineTo(thunder.x + 10, thunder.y + 30);
        ctx.lineTo(thunder.x + 30, thunder.y + 10);
        ctx.lineTo(thunder.x + 20, thunder.y + 10);
        ctx.lineTo(thunder.x + 25, thunder.y);
        ctx.fill();
        ctx.closePath();
    }
    System.entities.push(thunder);
}