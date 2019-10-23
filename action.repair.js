let actionMove = require('action.move');
let info_perf = require('info_perf');

let actionRepair = {
    do: function(creep){
        let scriptName = "action.repair";
        info_perf.init(scriptName, false);
        
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: struct =>{
                if(struct.structureType == STRUCTURE_WALL)
                    return false;
                return struct.hits < struct.hitsMax
            }
        });
        info_perf.log(scriptName, "Structure non mur à réparer : " + targets);
        
        if (targets.length == 0){
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: struct =>{
                    if(struct.structureType != STRUCTURE_WALL)
                        return false;
                    return struct.hits < struct.hitsMax
                }
            });
        }
        info_perf.log(scriptName, "Structure mur à réparer : " + targets);
        
        targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
        
        targets = targets.slice(0, Math.ceil(targets.length/4));

        let target = creep.pos.findClosestByRange(targets);
        
        
        
        if(target != null){
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                actionMove.do(creep, target);
            }
            return true;
        }
        return false;
    }
};

module.exports = actionRepair;