var bot = require('bot');

var role = {
	run: function(creep) {
		//console.log("claimer")
		//return bot.run(creep, ['build', 'repair','transfer', 'storager']);

		console.log(creep.room.controller.my)

		// Verifier si on peut controler plus de Salles
		if(!Game.gcl.level > Object.keys(Game.rooms).length)return;

		let rooms = Game.map.describeExits(creep.room.name);
		if (creep.memory.target === undefined){
			let keysRooms = Object.keys(rooms);
			let keyRoom = keysRooms[Math.floor(Math.random() *keysRooms.length)];
			let room = rooms[keyRoom];
			let findExit = creep.room.findExitTo (room);
			creep.memory.target = creep.pos.findClosestByRange (findExit);
		}



		if(false){
			if(creep.room.controller && !creep.room.controller.my) {
				if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}

			if(creep.room.controller) {
				if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}

			if(creep.room.controller) {
				if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}
		}
	}
}

module.exports = role;


