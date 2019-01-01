let bot = require('bot');

let actionMove = require('action.move');

let role = {
	run: function(creep) {

		// Aller vers le flag qui porte le nom du role du creep s'il y en a un
		if (Game.flags[creep.memory.role] != undefined) {
			actionMove.do(creep, Game.flags[creep.memory.role]);
			return;
		}

		// Verifier si on peut controler plus de Salles
		if (creep.room.controller.my) {
			if (creep.memory.target === undefined) {
				let rooms = Game.map.describeExits(creep.room.name);
				let keysRooms = Object.keys(rooms);
				let keyRoom = keysRooms[Math.floor(Math.random() * keysRooms.length)];
				let room = rooms[keyRoom];
				let findExit = creep.room.findExitTo(room);
				creep.memory.target = creep.pos.findClosestByRange(findExit);
			} else if (creep.memory.target.x === creep.pos.x && creep.memory.target.y === creep.pos.y && creep.memory.target.roomName === creep.pos.roomName) {
				creep.memory.target = undefined;
			}

			let res = actionMove.do(creep, creep.memory.target);


		} else {
			if (creep.room.controller) {
				console.log("room autre")

				let ret = creep.attackController(creep.room.controller)

				if (ret == ERR_NOT_IN_RANGE) {
					actionMove.do(creep, creep.room.controller);
				}
				ret = creep.claimController(creep.room.controller);
				if (ret == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
				ret = creep.reserveController(creep.room.controller);
				if (ret == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}
		}
	}
}

module.exports = role;