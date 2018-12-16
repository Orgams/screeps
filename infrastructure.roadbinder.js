var roadCreate = require('road.create');

var infrastructure = {
    build: function(room, sources){
        var structs = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType != STRUCTURE_ROAD;
            }
        });
        for (var i = sources.length - 1; i >= 0; i--) {
            var source = sources[i];
            for (var j = structs.length -1 ; j >= 0; j--) {
                var struct = structs[j];
                var path = source.pos.findPathTo(struct,{ignoreCreeps: true});
                for (var k = path.length - 2 ; k >= 0; k--) {
                    var point = path[k];
                    var pos = new RoomPosition(point.x, point.y, room.name);
                    var ret = roadCreate.create(pos)
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
