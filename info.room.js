let get_room = function() {
    return Game.rooms;
}

let get_room_keys = function() {
    return Object.keys(get_room());
}

let get_nb_room = function() {
    return get_room_keys().length;
}

let get_pos_center = function(name) {
    return new RoomPosition(24, 24, name);
}

module.exports = {
    get_room: get_room,
    get_room_keys: get_room_keys,
    get_nb_room: get_nb_room,
    get_pos_center: get_pos_center
}