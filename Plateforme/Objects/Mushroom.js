function newMushroom(x, y) {
    let mushroom = newObject("mushroom", x, y, 60, 60);
    mushroom.collision = function (object) {
        if (object == System.character) {
            removeObject(mushroom);
            if (object.height == 70) {
                object.height = 100;
                object.y -= 30;
            }
        }
    }
    mushroom.draw = function (ctx) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(mushroom.x, mushroom.y, 60, 40);
        ctx.fillStyle = "#EEE8AA";
        ctx.fillRect(mushroom.x + 10, mushroom.y + 40, 40, 20);
    }
    System.objects.push(mushroom);
}