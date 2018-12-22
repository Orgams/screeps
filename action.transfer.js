let actionMove = require('action.move');

let findStruct = function(creep, strunctureType, taux_remplissage){
    //console.log(strunctureType, taux_remplissage)

    return creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) =>  strunctureType.includes(structure.structureType) && structure.energy < structure.energyCapacity*(taux_remplissage|1)
    });
}

let do_out = function(creep){
    
    let hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
    let targets = [];

    //Remplir d'énergie les tours s'il y a des enemies
    if(hostileCreeps.length > 0) targets = findStruct(creep, [STRUCTURE_TOWER]);
    
    //Remplir d'énergie les structure
    if(targets.length === 0) targets = findStruct(creep, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]);
    
    //Remplir d'énergie les tours s'il n'y a rien d'autre à faire
    if(targets.length === 0) targets = findStruct(creep, [STRUCTURE_TOWER]);
    
    let target = creep.pos.findClosestByRange(targets);
    if(target){
        
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            actionMove.do(creep, target);
        }
        return true;
    }
	return false;
}

module.exports = {
    do: do_out
};