var actionMove = require('action.move');
var actionPickup = require('action.pickup');

var actionHarvest = {
    do: function(creep, srcs){
        
        
        var sources = srcs || [STRUCTURE_CONTAINER, STRUCTURE_STORAGE];

        var target = false;

        for (var source of sources) {
            var res = findTarget(creep, source);
            if(res){
                //if(creep.withdraw(res, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if(take(creep, source, res) == ERR_NOT_IN_RANGE) {
                    actionMove.do(creep, res);
                }
                return true;
            }
        }
        
        var targets = creep.room.find(FIND_DROPPED_RESOURCES).
        target = creep.pos.findClosestByRange(targets);
        if(target){
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                actionMove.do(creep, target);
            }
            return true;
        }
        
        // Recolter sur les sources si il n'y a pas le bon nombre de mineur
        //console.log ("nb.containers", creep.room.memory.nb.containers, "nb.miner", creep.room.memory.nb.miner, creep.room.memory.nb.containers > creep.room.memory.nb.miner)
        if( creep.room.memory.nb.containers > creep.room.memory.nb.miner){
            var targets = creep.room.find(FIND_SOURCES_ACTIVE);
            target = creep.pos.findClosestByRange(targets);
            if(target){
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    actionMove.do(creep, target);
                }
                return true;
            }
        }
        return false;
        
    }
};

var take = function(creep, source, target){
    if ([STRUCTURE_CONTAINER, STRUCTURE_STORAGE].includes(source)){
        return creep.withdraw(target, RESOURCE_ENERGY);
    }
    if ([FIND_DROPPED_RESOURCES].includes(source)){
        return creep.pickup(target);
    }
    if ([FIND_SOURCES_ACTIVE].includes(source)){
        return creep.harvest(target);
    }
}

var findTarget = function(creep, source){
    
    var targets = [];
    if ([STRUCTURE_CONTAINER, STRUCTURE_STORAGE].includes(source)){
        targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
            if (structure.structureType == source) {
                var path = creep.pos.findPathTo(structure,{ignoreCreeps: true});
                var coutDist = path.length * 10;
                var stockRest = creep.carryCapacity - creep.carry[RESOURCE_ENERGY];
                var energy_min = stockRest + coutDist;
                if (structure.store[RESOURCE_ENERGY] > energy_min) {
                    return true;
                }
            }
            return false;
        }});
    }
    if ([FIND_DROPPED_RESOURCES].includes(source)){
        targets = creep.room.find(FIND_DROPPED_RESOURCES);
    }
    if ([FIND_SOURCES_ACTIVE].includes(source)){
        
    }
    if (targets.length === 0){
        return false;
    }
    return creep.pos.findClosestByPath(targets);
}

module.exports = actionHarvest;