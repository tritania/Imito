var width = document.documentElement.clientWidth,
    height = window.innerHeight,
    game = new Phaser.Game(width, height, Phaser.AUTO, 'gamec', { preload: preload, create: create, update: update,  }, false, false),
    level = 0,
    active = false,
    guessing = false,
    showing = false,
    current,
    slots = [], //holds position of slots
    shapes = [], //position of shapes
    guess = [], //players guesses
    actual = [], //actual values
    color = ["0xFF0000","0x001EFF","0xFFDA00","0x067A29","0x931493"],
    grabed,
    shape,
    col = 0, 
    locked = true,
    selection = 100,
    frameCounter = 0,
    shapePicked = false;
 
function preload() {
    game.load.spritesheet('1', 'assets/circle.png', 400, 400); //only need shapes
    game.load.spritesheet('2', 'assets/hexagon.png', 400, 400);
    game.load.spritesheet('3', 'assets/octagon.png', 400, 400);
    game.load.spritesheet('4', 'assets/pentagon.png', 400, 400);
    game.load.spritesheet('5', 'assets/square.png', 400, 400);
    game.load.spritesheet('trash', 'assets/trash.png', 210, 210);
    game.load.spritesheet('color', 'assets/color.png', 200, 200);
    game.load.spritesheet('slot', 'assets/slot.png', 210, 210);
    getSlots();
}

function create() {
    game.stage.backgroundColor = '#2f2f2b';
    game.physics.startSystem(Phaser.Physics.P2JS);
    grabed = game.add.sprite(-3000, -3000, '1');
    
    for (var i = 0; i < slots.length; i++) {
        game.add.sprite(slots[i].x, slots[i].y, 'slot')   
    }
    
    game.add.sprite(slots[slots.length-1].x, slots[0].y + 240, 'trash');
    

}

function update() {

}

function moveGrabbed(position, roll) {
    grabed.x = position[0] * width;
    grabed.y = (1-position[1]) * height;
    grabed.rotation = roll * -1;
}

function addShape(type) {
    if (type == 0 && shape > 0) {
        shapePicked = true;  
    } else if (type <= 5 || type != 0) {
        shape = type;
        grabed.kill();
        grabed = game.add.sprite((width / 2), height - 250, type);
        grabed.width = 200;
        grabed.height = 200;
        grabed.anchor.setTo(0.5, 0.5);
    }
}

function addColor(type) {
    console.log(type);
    if (type == 0 && col != 0) {
        locked = false;
    } else if (type > 0 && type < 6) {
        col = type;
        type = type - 1;
        grabed.tint = color[type];
    }
}

Leap.loop(function (frame) {
    frame.hands.forEach(function(hand, index) {
        if (!locked) { //ready to be placed?
            moveGrabbed(frame.interactionBox.normalizePoint(hand.palmPosition, true), hand.roll());
        } else if (!shapePicked) { //pick a shape
            var extendedFingers = 0;
            for(var f = 0; f < hand.fingers.length; f++){
                var finger = hand.fingers[f];
                if(finger.extended) extendedFingers++;
            }
            if (selection == extendedFingers) {
                frameCounter++;   
                if (frameCounter == 25) {
                    addShape(extendedFingers);
                    selection = 100;
                    frameCounter = 0;
                }
            } else {
                selection = extendedFingers;   
                frameCounter = 0;
            }
        } else if (shapePicked) { //pick a color
            var extendedFingers = 0;
            for(var f = 0; f < hand.fingers.length; f++){
                var finger = hand.fingers[f];
                if(finger.extended) extendedFingers++;
            }
            if (selection == extendedFingers) {
                frameCounter++;   
                if (frameCounter == 25) {
                    addColor(extendedFingers);
                    frameCounter = 0;
                }
            } else {
                selection = extendedFingers;   
                frameCounter = 0;
            }
        }
    });
}).use('screenPosition', { scale: 0.25 });

function createPattern() {
    Math.floor((Math.random() * 10) + 0);
}

function getSlots() {
    var totalSlots = 5,
        slotSize = 210,
        gapSize = 30,
        gaps = totalSlots - 1,
        size = (totalSlots * slotSize) + (gaps * gapSize),
        startingXPos = (width - size) / 2,
        startingYPos = (height - slotSize - 200)  / 2,
        i = 0;
    
    for (i; i < totalSlots; i++) {
        var x = startingXPos + (i * (slotSize + gapSize));
        slots[i] = { x: x, y: startingYPos };
        shapes[i] = { x: x - 5, y: startingYPos - 5 };
    }    
        
}

Leap.loopController.setBackground(true)