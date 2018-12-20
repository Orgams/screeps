var bot = require('bot');

var role = {
    run: function(creep) {
    	//console.log("claimer")
        //return bot.run(creep, ['build', 'repair','transfer', 'storager']);
        let rooms = Game.map.describeExits("W3N24");

        if(false){
			if(creep.room.controller && !creep.room.controller.my) {
				if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}

			if(creep.room.controller) {
				if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}

			if(creep.room.controller) {
				if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}
		}
    }
}

module.exports = role;


