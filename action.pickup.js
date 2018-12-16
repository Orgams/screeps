var actionMove = require('action.move');

var action = {
    do: function(creep){
        return false;
    	var targets = creep.room.find(FIND_DROPPED_RESOURCES);
    	var target = creep.pos.findClosestByRange(targets);
        if(target != null){
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                actionMove.do(creep, target);
            }
            return true;
        }
    	return false;
    }
};

module.exports = action;
