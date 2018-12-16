var actionMove = require('action.move');

var action = {
    do: function(creep){
    	var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    	var target = creep.pos.findClosestByRange(targets);
        if(target != null){
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                actionMove.do(creep, target);
            }
            return true;
        }
    	return false;
    }
};

module.exports = action;
