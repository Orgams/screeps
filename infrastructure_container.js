let infrastructure_create = require('infrastructure_create');
let infrastructure_get = require('infrastructure_get');

let info_perf = require('info_perf');

let infrastructure = {
	build: function(room, sources) {
		let scriptName = "infrastructure_container";
		info_perf.init(scriptName, true, room, sources);


		for (let i = sources.length - 1; i >= 0; i--) {
			let source = sources[i];
			info_perf.log(scriptName, "debut source ", source);

			// recuperer les sites de construction de containers autour de la source
			let constrs = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1, {
				filter: (constr) => {
					if (constr.structureType == STRUCTURE_CONTAINER) {
						return true;
					}
					return false;
				}
			});
			info_perf.log(scriptName, "recuperer les sites de construction de containers autour de la source");

			// recuperer les containers autour de la source
			let structs = source.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: (constr) => {
					if (constr.structureType == STRUCTURE_CONTAINER) {
						return true;
					}
					return false;
				}
			});
			info_perf.log(scriptName, "recuperer les containers autour de la source");

			// Ajouter le site de construction s'il n'existe pas et s'il n'y a pas de conteneur
			if (constrs.length === 0 && structs.length === 0) {
				let pos = infrastructure_get.pos_on_path(source, room.controller, 1, room.name);
				infrastructure_create.create(pos, STRUCTURE_CONTAINER);
				return true;
			}
			info_perf.log(scriptName, "Ajouter le site de construction s'il n'existe pas et s'il n'y a pas de conteneur");


		}
		info_perf.finish(scriptName);
		return false;
	}
}

module.exports = infrastructure;