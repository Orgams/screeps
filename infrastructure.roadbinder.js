let roadCreate = require('road.create');

let infrastructure = {
    build: function(room, sources){
        let structs = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType != STRUCTURE_ROAD;
            }
        });
        for (let i = sources.length - 1; i >= 0; i--) {
            let source = sources[i];
            for (let j = structs.length -1 ; j >= 0; j--) {
                let struct = structs[j];
                let path = source.pos.findPathTo(struct,{ignoreCreeps: true});
                for (let k = path.length - 2 ; k >= 0; k--) {
                    let point = path[k];
                    let pos = new RoomPosition(point.x, point.y, room.name);
                    let ret = roadCreate.create(pos)
                    if (ret == OK){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

module.exports = infrastructure;
