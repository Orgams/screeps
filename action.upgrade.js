var actionMove = require('action.move');

var action = {
    do: function(creep){
    	
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            actionMove.do(creep, creep.room.controller);
        }
    	return true;
    }
};

module.exports = action;