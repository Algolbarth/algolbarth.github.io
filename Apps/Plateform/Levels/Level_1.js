function level_1() {
    System.background_color = "#AFEEEE";
    System.level_width = 9000;
    System.level_height = 1500;
    System.character.x = 100;
    System.character.y = 1150;
    initCamera(1000);

    newGround(0, 1350, 2000, 250);
    newCoinBrick(250, 1200);
    newThunder(255, 1170);
    newBrick(350, 1200);
    newMushroom(355, 1170);
    newCoinBrick(390, 1200);
    newGoumba(500, 1310);

    newGround(600, 1300, 150, 105);
    for (let n=0;n<3;n++) {
        newCoin(550 + 35*n, 1220 - 20*n);
    }
    newGround(750, 1225, 150, 155);
    for (let n=0;n<3;n++) {
        newCoin(700 + 35*n, 1150 - 20*n);
    }
    newCoinBrick(850, 1075);

    for (let n=0;n<2;n++) {
        newBrick(1050 + 80*n, 1200);
    }
    newCoinBrick(1090, 1200);
    newCoinBrick(1090, 1075);

    newGround(1300, 1300, 200, 105);
    for (let n=0;n<2;n++) {
        newCoin(1335 + 105*n, 1150);
        newCoin(1370 + 35*n, 1125);
    }
    newGoumba(1450, 1260);

    newPipe(1650, 1225, 400);
    newSpike(1850, 1325);
    newSpike(1875, 1325);
    for (let n=0;n<2;n++) {
        newCoin(2015 + 105*n, 1200);
        newCoin(2050 + 35*n, 1175);
    }

    newGround(2150, 1350, 850, 250);
    newSpike(2350, 1325);
    newSpike(2375, 1325);
    newBrick(2250, 1200);
    newMushroom(2255, 1170);
    for (let n=0;n<2;n++) {
        newBrick(2500 + 80*n, 1200);
    }
    newCoinBrick(2540, 1200);
    for (let n=0;n<2;n++) {
        newCoinBrick(2750 + 40*n, 1200);
    }
    for (let n=0;n<2;n++) {
        newCoin(3015 + 105*n, 1200);
        newCoin(3050 + 35*n, 1175);
    }

    newGround(3150, 1350, 2000, 250);
    newPipe(3300, 1225, 400);
    for (let n=0;n<3;n++) {
        newCoin(3400 + 35*n, 1080 - 20*n);
    }
    for (let n=0;n<5;n++) {
        newBrick(3500 + 40*n, 1125);
    }
    for (let n=0;n<2;n++) {
        newBrick(3900 + 40*n, 1200);
    }
    newCoinBrick(3980, 1200);
    newPlateform(4020, 1200, 120);
    for (let n=0;n<3;n++) {
        newCoin(4027 + 40*n, 1170);
    }
    newCoinBrick(4140, 1200);
    for (let n=0;n<2;n++) {
        newBrick(4180 + 40*n, 1200);
    }
    for (let n=0;n<3;n++) {
        newBrick(4020 + 40*n, 1075);
    }
    newGoumba(3400, 1260);
    newGoumba(4360, 1260);
    newPipe(4400, 1225, 400);
    newSpike(4550, 1325);
    newSpike(4575, 1325);
    for (let n=0;n<3;n++) {
        newCoinBrick(4700 + 140*n, 1200);
    }
    for (let n=0;n<2;n++) {
        newCoin(5165 + 105*n, 1200);
        newCoin(5200 + 35*n, 1175);
    }

    newGround(5300, 1350, 1400, 250);
    newSpike(5400, 1325);
    newSpike(5425, 1325);
    newGoumba(5500, 1260);
    newBrick(5550, 1200);
    newMushroom(5555, 1170);
    newGround(5800, 1300, 150, 105);
    newGround(5950, 1225, 150, 155);
    newPlateform(6100, 1225, 150);
    newGround(6250, 1225, 300, 155);
    newCoinBrick(6400, 1075);
    newGround(6550, 1300, 150, 105);
    for (let n=0;n<2;n++) {
        newCoin(6715 + 105*n, 1150);
        newCoin(6750 + 35*n, 1125);
    }

    newGround(6850, 1350, 1000, 250);
    newSpike(6950, 1325);
    newSpike(6975, 1325);
    newPipe(7150, 1225, 400);
    for (let n=0;n<4;n++) {
        newBrick(7350 + 40*n, 1125);
    }
    newCoinBrick(7470, 1125);
    newGoumba(7500, 1260);
    newSpike(7650, 1325);
    newSpike(7675, 1325);
    for (let n=0;n<2;n++) {
        newCoin(7865 + 105*n, 1200);
        newCoin(7900 + 35*n, 1175);
    }

    newGround(8000, 1350, 2000, 250);
    newSpike(8100, 1325);
    newSpike(8125, 1325);
    for (let n=0;n<2;n++) {
        newBrick(8200 + 40*n, 1200);
    }
    newCoinBrick(8280, 1200);
    newGoumba(8500, 1260);
    newFlag(8800, 850);
}