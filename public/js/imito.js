var width = document.documentElement.clientWidth,
    height = window.innerHeight,
    game = new Phaser.Game(width, height, Phaser.AUTO, 'gamec', { preload: preload, create: create, update: update,  }, false, false),
    level = 0,
    active = false,
    guessing = false,
    showing = true,
    current,
    shown = [], //holds the sprite object for the intial display of the array
    slots = [], //holds position of slots
    guess = [], //players guesses
    actual = [], //actual values
    filled = [], //which slots have been filled with a guess
    guessholder = [], //holds the sprites for guesses
    color = ["0xFF0000","0x001EFF","0xFFDA00","0x067A29","0x931493"],
    grabed,
    position,
    shape,
    col = 0, 
    locked = true,
    selection = 100,
    frameCounter = 0,
    check,
    trash,
    shapePicked = false,
    ps,
    startTime,
    pcol;
 
function preload() {
    game.load.image('1', 'assets/circle.png'); //only need shapes
    game.load.image('2', 'assets/hexagon.png');
    game.load.image('3', 'assets/octagon.png');
    game.load.image('4', 'assets/pentagon.png');
    game.load.image('5', 'assets/square.png');
    game.load.image('trash', 'assets/trash.png');
    game.load.image('slot', 'assets/slot.png');
    game.load.image('check', 'assets/check.png');
    getSlots();
}

function create() {
    game.stage.backgroundColor = '#2f2f2b';
    game.physics.startSystem(Phaser.Physics.P2JS);
    grabed = game.add.sprite(-3000, -3000, '1');
    
    for (var i = 0; i < slots.length; i++) {
        var tmp = game.add.sprite(slots[i].x, slots[i].y, 'slot');
        tmp.height = 210;
        tmp.width = 210;
    }
    
    trash = game.add.sprite(slots[slots.length-1].x, slots[0].y + 240, 'trash');
    

}

function update() {
    if (!showing && !active) {
        time = 30000 - (new Date().getTime() - startTime);
        if (time <= 0) {
            active = false;
            showing = true;
            document.getElementById("gtext").innerHTML = "Times Up!, Hold out 4 fingers to try again!";
            var i;
            for (i = 0; i < guessholder.length; i++) {
                guessholder[i].kill();   
            }
        } else {
            document.getElementById("gtext").innerHTML = "Time Remaning: " + time;   
        }
    }
}

function checkBounds() {
    var i;
    var bound = 25;
    for (i = 0; i < slots.length; i++) {
        if (Math.abs(grabed.x - slots[i].cX) < bound && Math.abs(grabed.y - slots[i].cY) < bound) {
            return i;
        }
    }
    if (Math.abs(grabed.x - (trash.x + 105)) < bound && Math.abs(grabed.y - (trash.y + 105)) < bound)
        return 'trash';
    else 
        return -1;
}

function addCheck() {
    check = game.add.sprite((width / 2), height - 30, 'check');
}

function moveGrabbed(position, roll) {
    grabed.x = position[0] * width;
    grabed.y = (1-position[1]) * height;
    grabed.rotation = roll * -1;
}

function addShape(type) {
    if (type == 0 && shape > 0) {
        ps = shape;
        shape = 0;
        shapePicked = true;  
        addCheck();
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
    if (type == 0 && col != 0) {
        col = 0;
        locked = false;
        shapePicked = false;
        check.kill();
    } else if (type > 0 && type < 6) {
        col = type;
        type = type - 1;
        pcol = type;
        grabed.tint = color[type];
    }
}

function slotLocker(slot) {
    if (slot == -1) {

    } else if (slot == 'trash') {
        grabed.kill();
        locked = true;
    } else if (slot >= 0 && slot < slots.length) {
        if (filled[slot]) {
            grabed.kill();
            locked = true;  
        } else { 
            filled[slot] = true;
            var tmp = game.add.sprite(slots[slot].x + 5, slots[slot].y + 5, ps);
            tmp.height = 200;
            tmp.width = 200;
            tmp.tint = color[pcol];
            
            guessholder.push(tmp);

            var thisGuess = {
                slot: slot,
                shape: ps,
                color: pcol
            };

            guess.push(thisGuess);

            grabed.kill();
            locked = true;
        }
    }
}

function makePattern() {
    document.getElementById("gtext").innerHTML = "Game Starting"
    var rand,
        i,
        j,
        tmp;
    
    for (i = 0; i < slots.length; i++) { //fill guesses
        tmp = {
            slot: i,
            shape: Math.floor((Math.random() * 5) + 1),
            color: Math.floor((Math.random() * 4) + 0)
        };
        actual.push(tmp);
    }
    
    for (i = actual.length - 1; i > 0; i--) { //Fisher-Yates Shuffle of array
        j = Math.floor(Math.random() * (i + 1));
        tmp = actual[i];
        actual[i] = actual[j];
        actual[j] = tmp;
    }
    
    for (i = 0; i < slots.length; i++) {     //"Play" the array back to the player
        game.time.events.add(2000 * i, this.showPattern, this, i);
    }
    
    game.time.events.add(slots.length * 2000, this.startGame, this, true);
     
}

function startGame(val) {
    var i;
    for (i = 0; i < actual.length; i++) {
        shown[i].kill();
        active = false;
    }
    startTime = new Date().getTime();
    document.getElementById("gtext").innerHTML = "Time Remaning: " + 30000;
}

function showPattern(id) {
    var tmp = game.add.sprite(slots[actual[id].slot].x + 5, slots[actual[id].slot].y + 5, actual[id].shape);
    tmp.height = 200;
    tmp.width = 200;
    tmp.tint = color[actual[id].color];
    
    shown.push(tmp);
}

Leap.loop(function (frame) {
    frame.hands.forEach(function(hand, index) {
        if (showing) {
            var extendedFingers = 0;
            for(var f = 0; f < hand.fingers.length; f++){
                var finger = hand.fingers[f];
                if(finger.extended) extendedFingers++;
            }
            if (selection == extendedFingers) {
                frameCounter++;   
                if (frameCounter == 25) {
                    if (selection == 4) {
                        active = true;  //begin the pattern
                        makePattern();
                        showing = false; //turn off inital state
                    }
                    selection = 100;
                    frameCounter = 0;
                }
            } else {
                selection = extendedFingers;   
                frameCounter = 0;
            }
        } else if (!showing && !active){ //ready for player input?
            if (!locked) { //ready to be placed?
                moveGrabbed(frame.interactionBox.normalizePoint(hand.palmPosition, true), hand.roll());
                var lockIt = checkBounds();
                var extendedFingers = 0;
                for(var f = 0; f < hand.fingers.length; f++){
                    var finger = hand.fingers[f];
                    if(finger.extended) extendedFingers++;
                }
                if (selection == extendedFingers && position == lockIt) {
                    frameCounter++;   
                    if (frameCounter == 25 && extendedFingers == 0) {
                        slotLocker(lockIt);
                        frameCounter = 0;
                        selection = 100;
                    }
                } else {
                    position = lockIt;
                    selection = extendedFingers;   
                    frameCounter = 0;
                }
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
                        selection = 100;
                        frameCounter = 0;
                    }
                } else {
                    selection = extendedFingers;   
                    frameCounter = 0;
                }
            }
        }
    });
}).use('screenPosition', { scale: 0.25 });

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
        slots[i] = { x: x, y: startingYPos, cX: x + slotSize/2, cY: startingYPos + slotSize/2 };
    }    
        
}

Leap.loopController.setBackground(true)