let actionHarvest = require('action.harvest');

let actionMove = require('action.move');

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

        // Calculer combien porte le creep
        let totalCarry = 0;
        for (let amountTypeCarry of Object.values(creep.carry)) {
            totalCarry += amountTypeCarry;
        }

        // Se mettre en mode recherche d'énergie si on est en mode travail et que l'on n'a plus assez d'énergie
        if (!creep.memory.harvest && totalCarry == 0) {
            creep.memory.harvest = true;
            //creep.say('harvest');
        }
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