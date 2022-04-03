const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,candy,ground;
var con;
var con2;
var con3;
var rope2,rope3;

var bg_img;
var animal;
var food;

var button,button2,button3;
var dino;
var blink,eat,sad;
var mute_btn;

var starImg;

var star1,star2,star3;

var emptyStar,oneStar;twoStar,threeStar;

var starDisplay;

var blower,blower2;

var bubble,bubble_img;
var higherGround;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

function preload() {
  bg_img = loadImage('background.png');
  bubble_img = loadImage("bubble.png")
  food = loadImage('candy.png');
  starImg = loadImage('star.png');
  animal = loadImage('dino_1.png')
  emptyStar = loadImage('empty_stars.png');
  oneStar = loadImage("onestar.png");
  twoStar = loadImage('twostar.png');
  threeStar = loadImage('threestar.png')

  blink = loadAnimation("blink1.png","blink2.png","blink3.png");
  eat = loadAnimation("eat1.png" , "eat2.png","eat3.png","eat4.png");
  sad = loadAnimation("sad1.png","sad2.png","sad3.png");

  bk_song = loadSound('background_sound.mp3');
  sad_sound = loadSound("sad.mp3")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.mp3');

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  createCanvas(600,700);
  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  var candy_options = {
    restitution: 0.5
  }
  
  ground =new Ground(300,height-10,width,20);
  candy = Bodies.circle(150,400,15,candy_options);
  World.add(world,candy);
  
  bubble = createSprite(460,470,20,20);
  bubble.addImage(bubble_img);
  bubble.scale = 0.12;

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  dino = createSprite(405,120,100,100);
  dino.addImage(animal);
  dino.scale = 0.2;  
  higherground =new Ground(400,145,100,10);

  dino.addAnimation('blinking',blink);
  dino.addAnimation('eating',eat);
  dino.addAnimation('crying',sad);
  dino.changeAnimation('blinking');

  mute_btn = createImg('mute.png');
  mute_btn.position(width-50,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  star1 = createSprite(150,460,20,20);
  star1.addImage(starImg);
  star1.scale = 0.3;

  star2 = createSprite(365,485,20,20);
  star2.addImage(starImg);
  star2.scale = 0.3;

  star3 = createSprite(400,200,20,20);
  star3.addImage(starImg);
  star3.scale = 0.3;

  starDisplay = createSprite(50,50,30,30);
  starDisplay.scale = 0.2;
  starDisplay.addAnimation('empty',emptyStar);
  starDisplay.addAnimation('one',oneStar);
  starDisplay.addAnimation('two',twoStar);
  starDisplay.addAnimation('three',threeStar)
  starDisplay.changeAnimation('empty');

  blower = createImg('balloon.png');
  blower.position(220,465);
  blower.size(120,100);
  blower.mouseClicked(airBlow);

  blower2 = createImg('balloon2.png');
  blower2.position(450,185);
  blower2.size(120,100);
  blower2.mouseClicked(airBlow2)

  rope = new Rope(6,{x:315,y:330});
  rope2 = new Rope(5,{x:30,y:450});
  rope3 = new Rope(5,{x:130,y:220})
  con = new Link(rope,candy);
  con2 = new Link(rope2,candy);
  con3 = new Link(rope3,candy);

  button = createImg('cut.png');
  button.position(300,320);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg('cut.png');
  button2.position(10,420);
  button2.size(50,50);
  button2.mouseClicked(remove_rope);

  button3 = createImg('cut.png');
  button3.position(120,200);
  button3.size(50,50);
  button3.mouseClicked(fall);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() {
  background(51);
  image(bg_img,0,0,width,height);
  Engine.update(engine);
  
  push();
  imageMode(CENTER);
  if(candy!=null){
    image(food,candy.position.x,candy.position.y,70,70);
  }
  pop();

  ground.show();
  higherground.show();
  rope.show();
  rope2.show();
  rope3.show();

  if(collide(candy,dino,80)==true)
  {
    bubble.visible = false;
    World.remove(engine.world,candy);
    candy = null;
    dino.changeAnimation('eating');
    eating_sound.play();
  }

  if(collide(candy,star1,20)== true) {
    star1.visible = false;
    starDisplay.changeAnimation('one');
  }

  if(collide(candy,star2,20)== true) {
    star2.visible = false;
    starDisplay.changeAnimation('two');
  }

  if(collide(candy,star3,20)== true) {
    star3.visible = false;
    starDisplay.changeAnimation('one');
  }

  if(candy!=null && candy.position.y>=650 || candy!=null && candy.position.y<=50)
  {
   dino.changeAnimation('crying');
   bk_song.stop();
   sad_sound.play();
   candy=null;
  }

    if(collide(candy,bubble,40) == true)
    {
      engine.world.gravity.y = -0.5;
      bubble.position.x = candy.position.x;
      bubble.position.y = candy.position.y;
    }

   drawSprites();
  
}

function drop() {
  cut_sound.play();
  rope.break();
  con.dettach();
  con = null; 
}

function remove_rope() {
  cut_sound.play();
  rope2.break();
  con2.dettach();
  con2 = null; 
}

function fall() {
  cut_sound.play();
  rope3.break();
  con3.dettach();
  con3 = null;
}

function collide(body,sprite,x)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}

function mute()
{
  if(bk_song.isPlaying())
     {
      bk_song.stop();
     }
     else{
      bk_song.play();
     }
}

function airBlow() {
  Matter.Body.applyForce(candy,{x:0,y:0},{x:0.02,y:0})
  air.play();
}

function airBlow2() {
  Matter.Body.applyForce(candy,{x:0,y:0},{x:-0.02,y:0});
  air.play();
}
