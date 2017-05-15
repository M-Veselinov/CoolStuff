/**
 * Copyright Qnext Inc. 2002-2017
 * http://www.qnext.com
 * Date: 5/15/2017
 * Time: 1:35 PM
 * Author Mario Veselinov (mariov@qnext.com)
 */

function Seed(x, y) {
    this.anchor = createVector(x, y);
    this.pos = this.anchor.copy();
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.excited = false;
    this.type = "seed";

    this.update = function () {
        var wx, wy;
        var wiggle = 150;

        wx = noise(this.noiseOffsetX + (frameCount / 1000));
        wy = noise(this.noiseOffsetY + (frameCount / 1000));

        this.pos.x = this.anchor.x + map(wx, 0, 1, -wiggle, wiggle);
        this.pos.y = this.anchor.y + map(wy, 0, 1, -wiggle, wiggle);

        this.excited = dist(mouseX, mouseY, this.pos.x, this.pos.y) <= 100;
    }

    this.show = function () {
        noStroke();
        fill(255);

        ellipse(this.pos.x, this.pos.y, 5, 5);
    }
}