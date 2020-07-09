let bot = require('bot');

let actionMove = require('action_move');

let info_perf = require('info_perf');

let role = {
	run: function(creep) {

		let scriptName = "role_claimer";
		info_perf.init(scriptName, true);

		// Aller vers le flag qui porte le nom du role du creep s'il y en a un
		if (Game.flags[creep.memory.role] != undefined) {
			actionMove.do(creep, Game.flags[creep.memory.role]);
			info_perf.log(scriptName, "Aller vers mon flag");
			return;
		}

		info_perf.log(scriptName, Game.flags["room_to_claime"])

		// // Verifier si on peut controler plus de Salles
		// if (creep.room.controller.my) {
		// 	info_perf.log(scriptName, "Je suis dans une salle à moi");
		// 	if (creep.memory.target === undefined) {
		// 		info_perf.log(scriptName, "Je cherche une sortie");
		// 		let rooms = Game.map.describeExits(creep.room.name);
		// 		let keysRooms = Object.keys(rooms);
		// 		let keyRoom = keysRooms[Math.floor(Math.random() * keysRooms.length)];
		// 		let room = rooms[keyRoom];
		// 		let findExit = creep.room.findExitTo(room);
		// 		creep.memory.target = creep.pos.findClosestByRange(findExit);
		// 		info_perf.log(scriptName, "Sortie trouvée : "+creep.memory.target);
		// 	} else if (creep.memory.target.x === creep.pos.x && creep.memory.target.y === creep.pos.y && creep.memory.target.roomName === creep.pos.roomName) {
		// 		creep.memory.target = undefined;
		// 		info_perf.log(scriptName, "si je suis arriver au centre de la salle, je n'ai plus de cible");
		// 	}

		// 	let ret = actionMove.do(creep, creep.memory.target);
		// 	if(!ret){
		// 		creep.memory.target = undefined;
		// 		info_perf.log(scriptName, "impossible de d'aller dans l'autre salle, je n'ai plus de cible");
		// 	}

		// } else {
		// 	info_perf.log(scriptName, "Je ne suis pas dans une salle à moi");
		// 	if (creep.room.controller) {

		// 		let ret = creep.attackController(creep.room.controller)
		// 		info_perf.log(scriptName, "J'attaque le controlleur : "+ret);

		// 		if (ret == ERR_NOT_IN_RANGE) {
		// 			actionMove.do(creep, creep.room.controller);
		// 			info_perf.log(scriptName, "je n'ai pas à porté, je m'approche");
		// 		}
		// 		ret = creep.claimController(creep.room.controller);
		// 		info_perf.log(scriptName, "Je réclame le controlleur : "+ret);
		// 		if (ret == ERR_NOT_IN_RANGE) {
		// 			creep.moveTo(creep.room.controller);
		// 			info_perf.log(scriptName, "je n'ai pas à porté, je m'approche");
		// 		}
		// 		ret = creep.reserveController(creep.room.controller);
		// 		info_perf.log(scriptName, "Je réserve le controlleur : "+ret);
		// 		if (ret == ERR_NOT_IN_RANGE) {
		// 			creep.moveTo(creep.room.controller);
		// 			info_perf.log(scriptName, "je n'ai pas à porté, je m'approche");
		// 		}
		// 	}
		// }
	}
}

module.exports = role;