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
    types = ["1","2","3","4","5","6","7","8","9","10"],
    color = ["1","2","3","4","5","6","7","8","9","10"], //use sprite.tint to change color
    grabed;
 
function preload() {
    game.load.spritesheet('1', 'assets/S1.png', 200, 200); //only need shapes
    game.load.spritesheet('2', 'assets/S2.png', 200, 200);
    game.load.spritesheet('slot', 'assets/slot.png', 210, 210);
    getSlots();
}

function create() {
    game.stage.backgroundColor = '#2f2f2b';
    game.physics.startSystem(Phaser.Physics.P2JS);
    
    for (var i = 0; i < slots.length; i++) {
        game.add.sprite(slots[i].x, slots[i].y, 'slot')   
    }
    
    grabed = game.add.sprite(30, 30, '1')
    grabed.anchor.setTo(0.5, 0.5);
}

function update() {

}

function moveGrabbed(position, roll) {
    grabed.x = position[0] * width;
    grabed.y = (1-position[1]) * height;
    grabed.rotation = roll * -1;
}

Leap.loop(function (frame) {
    frame.hands.forEach(function(hand, index) {
        moveGrabbed(frame.interactionBox.normalizePoint(hand.palmPosition, true), hand.roll());
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
        startingYPos = (height - slotSize)  / 2,
        i = 0;
    
    for (i; i < totalSlots; i++) {
        var x = startingXPos + (i * (slotSize + gapSize));
        slots[i] = { x: x, y: startingYPos };
        shapes[i] = { x: x - 5, y: startingYPos - 5 };
    }    
        
}

Leap.loopController.setBackground(true)