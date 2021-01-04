
var trex, trexImg;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score=0;

var gameOver, restart;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var collidedSound, jumpSound;

function preload(){
  trexImg = loadImage("OIP.jpg");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("Untitled.png");
  
  obstacle1 = loadImage("cactus1.png");
  obstacle2 = loadImage("cactus2.png");
  obstacle3 = loadImage("cactus3.png");
  obstacle4 = loadImage("cactus4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.wav");
  collidedSound = loadSound("collided.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-20);
  
  ground = createSprite(200,height-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  trex.addImage("running", trexImg);
  trex.scale = 0.3;
  
  gameOver = createSprite(width/2,height-100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height-60);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,height-20,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  
  //trex.debug = true;
  
  background("white");
  
  textSize(20);
  fill("black");
  text("Score: "+ score, width-150,height-150);
  
  console.log(trex.y);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space")&& mousePressedOver && trex.y >=height-55) {
      trex.velocityY = -15;
      
      jumpSound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      
       collidedSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    cloud.depth = restart.depth;
    restart.depth = restart.depth + 1;
    
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-50,10,40);
    obstacle.velocityX = -(8 + 2*score/100);
    
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage("rock",obstacle1);
              break;
      case 2: obstacle.addImage("rock2",obstacle2);
              break;
      case 3: obstacle.addImage("rock3",obstacle3);
              break;
      case 4: obstacle.addImage("rock4",obstacle4);
              break;
      default: break;
    }
              
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    
    obstaclesGroup.add(obstacle);
    
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    obstacle.depth = restart.depth;
    restart.depth = restart.depth + 1;
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;
  
}