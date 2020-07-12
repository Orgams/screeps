let memoire = require('memoire');

let get = function(role) {

	let id_creeps = memoire.get("ids." + role);
	if (id_creeps === undefined) {
		let creeps = _.filter(Object.values(Game.creeps), (creep) => creep.memory.role === role);
		id_creeps = [];
		for (let creep of creeps) {
			id_creeps.push(creep.id);
		}
		memoire.set("ids." + role, id_creeps, undefined, 1);
		return creeps;
	} else {
		let creeps = [];
		for (let id_creep of id_creeps) {
			creeps.push(Game.getObjectById(id_creep));
		}
		return creeps;
	}
}

let set_global = function(creep) {
	let home = memoire.get("home", creep);
	if (home === creep.room.name){
		memoire.set("range", "global", creep, 60*3);
	}
}

module.exports = {
	get: get,
	set_global: set_global
}