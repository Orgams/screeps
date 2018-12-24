let get_creeps = function(role) {
    let creeps = _.filter(Object.values(Game.creeps), (creep) => creep.memory.role === role);
    let id_creeps = [];
    for (let creep of creeps) {
        id_creeps.push(creep.id);
        console.log(id_creeps)
    }
}

module.exports = {
    get_creeps: get_creeps
}