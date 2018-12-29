let get_my_room = function() {
	let structs = _.filter(Game.structures, (structure) => structure.my && structure.structureType === STRUCTURE_CONTROLLER);

	let rooms = []

	for (let struct of structs){
		rooms.push(struct.room);
	}
    return rooms;
}

let get_room = function() {
    return Game.rooms;
}

let get_my_room_keys = function() {
    return get_names(get_my_room());
}

let get_room_keys = function() {
    return get_names(get_room());
}

let get_nb_my_room = function() {
    return get_my_room().length;
}

let get_nb_room = function() {
    return get_room_keys().length;
}

let get_pos_center = function(name) {
    return new RoomPosition(24, 24, name);
}

let get_names = function(rooms) {
    let names = []
    for (let i in rooms){
        let room = rooms[i];
        names.push(room.name);
    }
    return names;
}

module.exports = {
    get_room: get_room,
    get_room_keys: get_room_keys,
    get_nb_room: get_nb_room,
    get_my_room: get_my_room,
	get_my_room_keys: get_my_room_keys,
	get_nb_my_room: get_nb_my_room,
    get_pos_center: get_pos_center
}