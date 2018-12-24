let actionMove = require('action.move');

let do_out = function(creep) {
    targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            if (structure.structureType == STRUCTURE_STORAGE) {
                _.sum(structure.store) < structure.storeCapacity
                return true;
            }
        }
    });
    let target = creep.pos.findClosestByRange(targets);
    if (target) {
        for (let typeCarry in creep.carry) {
            let nbCarry = creep.carry[typeCarry];

            if (nbCarry > 0) {
                if (creep.transfer(target, typeCarry) == ERR_NOT_IN_RANGE) {
                    actionMove.do(creep, target);
                }
                return true;
            }
        }
    }
    return false;
}

module.exports = {
    do: do_out
};