function level_1 () {
    System.background_color = "	#AFEEEE";
    newPlateform(0, 700, 2000, 500);
    newPlateform(500, 500, 500, 50);
    newPlateform(1000, 500, 500, 250);
    for (let n = 0; n < 5; n++) {
        newCoin(1025 + 100 * n, 400);
    }
    for (let n = 0; n < 5; n++) {
        newCoin(525 + 100 * n, 600);
    }
    newMushroom(750, 440);
}