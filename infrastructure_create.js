let info_pos = require('info_pos');

let create = function(pos, struct_type) {
	pos = info_pos.get_pos(pos);

	// Vérifier si le terrin est constructible
	let terrain = pos.lookFor(LOOK_TERRAIN);
	if (terrain != "plain" && terrain != "swamp") {
		return false;
	}

	// Vérifier si il n'y a pas déjàune structure
	let structs = pos.lookFor(LOOK_STRUCTURES);
	let structs_without_road = _.filter(structs, (struct) => struct.structureType !== STRUCTURE_ROAD)
	if (structs_without_road.length > 0) {
		return false;
	}

	// Construire la structure
	let ret = pos.createConstructionSite(struct_type);
	//info_perf.simpleLog(scriptName, "create road : " + pos.x +" "+ pos.y +" "+ terrain+" "+ terrain != "plain" +" "+terrain != "swamp"+" "+ ret)

	// Détruire la route sous la structure si il y en a une et si le site de construction est placé
	if (ret === OK) {
		let roads = _.filter(structs, (struct) => struct.structureType === STRUCTURE_ROAD)
		if (structs.length > 0) {
			roads[0].destroy();
		}
	}
	return ret;
}

module.exports = {
	create: create
}