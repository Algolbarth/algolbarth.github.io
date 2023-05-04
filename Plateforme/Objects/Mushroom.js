function newMushroom(x, y) {
    let mushroom = newObject("mushroom", x, y, 30, 30);
    mushroom.collision = function (object) {
        if (object == System.character && object.height == 35) {
            removeObject(mushroom);
            object.height = 50;
            object.y -= 15;
        }
    }
    mushroom.draw = function (ctx) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(mushroom.x, mushroom.y, 30, 20);
        ctx.fillStyle = "#EEE8AA";
        ctx.fillRect(mushroom.x + 5, mushroom.y + 20, 20, 10);
    }
    System.objects.push(mushroom);
}