let info_pos = require('info_pos');

let addRoomPosition = function(arr, x, y, room_name){
	// Controler si les parametres sont valides
	if(x < 0 || x > 49 || y < 0 || y > 49) return;
	arr.push(new RoomPosition(x, y, room_name));
}

let json = {
	perif: function(target, dist, room) {
		let pos = info_pos.get_pos(target);

		res = [];
		for (let offset = -dist; offset <= dist; offset++) {
			addRoomPosition(res, pos.x + offset, pos.y + dist, room.name);
			addRoomPosition(res, pos.x + offset, pos.y - dist, room.name);
		}
		let distbis = dist - 1;
		for (let offset = -distbis; offset <= distbis; offset++) {
			addRoomPosition(res, pos.x + dist, pos.y + offset, room.name);
			addRoomPosition(res, pos.x - dist, pos.y + offset, room.name);
		}
		return res;
	}, diago: function(target, dist, room) {
		let pos = info_pos.get_pos(target);

		res = [];
		addRoomPosition(res, pos.x + dist, pos.y + dist, room.name);
		addRoomPosition(res, pos.x - dist, pos.y + dist, room.name);
		addRoomPosition(res, pos.x + dist, pos.y - dist, room.name);
		addRoomPosition(res, pos.x - dist, pos.y - dist, room.name);
		return res;
	}, ortho: function(target, dist, room) {
		let pos = info_pos.get_pos(target);

		res = [];

		addRoomPosition(res, pos.x + dist, pos.y, room.name);
		addRoomPosition(res, pos.x - dist, pos.y, room.name);
		addRoomPosition(res, pos.x, pos.y + dist, room.name);
		addRoomPosition(res, pos.x, pos.y - dist, room.name);

		return res;
	}, pos_paire: function(poss) {
		return _.filter(poss, (pos) => (pos.x+pos.y)%2 === 0);
	}, pos_on_path: function(source, target, dist, room_name) {

		let path = source.pos.findPathTo(target, {
			ignoreCreeps: true,
			swampCost: 1
		});

		path.slice(1);
		path.pop();

		dist--;

		let pos_path;

		while (pos_path === undefined && dist >= 0) {
			pos_path = path[dist]
			dist--;
		}

		let pos = new RoomPosition(pos_path.x, pos_path.y, room_name);

		return pos;
	}
}

module.exports = json