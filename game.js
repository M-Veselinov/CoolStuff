
var stage;
var canvas;

var preloader;
var manifest;


var rockets = [];

var player;


function Main() {
    canvas = document.getElementById('demoCanvas');
    stage = new createjs.Stage(canvas);

    stage.mouseEventsEnable = true;

    manifest = [
        {src:'explosion.png', id:'explosion'},
        {src:'rocket.png', id:'rocket'},
        {src:'sniperfixed.png', id:'sniper'}
    ];
    startPreload();
}
// Loading needed assets
function startPreload() {
    preloader = new createjs.LoadQueue(true);
    preloader.on("complete", showStartMenu);
    preloader.loadManifest(manifest);
}

// Load start menu
function showStartMenu () {
    var background = new createjs.Shape();
    background.graphics.beginFill('#252729').drawRect(0, 0, 1000, 650);
    stage.addChild(background);
    var border = new createjs.Shape();
    border.graphics.beginFill('#333638').drawRoundRect(200, 100, 600, 450, 25);
    stage.addChild(border);
    var container = new createjs.Shape();
    container.graphics.beginFill('#3e4144').drawRoundRect(215, 115, 570, 420, 20);
    stage.addChild(container);
    var cont = new createjs.Container();
    var button = new createjs.Shape();
    button.graphics.beginFill('#8bc558').drawRoundRect(400, 270, 200, 60, 10);
    stage.addChild(button);
    cont.addChild(button);
    var btnText = new createjs.Text('Start Game', '33px Arial', '#fff');
    btnText.x = 415;
    btnText.y = 280;
    cont.addChild(btnText);
    stage.addChild(cont);
    button.addEventListener('click', showGameView);
    stage.update();
}

// Used to set speed of the objects
createjs.DisplayObject.prototype.setPPS = function(x, y) {
    this.vX = Math.round(x / createjs.Ticker.getFPS());
    this.vY = Math.round(y / createjs.Ticker.getFPS());
    this.ppmsX = x / 1000;
    this.ppmsY = y / 1000;
};

// Used to calculate time needed to move from one destination to another
createjs.DisplayObject.prototype.travelTime = function(x, y) {
    var distX = Math.abs(x - this.x);
    var distY = Math.abs(y - this.y);
    var duration = Math.max(distX / this.ppmsX, distY / this.ppmsY);
    return duration;
};



function showGameView () {
    // Remove canvas context menu on mouse right click
    $('body').on('contextmenu', '#demoCanvas', function(e){ return false; });

    // Create and draw canvas background
    var back = new createjs.Shape();
    back.graphics.beginFill('#252729').drawRect(0, 0, 1000, 650);
    stage.addChild(back);

    // Create player SpriteSheet
    var spriteSheet = new createjs.SpriteSheet({
        'images': [preloader.getResult('sniper')],
        'frames': {'height': 60, 'width': 54, 'count': 7},
        'animations': {
            'stand': [0],
            'run': [0,6]
        }
    });
    player = new createjs.Sprite(spriteSheet);
    player.width = 54;
    player.height = 60;
    player.x = 50;
    player.y = 50;
    player.rotation = 180;
    player.setPPS(175, 175);
    stage.addChild(player);
    stage.on('mousedown', playerAction);
    stage.on('stagemousemove', playerFaceMousePointer);
    stage.setFPS(80);
}

// Set player object direction to be facing mouse pointer
function playerFaceMousePointer (e) {
    var mouseLocation = {
        x: e.stageX,
        y: e.stageY
    };
    var angle = Math.atan2(player.x - mouseLocation.x, -(player.y - mouseLocation.y))*(180/Math.PI);
    player.rotation = angle;
    stage.update();
}

function playerAction(e) {
    // Moving the player on mouse right click
    if(e.nativeEvent.button == 2) {
        var mouseLocation = {
            x: e.stageX - (player.width / 2),
            y: e.stageY - (player.height / 2)
        };
        var travelDuration = player.travelTime(mouseLocation.x, mouseLocation.y);
        createjs.Tween.get(player, {override: true})
            .to(mouseLocation, travelDuration)
            .call(function () { player.gotoAndStop('stand'); });

        player.gotoAndPlay('run');
        createjs.Ticker.addEventListener('tick', tickHandler);
    }

    // Shooting on mouse left click
    else if (e.nativeEvent.button != 2) {
        var spriteSheet = new createjs.SpriteSheet({
            'images': [preloader.getResult('rocket')],
            'frames': {'height': 45, 'width': 26},
            'animations': {
                'fly': [0,3,1]
            }
        });
        var explosionSpritesheet = new createjs.SpriteSheet({
            'images': [preloader.getResult('explosion')],
            'frames': {'height' : 120, 'width': 80},
            'animations': {
                'explode': [0,6, false]
            }
        });
        var explosion = new createjs.Sprite(explosionSpritesheet);
        explosion.speed = 2;
        explosion.width = 80;
        explosion.height = 120;
        function handleAnimationEnd(event) {
            if (event.name == "explode") { // For example
                event.remove();
                stage.removeChild(explosion);
            }
        }

        var rocket = new createjs.Sprite(spriteSheet);
        rockets.push(rocket);
        rocket.width = 26;
        rocket.height = 45;
        rocket.x = player.x;
        rocket.y = player.y;

        var mouseLocation = {
            x: e.stageX - (rocket.width / 2),
            y: e.stageY - (rocket.height / 2)
        };
        createjs.Tween.get(rocket, {override: true})
            .to(mouseLocation,500)
            .call(function () {
                stage.removeChild(rocket);
                explosion.x = rocket.x - (explosion.width / 2);
                explosion.y = rocket.y - (explosion.height / 2);
                stage.addChild(explosion);
                explosion.gotoAndPlay('explode');
                explosion.on("animationend", handleAnimationEnd);
            });

        var angle = Math.atan2(player.x - mouseLocation.x, -(player.y - mouseLocation.y))*(180/Math.PI);
        rocket.rotation = angle;
        rocket.gotoAndPlay('fly');
        stage.addChild(rocket);
        stage.update();
    }
}



function tickHandler (e) {
    stage.update();
}


