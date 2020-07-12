let actionMove = require('action_move');
let info_room = require('info_room');

let do_out = function(creep){

	room = creep.room;

	let hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
	let targets = [];

	//Remplir d'énergie les tours s'il y a des enemies
	if(hostileCreeps.length > 0) targets = info_room.get_struct_not_full_energy(room, [STRUCTURE_TOWER]);

	//Remplir d'énergie les structure
	if(targets.length === 0) targets = info_room.get_struct_not_full_energy(room, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]);

	//Remplir d'énergie les tours s'il n'y a rien d'autre àfaire
	if(targets.length === 0) targets = info_room.get_struct_not_full_energy(room, [STRUCTURE_TOWER]);

	let target = creep.pos.findClosestByRange(targets);
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