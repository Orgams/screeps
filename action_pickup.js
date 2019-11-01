let actionMove = require('action_move');

let action = {
    do: function(creep){
        return false;
        let targets = creep.room.find(FIND_DROPPED_RESOURCES);
        let target = creep.pos.findClosestByRange(targets);
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
