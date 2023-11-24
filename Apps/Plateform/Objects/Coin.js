function newCoin(x, y) {
    let coin = newObject("coin", x, y, 25, 25);
    coin.collision = function (object) {
        if (object == System.character) {
            removeObject(coin);
            System.coins++;
        }
    }
    coin.draw = function (ctx) {
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(coin.x, coin.y, 25, 25);
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(coin.x + 10, coin.y + 5, 5, 15);
    }
    System.objects.push(coin);
    System.max_coins++;
}