function level_1() {
    System.background_color = "#AFEEEE";
    System.level_width = 10000;
    System.level_height = 1000;
    System.character.x = 200;
    System.character.y = 300;
    newGround(0, 700, 4000, 500);
    newBrick(500, 450);
    for (let n=0;n<2;n++) {
        newBrick(700 + 80*n, 450);
    }
    newMushroom(710, 390);
    newGoumba(1000, 620);
    newGround(1200, 600, 300, 210);
    newGround(1500, 450, 300, 310);
    newBrick(1700, 200);
    for (let n=0;n<3;n++) {
        newBrick(2100 + 80*n, 450);
    }
    newBrick(2180, 200);
    newGround(2600, 600, 400, 210);
    newGoumba(3000, 520);
    newGround(3300, 450, 200, 310);
    newSpike(3700, 650);
    newGround(4300, 700, 1700, 500);
    newSpike(4700, 650);
    newSpike(4750, 650);
    newBrick(4500, 450);
    for (let n=0;n<3;n++) {
        newBrick(5000 + 80*n, 450);
    }
    for (let n=0;n<2;n++) {
        newBrick(5500 + 80*n, 450);
    }
    newGround(6300, 700, 2700, 500);
    newGround(6600, 450, 200, 310);
    for (let n=0;n<5;n++) {
        newBrick(7000 + 80*n, 300);
    }
    for (let n=0;n<3;n++) {
        newBrick(7800 + 80*n, 450);
    }
    newPlateform(8040, 450, 240);
    for (let n=0;n<3;n++) {
        newBrick(8280 + 80*n, 450);
    }
    for (let n=0;n<3;n++) {
        newBrick(8040 + 80*n, 200);
    }
    newGround(8800, 450, 200, 310);
}