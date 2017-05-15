/**
 * Copyright Qnext Inc. 2002-2017
 * http://www.qnext.com
 * Date: 5/15/2017
 * Time: 1:35 PM
 * Author Mario Veselinov (mariov@qnext.com)
 */

function Particle(seed) {
    this.anchor = seed.pos;
    this.pos = this.anchor.copy();
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.seed = seed;
    this.type = "particle";

    this.update = function () {
        var wx, wy;
        var wiggle = 300;

        wx = noise(this.noiseOffsetX + (frameCount / 500));
        wy = noise(this.noiseOffsetY + (frameCount / 500));

        this.pos.x = this.anchor.x + map(wx, 0, 1, -wiggle, wiggle);
        this.pos.y = this.anchor.y + map(wy, 0, 1, -wiggle, wiggle);

    }

    this.show = function () {
        if (!this.visible()) {
            return;
        }
        noStroke();
        fill(255);

        ellipse(this.pos.x, this.pos.y, 5, 5);
    }

    this.visible = function () {
        return this.seed.excited;
    }
}