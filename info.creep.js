let memoire = require('memoire');

let get_creeps = function(role) {

    let id_creeps = memoire.get("ids." + role);
    if (id_creeps === undefined) {
        let creeps = _.filter(Object.values(Game.creeps), (creep) => creep.memory.role === role);
        id_creeps = [];
        for (let creep of creeps) {
            id_creeps.push(creep.id);
        }
        memoire.set("ids." + role, id_creeps, undefined, 60);
        return creeps;
    }else{
        let creeps = [];
        for (let id_creep of id_creeps) {
            creeps.push(Game.getObjectById(id_creep));
        }
        return creeps;
    }
}

module.exports = {
    get_creeps: get_creeps
}