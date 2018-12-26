let infrastructure_create = require('infrastructure_create');
let infrastructureGet = require('infrastructure.get');

let infrastructure = {
    build: function(room, sources) {
        let structs = room.find(FIND_MY_STRUCTURES);

        for (let struct of structs) {
            let poss = infrastructureGet.ortho(struct, 1, room)
            for (let pos of poss) {
                let ret = infrastructure_create.create(pos, STRUCTURE_ROAD);
                if (ret === OK) {
                    return true;
                }
            }
        }

        return false;
    }
}

module.exports = infrastructure;