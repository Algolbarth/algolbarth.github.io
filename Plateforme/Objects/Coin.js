function newCoin(x, y) {
    let coin = newObject("coin", x, y, 50, 50);
    coin.collision = function (object) {
        if (object == System.character) {
            removeObject(coin);
            System.score++;
        }
    }
    coin.draw = function (ctx) {
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(coin.x, coin.y, 50, 50);
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(coin.x + 20, coin.y + 10, 10, 30);
    }
    System.objects.push(coin);
}