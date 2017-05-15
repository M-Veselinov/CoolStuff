/**
 * Copyright Qnext Inc. 2002-2017
 * http://www.qnext.com
 * Date: 5/15/2017
 * Time: 1:58 PM
 * Author Mario Veselinov (mariov@qnext.com)
 */
function Edge (p1, p2) {

    this.p1 = p1;
    this.p2 = p2;

    this.show = function () {

        if (this.p1.type == "particle" && !this.p1.visible()) {
            return;
        }
        if (this.p2.type == "particle" && !this.p2.visible()) {
            return;
        }

        var d = distSq(this.p1, this.p2);

        if (d > 200*200) {
            return;
        }

        var opacity = map(d, 0, 200*200, 100, 0);

        stroke(255, 255, 255, opacity);

        line(this.p1.pos.x, this.p1.pos.y, this.p2.pos.x, this.p2.pos.y);
    }
}