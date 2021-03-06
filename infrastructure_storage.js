let infrastructure_create = require('infrastructure_create');
let info_room = require('info_room');

let build = function(room, sources) {
	let pos = info_room.get_pos_center(room.name);
	let ret = infrastructure_create.create(pos, STRUCTURE_STORAGE);
	if (ret === OK) {
		return true;
	}
	return false;
}

module.exports = {
	build: build
}