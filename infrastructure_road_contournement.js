let roadCreate = require('road.create');
let infrastructureGet = require('infrastructure.get');

let infrastructure = {
    build: function(room, sources) {
        console.log("Creer des voies de contournement")

        let structs = room.find(FIND_MY_STRUCTURES);

        for (let struct of structs) {
            let poss = infrastructureGet.ortho(struct, room)
            for (let pos of poss) {
                let ret = roadCreate.create(pos);
                console.log(ret)
                if (ret === OK) {
                    return true;
                }
            }
        }

        return false;
    }
}

module.exports = infrastructure;