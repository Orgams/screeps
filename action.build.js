let actionMove = require('action.move');

let action = {
	do: function(creep){
		let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		let target = creep.pos.findClosestByRange(targets);

		if(target == null){
			targets = Game.constructionSites;
			target = targets[Object.keys(targets)[0]];
		}

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
