let infrastructure_create = require('infrastructure_create');
let infrastructure_get = require('infrastructure_get');
let info_room = require('info.room');


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
    let i = 0;
    let rets;
    while (!rets.include(ERR_RCL_NOT_ENOUGH)) {
        i++;
        let room_center = info_room.get_pos_center(room.name);
        let perif = infrastructure_get.perif(room_center, i, room);
        let perif_paire = infrastructure_get.pos_paire(perif);

        rets = [];
        for (let pos of perif_paire) {
            let ret = infrastructure_create.create(pos, STRUCTURE_EXTENSION);
            if (ret === OK) {
                return true;
            }
            rets.push(ret)
        }
    }

    return false;
}


module.exports = {
    build: build
}