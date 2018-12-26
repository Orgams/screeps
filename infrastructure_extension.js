let infrastructure_create = require('infrastructure_create');

let infrastructureGet = require('infrastructure.get');


let build = function(room, sources) {

    let containers = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_CONTAINER);
    });

    for (let container of containers) {
        let poss = infrastructureGet.diago(container, 2, room);
        poss.push(infrastructureGet.ortho(container, 2, room));
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