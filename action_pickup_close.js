let action = {
	do: function(creep){
		// Ramasser l'energy au sol s'il y en a
		let energyDroped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
		if(energyDroped.length > 0 && creep.carry.energy != creep.carryCapacity){
			creep.pickup(energyDroped[0]);
			return true;
		}
		return false
	}
}

module.exports = action;