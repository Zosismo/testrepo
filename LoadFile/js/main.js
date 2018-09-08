var soundArr = [];
var Boo = false;
var index = 0;
var button1;
var button2;
var button3;
var button4;
var button5;
var button6;
var button7;
var a = parseInt("10");
var val;
var sel;

var mic, fft, audioEl;

var smoothing = 0;
var binCount = 1024;

var birds = [];
var birdCount = 100;

var currentInput;

function preload() {
  soundFormats('mp3', 'ogg');
  soundArr.push(loadSound('race.mp3')) ;
  soundArr.push(loadSound('halo.mp3')) ;
  
  soundArr.push(loadSound('fank.mp3')) ;
  
 
    
}
function setup(){
  
  var myCanvas = createCanvas(800, 600);

  colorMode(HSB, 255);
  noStroke();

  for (var i = 0; i < birdCount; i++) {
    var newBird = new Bird(i);
    birds.push( newBird );
  }
  


  textAlign(CENTER);
  background(200);
  sel = createSelect();
  sel.position(20, 110);
  sel.option('Race');
  sel.option('Halloween');
  sel.option('fank');
  sel.changed(mySelectEvent);
  sel.style('background-color','#1ebbd7');
  sel.style('font-size', '15px');

  button1 = createButton('PLAY');
  button1.position(150, 110);
  button1.mousePressed(changeBG);
  button1.style('background-color','#1ebbd7');
  button1.style('font-size', '15px');

  button2 = createButton('>>');
  button2.position(270, 110);
  button2.mousePressed(changeF);
  button2.style('background-color','#1ebbd7');
  button2.style('font-size', '15px');

  button3 = createButton('<<');
  button3.position(220, 110);
  button3.mousePressed(changeB);
  button3.style('background-color','#1ebbd7');
  button3.style('font-size', '15px');

  button4 = createButton('Pause');
  button4.position(320, 110);
  button4.mousePressed(changePa);
  button4.style('background-color','#1ebbd7');
  button4.style('font-size', '15px');

  button5 = createButton('Loop');
  button5.position(455, 110);
  button5.mousePressed(changeLo);
  button5.style('background-color','#1ebbd7');
  button5.style('font-size', '15px');

  button6 = createButton('Stop');
  button6.position(390, 110);
  button6.mousePressed(changeS);
  button6.style('background-color','#1ebbd7');
  button6.style('font-size', '15px');

  button7 = createButton('Random');
  button7.position(520, 110);
  button7.mousePressed(changeR);
  button7.style('background-color','#1ebbd7');
  button7.style('font-size', '15px');

  soundArr[index].setVolume(0.1);
  mic = soundArr[index].play();
  currentInput = mic;

  // initialize the FFT, plug in our variables for smoothing and binCount
  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(mic);
}
//For Particles
function draw() {
  background(0, 0, 20, 50);

  // translate all x / y coordinates to the center of the screen
  translate(width/2, height/2);


  var spectrum = fft.analyze(binCount);
  var scaledSpectrum = splitOctaves(spectrum, 12);

  var center = createVector(windowWidth/2, windowHeight/2);

  for (var i = 0; i < birdCount; i++) {
    var fftAmp = scaledSpectrum[i];
    birds[i].seek(fftAmp);
    birds[i].update();
    birds[i].display();
  }

  labelStuff();
}
function Bird(index) {
  this.index = index;
  this.location = createVector(0, 0);

  var angle = map(index, 0, birdCount, 0, TWO_PI);
  this.angle = p5.Vector.fromAngle(angle);

  this.velocity = p5.Vector.random2D();
  this.acceleration = createVector(0, 0);

  this.maxforce = random(0.01, 0.2);
  this.maxspeed = random(1, 3);

  this.r = 5; //radius of the "bird"
}
Bird.prototype.seek = function(fftAmp) {
  // bird seeks angle by fftAmp
  var newTarget = createVector(this.angle.x, this.angle.y);
  newTarget.mult(fftAmp);

  var desired = p5.Vector.sub(newTarget, this.location);

  //normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);

  // Steering = Desired minus velocity (just remember this magic formule..)
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce); //don't turn too fast, otherwise we lost the steering animation

  //apply the force, we got the acceleration!
  this.acceleration.add(steer);
};
Bird.prototype.update = function() {

  //update velocity
  this.velocity.add(this.acceleration);

  //limit speed
  this.velocity.limit(this.maxspeed);
  this.location.add(this.velocity);

  //reset acceleration to 0 each cycle. 
  this.acceleration.mult(0);
  this.velocity.mult(0.9);

  this.checkEdges();
};
Bird.prototype.display = function() {
  var c = map(this.index, 0, birdCount, 0, 255);
  fill(c, 255, 255);
  ellipse(this.location.x, this.location.y, this.r, this.r);
};
Bird.prototype.checkEdges = function() {
  var x = this.location.x;
  var y = this.location.y;

  if (x > width || x < 0 || y > height || y < 0) {
    x = width/2;
    y = height/2;
  }

};

// =======
// Scaling
// =======
function splitOctaves(spectrum, slicesPerOctave) {
  var scaledSpectrum = [];
  var len = spectrum.length;

  // default to thirds
  var n = slicesPerOctave|| 3;
  var nthRootOfTwo = Math.pow(2, 1/n);

  // the last N bins get their own 
  var lowestBin = slicesPerOctave;

  var binIndex = len - 1;
  var i = binIndex;

  while (i > lowestBin) {
    var nextBinIndex = round( binIndex/nthRootOfTwo );

    if (nextBinIndex === 1) return;

    var total = 0;
    var numBins = 0;

    // add up all of the values for the frequencies
    for (i = binIndex; i > nextBinIndex; i--) {
      total += spectrum[i];
      numBins++;
    }

    // divide total sum by number of bins
    var energy = total/numBins;
    scaledSpectrum.push(energy);

    // keep the loop going
    binIndex = nextBinIndex;
  }

  scaledSpectrum.reverse();

  // add the lowest bins at the end
  for (var j = 0; j < i; j++) {
    scaledSpectrum.push(spectrum[j]);
  }

  return scaledSpectrum;
}
function labelStuff() {
  
  text('Current Input: ' + sel.value(), -300,-280);
  text('Loop: ' + Boo, -150,-280);
}
////

// for the buttons

function changeBG() {
  
  soundArr[index].play();
}

function mySelectEvent() {
 
 console.log(sel.value());
 switch(sel.value()){
  case"Race":
  soundArr[index].stop();
  index = 0;
  soundArr[index].setVolume(0.1);
  soundArr[index].play();
  break;
  case"Halloween":
  soundArr[index].stop();
  index = 1;
  soundArr[index].setVolume(0.1);
  soundArr[index].play();
  break;
  case"fank":
  soundArr[index].stop();
  index = 2;
  soundArr[index].setVolume(0.1);
  soundArr[index].play();
  break;

 }
}

function changeF() {
  soundArr[index].stop();
    index++;
    if(index>2){
      index=0;
    }
    soundArr[index].setVolume(0.1);
    soundArr[index].play();
    console.log(index);
    console.log(sel.size());
  }
function changeB() {
  
  soundArr[index].stop();
    index= index-1;
    if(index<0){
      index=2;
    }
    soundArr[index].setVolume(0.1);
    soundArr[index].play();
    
}

function changePa() {
  soundArr[index].pause();
}

function changeLo(){
  if(Boo == true){
    Boo = false;
  }else {
    Boo = true;
  }
  soundArr[index].setLoop(Boo);
    console.log(Boo);
}

function changeS(){
  soundArr[index].stop();
  index = 0;
}
function changeR(){
  val = random(3);
  soundArr[index].stop();
   index = int(val);
  console.log(index);

    soundArr[index].setVolume(0.1);
    soundArr[index].play();
}

