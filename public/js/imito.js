var width = document.documentElement.clientWidth,
    height = window.innerHeight,
    game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update,  }, false, false),
    active = false,
    guessing = false,
    showing = false,
    slots = [];

function preload() {
    game.load.spritesheet('1', 'assets/S1.png', 200, 200);
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
    
}

function update() {

}

function getSlots() {
    var totalSlots = 5,
        slotSize = 210,
        gapSize = 30,
        gaps = totalSlots - 1,
        size = (totalSlots * slotSize) + (gaps * gapSize),
        startingXPos = (width - size) / 2,
        startingYPos = (height - slotSize)  / 2 - 110,
        i = 0;
    
    for (i; i < totalSlots; i++) {
        var x = startingXPos + (i * (slotSize + gapSize));
        slots[i] = { x: x, y: startingYPos };
    }
    
        
}