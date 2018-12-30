let infrastructure_create = require('infrastructure_create');

let infrastructure_get = require('infrastructure_get');


let build = function(room, sources) {

    let containers = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });
    for (let container of containers) {
        let poss = infrastructure_get.diago(container, 2, room);
        poss = poss.concat(infrastructure_get.ortho(container, 2, room));
        for (let pos of poss) {
            let ret = infrastructure_create.create(pos, STRUCTURE_EXTENSION);
            if (ret === OK) {
                return true;
            }
        }
    }
    return false;
}


module.exports = {
    build: build
}