let run = function(tower) {
	let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	if (closestHostile) {
		tower.attack(closestHostile);
	} else if (tower.energy > tower.energyCapacity / 2) {

		let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => structure.hits < structure.hitsMax / 2 && structure.structureType != STRUCTURE_WALL
		});
		if (closestDamagedStructure) {
			tower.repair(closestDamagedStructure);
		} else {

			let closestAlly = tower.pos.findClosestByRange(FIND_CREEPS, {
				filter: (target) => target.hits < target.hitsMax
			});
			if (closestAlly) {
				tower.heal(closestAlly);
			}
		}
	}
}

module.exports = {
	run: run
}