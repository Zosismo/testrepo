//this is a test
var osc, env, value=0, val=false ,system;




function setup() {
    createCanvas(640,480);
    background(0);
    
}

function draw() {
//  console.log(Pd);
  //console.log(mouseX);
 
  Pd.send('modFreq',[mouseX]);
  Pd.send('modeAmp',[mouseY]);
}

function keyPressed(){
  Pd.send('on', [mouseX]);
}
function keyReleased(){
  Pd.send('off', [mouseX]);
}