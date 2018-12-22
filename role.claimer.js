var bot = require('bot');

var actionMove = require('action.move');

var role = {
	run: function(creep) {
		//console.log("claimer")
		//return bot.run(creep, ['build', 'repair','transfer', 'storager']);

		// Verifier si on peut controler plus de Salles

		if(creep.room.controller.my){
			if (creep.memory.target === undefined){
				let rooms = Game.map.describeExits(creep.room.name);
				let keysRooms = Object.keys(rooms);
				let keyRoom = keysRooms[Math.floor(Math.random() *keysRooms.length)];
				let room = rooms[keyRoom];
				let findExit = creep.room.findExitTo (room);
				creep.memory.target = creep.pos.findClosestByRange (findExit);
				console.log("new target")
			}else if(creep.memory.target.x === creep.pos.x && creep.memory.target.y === creep.pos.y && creep.memory.target.roomName === creep.pos.roomName){
				creep.memory.target = undefined;
				console.log("del target")
			}

 			let res = actionMove.do(creep, creep.memory.target);


		}else{
			if(creep.room.controller) {
				let ret = creep.attackController(creep.room.controller)
				
				if(ret == ERR_NOT_IN_RANGE) {
					actionMove.do(creep, creep.room.controller);
				}
				ret = creep.claimController(creep.room.controller);
				console.log(creep, creep.room.controller, ret)
				if(ret == ERR_NOT_IN_RANGE) {
				 	creep.moveTo(creep.room.controller);
				}
				ret = creep.reserveController(creep.room.controller);
				if(ret == ERR_NOT_IN_RANGE) {
				 	creep.moveTo(creep.room.controller);
				}
			}
		}
	}
}

module.exports = role;


