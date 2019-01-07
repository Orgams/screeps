let infrastructure_create = require('infrastructure_create');
let infrastructure_get = require('infrastructure_get');

let infrastructure = {
    build: function(room) {
        let structs = room.find(FIND_MY_STRUCTURES);

        for (let struct of structs) {
            let poss = infrastructure_get.ortho(struct, 1, room)
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