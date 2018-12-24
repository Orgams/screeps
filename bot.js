let actionHarvest = require('action.harvest');

let actionMove = require('action.move');

let info_room = require('info.room');

let bot = {

    /** @param {Creep} creep **/
    run: function(creep, actions, sources) {

        creep.room.visual.circle(creep.pos, {
            fill: 'transparent',
            radius: 0.55,
            stroke: creep.memory.color
        });

        // Aller vers le flag qui porte le nom du role du creep s'il y en a un
        if (Game.flags[creep.memory.role] != undefined) {
            actionMove.do(creep, Game.flags[creep.memory.role]);
            return;
        }

        // Aller dans ma salle si je suis local et que je ne suis pas dans ma salle
        if (creep.memory.range === "local"){
            if(creep.memory.home !== undefined && creep.room.name !== creep.memory.home){
                actionMove.do(creep, info_room.get_pos_center(creep.memory.home));
                return true;
            }
        }

        // Calculer combien porte le creep
        let totalCarryEnergie = creep.carry[RESOURCE_ENERGY];
        let totalCarry = _.sum(creep.carry);

        // Se mettre en mode recherche d'énergie si on est en mode travail et que l'on n'a plus assez d'énergie
        if (!creep.memory.harvest && totalCarryEnergie == 0) {
            creep.memory.harvest = true;
            //creep.say('harvest');
        }

        // Se mettre en mode travail si on est en mode recherche d'énergie et que l'on ne peut rien porter de plus
        if (creep.memory.harvest && totalCarry == creep.carryCapacity) {
            creep.memory.harvest = false;
            //creep.say(creep.memory.role);
        }

        if (!creep.memory.harvest) {
            for (let action of actions) {
                if (require('action.' + action).do(creep)) {
                    return true;
                }
            }
        } else {
            if (actionHarvest.do(creep, sources)) {
                return true;
            }
        }

        actionMove.do(creep, Game.flags['Wait']);
        return false;
    }
}

module.exports = bot;