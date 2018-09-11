var osc, env, value=0, val=false ,system;




function setup() {
   
    
}

function draw() {
//  console.log(Pd);
  //console.log(mouseX);
  
  
}

function ampChange(value){
  console.log("value "+value)
  Pd.send('fr', [value]);
}
function freqChange(value){
  Pd.send('am', [value]);
}
function carChange(value){
  Pd.send('CARR', [value]);
}

