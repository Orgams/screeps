let infrastructure_create = require('infrastructure_create');
let info_room = require('info.room');

let build = function(room, sources) {
    let pos = info_room.get_pos_center(room.name);
    console.log("pos : ", pos);
    return infrastructure_create.create(pos, STRUCTURE_STORAGE);
}

module.exports = {
    build: build
}