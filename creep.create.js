var costBody = 0;
var body = [];
var spawn;
var energyAvailabl

var add_part = function(part) {
    var cost_part = BODYPART_COST[part];
    if (costBody + cost_part <= energyAvailabl && body.length < 50){
        body.push(part);
        costBody += cost_part;
        return true;
    }
    return false;
}
var fonc_create_creep = function(roleCreep, model, spawn, colorCreep, strict){
    
    console.log("test")
    
    if (spawn == undefined)return;
    if (strict == undefined)strict = false;

    energyAvailabl = spawn.room.energyAvailable;
    costBody = 0;
    body = [];
    
    var okLaunchSpawn = false;

    if (strict){
        model.forEach((module) => okLaunchSpawn = add_part(module))
    }else{
        var indexSpe = 0;
        while (add_part(model[indexSpe])) {
            indexSpe = (indexSpe + 1)%model.length;
        }
    }
    console.log(roleCreep+" ("+body.length+" parts : "+ body + ") (" + costBody+"/"+energyAvailabl+" energy)");

    if(!strict){
        okLaunchSpawn = body.length >= 3    
    }
    console.log("strict", strict, "okLaunchSpawn", okLaunchSpawn)
    if (okLaunchSpawn){
        console.log(spawn.spawnCreep( body, roleCreep+Game.time, { memory: { role: roleCreep, color: colorCreep } } ));
    }else{
        if(strict){
            console.log(roleCreep, ": model non respecté (move," + model + ")");
        }else{
            console.log(roleCreep, ": ressource insuffisante");
        }
    }
}

module.exports = {
    create_creep: fonc_create_creep
};