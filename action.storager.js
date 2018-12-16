var actionMove = require('action.move');

var do_out = function(creep){
    targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) =>  {
            if (structure.structureType == STRUCTURE_STORAGE){
                structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                return true;
            }
        }
    });
    var target = creep.pos.findClosestByRange(targets);
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