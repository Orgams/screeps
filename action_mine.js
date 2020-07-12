let action = {
	do: function(creep){

		let sources = creep.room.find(FIND_SOURCES_ACTIVE);
		let source = creep.pos.findClosestByRange(sources);
		if(source != null){
			creep.harvest(source);
			return true;
		}
		return false;
	}
};

module.exports = action;