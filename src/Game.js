'use strict'

/* Código do jogo vai aqui! */

var bgMountain
var map
var mapLayer
var player1
var player2
var espeto
var hud
var alt = 61
var larg = 35
var objGroup
var croco
var cabine
var mar
var musica
var alu
var cry
var np = 0

const config = {}
config.GRAVITY = 1500
config.PLAYER_VELOCITY = 250
config.PLAYER_FALL_VELOCITY = 400
config.PLAYER_JUMP_VELOCITY = 500
config.PLAYER_DOUBLE_JUMP_VELOCITY = 600
config.PLAYER_LIVES = 3

var game = new Phaser.Game(
    800, 480, Phaser.CANVAS, null, {
        preload: preload,
        create: create,
        update: update,
        render: render
    })

function preload() { 
    game.load.image('background-mountain', 'assets/bg3.png')
    game.load.tilemap('level1', 'assets/level1.json',null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tiles1', 'assets/tileset-42x42.png')
    game.load.image('tile1', 'assets/tile1.png')
    game.load.image('tile2', 'assets/tile2.png')
    game.load.image('tile3', 'assets/tile3.png')
    game.load.image('cabine','assets/cabine.png')
    game.load.image('barras','assets/barras.png')
    game.load.image('chao','assets/chao.png')
    game.load.spritesheet('croco','assets/croco.png',64,64)
    game.load.image('tart','assets/tart.png')
    game.load.image('tart2','assets/tart2.png')
    game.load.image('tart3','assets/tart3.png')
    game.load.image('tart4','assets/tart4.png')
    game.load.spritesheet('player', 'assets/player.png', 49, 72)
    game.load.spritesheet('player2', 'assets/player2.png', 49, 72)
    game.load.spritesheet('player3', 'assets/player3.png', 49, 72)
    game.load.audio('musica','assets/rm.mp3',true)
    game.load.audio('alu','assets/alu.mp3',true)
    game.load.audio('cry','assets/cry.mp3',true)
    game.load.image('inicio','assets/inicio.png')
    game.load.image('espeto','assets/espeto.png')
    game.load.image('cano2','assets/cano2.png')
    game.load.image('cano3','assets/cano3.png')
    game.load.image('cano4','assets/cano4.png')
    game.load.image('cano5','assets/cano5.png')
    game.load.image('cano6','assets/cano6.png')
    game.load.image('cano7','assets/cano7.png')
    game.load.image('trash','assets/trash.png')
    game.load.image('lata','assets/lata.png')
    game.load.image('vazio','assets/vazio.png')
}

function create() { 
    musica = game.add.audio('musica')
    alu = game.add.audio('alu')
    cry = game.add.audio('cry')

    game.debug.reset()
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.physics.arcade.gravity.y = config.GRAVITY

    bgMountain = createBackground('background-mountain')
    
    var selector = game.input.keyboard.addKeys({
        p1: Phaser.KeyCode.NUMPAD_1,
        p2: Phaser.KeyCode.NUMPAD_2,
        p3: Phaser.KeyCode.NUMPAD_3
    })
    
    createTileMap()

    espeto = createObjects(70,'espeto',initEspeto)
    cabine = createObjects(71,'cabine',initCabine)
    croco = createObjects(74,'croco',initCroco)
    mar = createObjects(88,'vazio',initMar)

    createHud()

    player1 = createPlayer(100,100,'player',game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        jump: Phaser.KeyCode.CONTROL
    }),alt,larg)
    hud.title.visible = true
    hud.players.visible = true
    player1.kill()
    player1 = selectPlayer(selector)
    selector.enable = false
    musica.play()

    updateHud()
    
}

function createPlayer(x, y, image, keys, alt, larg) {
    var player = game.add.sprite(x, y, image)
    player.health = config.PLAYER_LIVES
    player.anchor.setTo(0.5, 0.5)

    player.animations.add('idle', [0], 5, true)
    player.animations.add('run', [2, 3, 4, 5], 5, true)
    player.animations.add('jump', [6], 5, false)
    player.animations.add('fall', [7], 5, false)
    player.animations.add('cry', [10,11,12,13,14], 5, false)

    player.animations.play('idle')

    game.physics.arcade.enable(player)
    player.body.collideWorldBounds = true
    player.body.maxVelocity.setTo(config.PLAYER_VELOCITY,config.PLAYER_DOUBLE_JUMP_VELOCITY)
    player.body.setSize(larg,alt, 11, 6)

    player.isDoubleJump = false
    player.startX = player.x
    player.startY = player.y

    player.keys = keys
    player.keys.jump.onDown.add(function () {
        playerJump(player)
    })
    hud.title.visible = false
    hud.players.visible = false
    hud.lives.visible = true
    hud.gameover.visible = false
    return player
}

function createTileMap() {
    map = game.add.tilemap('level1')
    map.addTilesetImage('tiles1')
    map.addTilesetImage('tile1')
    map.addTilesetImage('tile2')
    map.addTilesetImage('tile3')
    map.addTilesetImage('barras')
    map.addTilesetImage('chao')
    map.addTilesetImage('tart')
    map.addTilesetImage('tart2')
    map.addTilesetImage('tart3')
    map.addTilesetImage('tart4')
    map.addTilesetImage('cano2')
    map.addTilesetImage('cano3')
    map.addTilesetImage('cano4')
    map.addTilesetImage('cano5')
    map.addTilesetImage('cano6')
    map.addTilesetImage('cano7')
    map.addTilesetImage('trash')
    map.addTilesetImage('lata')
    map.addTilesetImage('vazio')
    mapLayer = map.createLayer('Tile Layer 1')
    map.setCollisionBetween(1, 7, true, 'Tile Layer 1')
    map.setCollisionBetween(56, 69, true, 'Tile Layer 1')
    map.setCollision(72, true, 'Tile Layer 1')
    map.setCollision(73, true, 'Tile Layer 1')
    mapLayer.resizeWorld()
}

function createBackground(img) {
    var bg = game.add.tileSprite(-10, 0, 
        game.width+20, game.height, img)
    bg.fixedToCamera = true
    bg.tileScale.setTo(2,3)
    return bg
}
function selectPlayer(selector){
     var player1Keys = game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        jump: Phaser.KeyCode.UP
    })
    selector.p1.onDown.add(function (){
        player1 = createPlayer(100,100,'player',player1Keys,alt,18)
        player1.body.offset.x= 16
        config.PLAYER_VELOCITY = 400
        config.PLAYER_JUMP_VELOCITY = 500
        alu.play()
        cry.play()
        alu.mute = true
        cry.mute = true
        np = 1
        selector.p1.onDown.removeAll();
        selector.p2.onDown.removeAll();
        selector.p3.onDown.removeAll();
    })
    selector.p2.onDown.add(function (){
        player1 = createPlayer(100,100,"player2",player1Keys,alt,larg)
        config.PLAYER_VELOCITY = 250
        config.PLAYER_JUMP_VELOCITY = 500
        np = 2
        selector.p1.onDown.removeAll();
        selector.p2.onDown.removeAll();
        selector.p3.onDown.removeAll();
    })
    selector.p3.onDown.add(function (){
        player1 = createPlayer(100,100,"player3",player1Keys,37,larg)
        player1.body.offset.setTo(8, 22)
        config.PLAYER_JUMP_VELOCITY = 360
        config.PLAYER_VELOCITY = 400
        np = 3
        selector.p1.onDown.removeAll();
        selector.p2.onDown.removeAll();
        selector.p3.onDown.removeAll();
    })
    return player1
}

function updatePlayer(player) {
    if ((np == 1 && move) || np != 1){

        if (!player.body.enable) {
        player.frame = 0
        return
    }

    if (player.keys.left.isDown) {
        player.body.velocity.x = -config.PLAYER_VELOCITY
    } 
    else if (player.keys.right.isDown) {
        player.body.velocity.x = config.PLAYER_VELOCITY
    }
    else {
        player.body.velocity.x = 0
    }
    animatePlayer(player)
    } else{
        player.body.velocity.x = 0
        player.body.velocity.y = 0
    }
}

function initEspeto(espeto) {
    game.physics.arcade.enable(espeto)
    espeto.body.allowGravity = false
    espeto.body.immovable = true
    espeto.body.setSize(34, 34)
    espeto.body.offset.y=8
    espeto.body.offset.x=4
    espeto.anchor.setTo(0.5, 0.5)
    espeto.smoothed = false
}

function initCabine(cabine) {
    game.physics.arcade.enable(cabine)
    cabine.body.allowGravity = false
    cabine.body.immovable = true
    cabine.body.setSize(38, 80)
    cabine.body.offset.y=6
    cabine.body.offset.x=2
    cabine.anchor.setTo(0.5, 0.5)
    cabine.smoothed = false
}

function initCroco(croco) {
    game.physics.arcade.enable(croco)
    croco.body.allowGravity = true
    croco.body.immovable = false
    croco.body.setSize(60, 12)
    croco.body.offset.y= 50
    croco.body.offset.x=2
    croco.anchor.setTo(0.5, 0.5)
    croco.smoothed = false
    croco.animations.add('move', null, 0.489, true)
    croco.animations.play('move')
    
    game.add.tween(croco.body)
        .to( {x: croco.x - 100}, 3000, 'Quart.easeInOut' )
        .to( {x: croco.x}, 3000, 'Quart.easeInOut' )
        .loop(-1)
        .start()
}
function initMar(mar) {
    game.physics.arcade.enable(mar)
    mar.body.allowGravity = false
    mar.body.immovable = true
    mar.body.setSize(38, 38)
    mar.body.offset.y=6
    mar.body.offset.x=2
    mar.anchor.setTo(0.5, 0.5)
    mar.smoothed = false
}

function animatePlayer(player) {
    var anim = 'idle'
    var onFloor = player.body.onFloor()

    // se esta no chao e movendo-se
    if (player.body.velocity.x != 0 && onFloor)
        anim = 'run'
    // se esta subindo e nao esta no chao
    else if (player.body.velocity.y <= 0 && !onFloor)
        anim = 'jump'
    // se esta descendo e nao esta no chao
    else if (player.body.velocity.y > 0 && !onFloor)
        anim = 'fall'

    player.animations.play(anim)

    // usa escala negativa para inverter lado
    if (player.body.velocity.x > 0)
        player.scale.x = 1
    else if (player.body.velocity.x < 0)
        player.scale.x = -1
}

function playerJump(player) {
    var onFloor = player.body.onFloor()
    if (onFloor || !player.isDoubleJump) {
        player.isDoubleJump = !onFloor
        player.body.velocity.y = 
                        -config.PLAYER_JUMP_VELOCITY
    }
}

function createHud() {
    hud = {
        title: createText(game.width/2, 200, 'SEWER ESCAPE', 60, '#ffffff'),
        gameover: createText(game.width/2, 200, 'GAME OVER', 60, '#ffffff'),
        gamewin: createText(game.width/2, 200, 'YOU WIN', 60, '#ffffff'),
        aviso: createText(game.width/2, 250, 'APERTE ESC PARA RECOMEÇAR', 20, '#ffffff'),
        lives: createText(50, 50, 'Life x 3'),
        players: createText(game.width/2, 300, '1 - Esquizofrênico | 2 - Deficiente Físico | 3 - Nanismo Primordial', 20, '#ffffff')
    }
    hud.gameover.visible = false
    hud.gamewin.visible = false
    hud.title.visible = false
    hud.players.visible = false
    hud.aviso.visible = false
}

function updateHud() {
    hud.lives.text = `LIVES: ${player1.health}`
}


function createText(x, y, text, size=16, color='white') {
    var style = { font: `bold ${size}px Arial`, fill: color}
    var obj = game.add.text(x, y, text, style)
    obj.stroke = '#000000'
    obj.strokeThickness = 4
    obj.anchor.setTo(0.5, 0.5)
    obj.fixedToCamera = true
    return obj
}

function createObjects(gid, key, initFunction) {
    // é uma lista com mais funcionalidades
    objGroup = game.add.group() 
    map.createFromObjects('Object Layer 1', gid, key,
        0, true, true, objGroup)
    objGroup.forEach(function (obj) {
        initFunction(obj)
    })
    return objGroup
}

function hitEspeto(player, espeto) {
    if (!player.alive)
        return
    
    // (se player está no chão OU
    // se player está caindo) E
    // player está acima do droid
    
    playerJump(player, true)
    hitPlayer(player)
    updateHud()
}

function hitPlayer(player) {
    player.damage(1)
    player.x = player.startX
    player.y = player.startY

    if (!player.alive) {
        game.camera.follow(null)    
        hud.gameover.visible = true
        hud.aviso.visible = true  
    }
}

var cont = 0
var move = true

function winGame(){
    hud.gamewin.visible = true
    hud.lives.visible = false
    hud.aviso.visible = true
    player1.kill()
}

function update() {   
    bgMountain.tilePosition.x = -game.camera.x/5
    game.physics.arcade.collide(player1, mapLayer)
    game.physics.arcade.collide(croco, mapLayer)
    updatePlayer(player1)
    game.camera.follow(player1, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05)
    game.physics.arcade.overlap(player1, espeto, hitEspeto)
    game.physics.arcade.overlap(player1, croco, hitEspeto)
    game.physics.arcade.collide(player1, mar, hitEspeto)
    game.physics.arcade.overlap(player1, cabine, winGame)
    cont++
    if(cont >= 600 && np==1){
        alu.mute = false
        cry.mute = false
        move = false
        player1.animations.play('cry')
        if(cont >= 1000){
            alu.mute = true
            cry.mute = true
            cont = 0
            move = true
        }
    }
    var rest = game.input.keyboard.addKeys({
        esc: Phaser.KeyCode.ESC
    })
    rest.esc.onDown.add(function (){
        game.state.restart(true)

        musica.mute = true
        cry.mute = true
        alu.mute = true
    }) 
}

function render() { 
    /*game.debug.body(player1)
    game.debug.physicsGroup(croco)
    game.debug.physicsGroup(espeto)*/
}