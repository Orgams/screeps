let infrastructure_create = require('infrastructure_create');
let infrastructure_get = require('infrastructure_get');

let infrastructure = {
    build: function(room, sources) {
        for (source of room.find(sources)) {
            let distConstrSpawn = 4
            let typeStruct = STRUCTURE_SPAWN;

            // Récuperer les spawns a distance de construction
            let spawnInRange = source.pos.findInRange(FIND_MY_STRUCTURES, distConstrSpawn, {
                filter: (struct) => struct.structureType === typeStruct
            });

            // Construire le Spawner si il n'y en a pas déjà un
            if (spawnInRange.length === 0) {
                let pos = infrastructure_get.pos_on_path(source, room.controller, distConstrSpawn, room.name);
                console.log("pos for spawn : ", pos);
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