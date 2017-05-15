/**
 * Copyright Qnext Inc. 2002-2017
 * http://www.qnext.com
 * Date: 5/15/2017
 * Time: 1:31 PM
 * Author Mario Veselinov (mariov@qnext.com)
 */

var particles = [];
var edges = [];

var maxConnectionDistance = 400;
function setup () {
    createCanvas(1800, 1000);
    background(0);
    var i;
    for (i = 0; i < 300; i++) {
        var seed = new Seed(random(width), random(height));
        particles.push(seed);

        var particleCount = random(2, 3);
        for (var j = 0;j < particleCount; j++) {
            particles.push(new Particle(seed))
        }
    }

    var conMap = [];

    for (i = 0; i < particles.length; i++) {
        conMap.push([]);
        for (var j = 0; j < particles.length; j++) {
            conMap[i].push(false);
        }
    }

    for (i = 0; i < particles.length; i++) {
        for (var j = 0; j < particles.length; j++) {
            if (particles[i] === particles[j]) {
                continue;
            }
            if (conMap[i][j] === true || conMap[j][i] === true) {
                continue;
            }
            if (distSq(particles[i], particles[j]) >= maxConnectionDistance * maxConnectionDistance) {
                continue;
            }

            edges.push(new Edge(particles[i], particles[j]));
            conMap[i][j] = conMap[j][i] = true;
        }
    }
}

function draw () {
    background(51);
    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    for (var i = 0; i < edges.length; i++) {
        edges[i].show();
    }
    for (var i = 0; i < particles.length; i++) {
        particles[i].show();
    }

}

function distSq(p1, p2) {
    var a1 = p1.anchor;
    var a2 = p2.anchor;

    var dx = a1.x - a2.x;
    var dy = a1.y - a2.y;

    return dx * dx + dy * dy;
}