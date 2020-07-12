let creep_manage = require('creep_manage');

let infrastructure_manage = require('infrastructure_manage');

let memoire = require('memoire');

let info_perf = require('info_perf');

let bot = require('bot');

let info_room = require('info_room');

let tower_action = require('tower_action');

let info_struct = require('info_struct');

module.exports.loop = function() {

	let scriptName = "main";
	info_perf.init(scriptName, false);

	try {
		let towers = info_struct.get_towers();
		for (let tower of towers) {
			tower_action.run(tower)
		}
		info_perf.log(scriptName, "towers");
	} catch (error) {
		info_perf.simpleLog(scriptName, "[main] towers : " + error);
	}

	try {
		// Assign all role
		info_perf.init(scriptName + "-work", false);
		let nb_miner = 0;
		for (let name in Game.creeps) {
			let creep;
			try {
				creep = Game.creeps[name];
				let role_name = memoire.get("role", creep);
				if(role_name === undefined || typeof role_name !== "string"){
					role_name = creep.name.match("[a-z]*")[0]
					memoire.set("role", role_name, creep);
				}
				if(role_name === "miner"){
					nb_miner++;
				}
				require('role_' + role_name).run(creep);
				info_perf.log(scriptName + "-work", role_name + " " + creep.memory.range);
			} catch (error) {
				info_perf.simpleLog(scriptName + "-work", "[main] creep work : " + creep + ":" + error);
			}
		}
		Memory["nb.miner"] = nb_miner;
		info_perf.log(scriptName, "creeps work");
	} catch (error) {
		info_perf.simpleLog(scriptName, "[main] creeps work : " + error);
	}

	// Initialiser la mémoire
	try{
		if (Game.time % 60 == 0) {
			let structs = [];
			let sources = [];
			for (room of Object.values(Game.rooms)) {

				roomStruct = room.find(FIND_STRUCTURES);
				structs = structs.concat(roomStruct);

				roomSources = room.find(FIND_SOURCES_ACTIVE);
				sources = sources.concat(roomSources);

				// collecter la capaciter des extantions dans la salle
				room_extention = room.find(FIND_MY_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_EXTENSION});
				memoire.set("nb.extention", room_extention.length, room);
				extentionCapacity=0;
				for (extention of room_extention) {
					extentionCapacity += extention.storeCapacity;
				}
				memoire.set("extentionCapacity", extentionCapacity, room);
			}
			let containers = _.filter(structs, (structure) => structure.structureType == STRUCTURE_CONTAINER)

			Memory["nb.containers"] = containers.length;
			Memory["nb.sources"] = sources.length;

			//Game.getObjectById
			//Memory["structures"] = structs;
			Memory["containers"] = containers;
			Memory["sources"] = sources;
			info_perf.log(scriptName, "Initialiser la mémoire");
		}
	} catch (error) {
		info_perf.simpleLog(scriptName, "init memory : " + error);
	}

	try {
		// Create necessary creeps for all rooms
		if (Game.time % 10 == 0) {

			for (room of Object.values(Game.rooms)) {
				creep_manage.manage_creep(room);
			}

			info_perf.log(scriptName, "creeps creation");
		}
	} catch (error) {
		info_perf.simpleLog(scriptName, "creeps creation : " + error);
	}

	try {
		if (Game.time % 5 == 0) {

			for (let room of info_room.get_my_room()) {
				infrastructure_manage.manage(room);
			}
			info_perf.log(scriptName, "structures");
		}
	} catch (error) {
		info_perf.simpleLog(scriptName, "[main] structures : " + error);
	}

	try {
		// Clean up creeps dead memory (RIP)
		for (let i in Memory.creeps) {
			if (!Game.creeps[i]) {
				delete Memory.creeps[i];
			}
		}
		info_perf.log(scriptName, "clean memory");
	} catch (error) {
		info_perf.simpleLog(scriptName, "[main] clean memory : " + error);
	}
	info_perf.finish(scriptName);

	info_perf.simpleLog(scriptName, Game.time + "--------------------------------------------------");
}