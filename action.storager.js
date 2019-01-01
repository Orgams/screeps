let actionMove = require('action.move');

let do_out = function(creep) {

    //Récuperer le stockage le plus proche qui n'est pas plein dans la salle
    targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            if (structure.structureType == STRUCTURE_STORAGE) {
                _.sum(structure.store) < structure.storeCapacity
                return true;
            }
        }
    });
    let target = creep.pos.findClosestByRange(targets);


    // Chercher un stockage dans les autres salles si besoin
    if (target === null) {
        targets = _.filter(Game.structures, (structure) =>
            structure.structureType == STRUCTURE_STORAGE &&
            _.sum(structure.store) < structure.storeCapacity
        );

        target = targets[0];
        console.log (target)
        // Passer le creep en mode global si la cible est dans une autre piece
        if (target !== undefined) {
             info_creep.set_global(creep);
        }
    }

    // Stocker les differantes resources dans le stockage
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