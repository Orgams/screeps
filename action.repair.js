let actionMove = require('action.move');

let actionRepair = {
    do: function(creep){
    	let targets = creep.room.find(FIND_STRUCTURES, {
    		filter: struct =>{
    		    if(struct.structureType == STRUCTURE_WALL)
    		        return false;
    		    return struct.hits < struct.hitsMax
    		}
    	});
    	
    	if (targets.length == 0){
    	    targets = creep.room.find(FIND_STRUCTURES, {
    		filter: struct =>{
    		    if(struct.structureType != STRUCTURE_WALL)
    		        return false;
    		    return struct.hits < struct.hitsMax
    		}
    	});
    	}
    	
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