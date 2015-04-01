var width = document.documentElement.clientWidth,
    height = window.innerHeight,
    game;


function preload() {
    //loads assets
}

function create() {
    game.stage.backgroundColor = '#2f2f2b';
    game.physics.startSystem(Phaser.Physics.P2JS);
}
