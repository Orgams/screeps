let infrastructure = {
    build: function(room, sources) {
        for (source of room.find(sources)) {
            let distConstrSpawn = 4
            // Récuperer le nombre de structure a distance de construction
            let spawnInRange = source.pos.findInRange(FIND_MY_STRUCTURES, distConstrSpawn, {
                filter: (struct) => struct.structureType === STRUCTURE_SPAWN
            });
            // Construire le Spawner si il n'y en a pas déjà un
            if (spawnInRange.length === 0) {
                let path = source.pos.findPathTo(room.controller, {
                    ignoreCreeps: true,
                    swampCost: 1
                });

                path.slice(1)
                path.pop()

                let target;

                while (target === undefined && distConstrSpawn > 0) {
                    target = path[distConstrSpawn]
                    distConstrSpawn--;
                }

                let pos = new RoomPosition(target.x, target.y, room.name);

                room.createConstructionSite(pos, STRUCTURE_SPAWN);
                return true;
            }
        }
        return false;
    }
}

module.exports = infrastructure;