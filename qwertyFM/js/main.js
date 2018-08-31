
var osc, env, value=0, val=false ,system;
var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;



function setup() {
    createCanvas(640,480);
    
}

function draw() {
  console.log(Pd);
  console.log(mouseX);
 
  Pd.send('modAmp',[mouseX]);
  Pd.send('carr',[mouseY]);
}

function keyPressed(){
  Pd.send('on', [mouseX]);
}
function keyReleased(){
  Pd.send('off', [mouseX]);
}