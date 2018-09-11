var osc, env, value=0, val=false ,system;




function setup() {
   
    
}

function draw() {
//  console.log(Pd);
  //console.log(mouseX);
  
  
}

function ampChange(value){
  console.log("value "+value)
  Pd.send('amp', [value]);
}
function freqChange(value){
  Pd.send('fr', [value]);
}
function carrChange(value){
  Pd.send('carr', [midiToFreq(value.note)]);
}

