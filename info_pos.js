let get_pos = function(target) {
	if (target.roomName === undefined) {
		target = target.pos;
	}
	return new RoomPosition(target.x, target.y, target.roomName);
}

module.exports = {
	get_pos: get_pos
}