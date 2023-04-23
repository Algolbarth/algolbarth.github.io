function newMushroom(x, y) {
    let mushroom = newObject("mushroom", x, y, 60, 60);
    mushroom.collision = function () {
        System.objects.splice(mushroom.place, 1);
        for (let n = mushroom.place; n < System.objects.length; n++) {
            System.objects[n].place--;
        }
        if (System.character.height == 70) {
            System.character.height = 100;
            System.character.y -= 30;
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