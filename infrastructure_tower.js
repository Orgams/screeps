let infrastructure_create = require('infrastructure_create');
let infrastructure_get = require('infrastructure_get');

let infrastructure = {
    build: function(room, sources) {
        for (source of sources) {
            let distConstrSpawn = 3
            let typeStruct = STRUCTURE_TOWER;

            // Récuperer les tourelles a distance de construction
            let spawnInRange = source.pos.findInRange(FIND_MY_STRUCTURES, distConstrSpawn, {
                filter: (struct) => struct.structureType === typeStruct
            });

            // Construire le tourelle si il n'y en a pas déjà une
            if (spawnInRange.length === 0) {
                let pos = infrastructure_get.pos_on_path(source, room.controller, distConstrSpawn, room.name);
                let ret = infrastructure_create.create(pos, typeStruct)
                if (ret === OK) {
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = infrastructure;