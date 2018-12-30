let infrastructure_create = require('infrastructure_create');

let infrastructure = {
    build: function(room, sources) {
        for (source of room.find(sources)) {
            let distConstrSpawn = 4

            // Récuperer les spawns a distance de construction
            let spawnInRange = source.pos.findInRange(FIND_MY_STRUCTURES, distConstrSpawn, {
                filter: (struct) => struct.structureType === STRUCTURE_SPAWN
            });

            // Construire le Spawner si il n'y en a pas déjà un
            if (spawnInRange.length === 0) {

                let pos = infrastructure_get.pos_on_path(source, room.controller, distConstrSpawn, room.name);

                console.log("infrastructure_spawner infrastructure_get.pos_on_path", pos)

                infrastructure_create.create(pos, STRUCTURE_SPAWN);
                return true;
            }
        }
        return false;
    }
}

module.exports = infrastructure;