let get_towers = function() {
    return get_struct_by_type(STRUCTURE_TOWER);
}

let get_struct_by_type = function(type) {
    return _.filter(Game.structures, s => s.structureType == type);
}
module.exports = {
    get_towers: get_towers
}