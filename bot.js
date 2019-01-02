let actionHarvest = require('action.harvest');

let actionMove = require('action.move');

let info_room = require('info.room');

let memoire = require('memoire');

let infrastructure_get = require('infrastructure_get');

let bot = {

    /** @param {Creep} creep **/
    run: function(creep, actions, sources) {

        let pos = creep.pos;
        let visual = creep.room.visual;
        let message = memoire.get("range", creep) + ", " + memoire.get("home", creep);
        let color = memoire.get("color", creep);

        let style = {
            fill: 'transparent',
            radius: 0.55,
            stroke: color
        };

        // Indiquer mon role
        visual.circle(pos, style);

        // Indiquer si je cherche de l'energie
        if (creep.memory.harvest) {
            style.radius = 0.1;
            visual.circle(pos, style);
        }

        // Indiquer si je suis chez moi
        if (memoire.get("home", creep) === creep.room.name){
            style.radius = 0.7;
            visual.circle(pos, style);
        }

        // Indiquer si je suis en mode global
        if (memoire.get("range", creep) === "global"){
            let orthos = infrastructure_get.ortho(pos, 1, room);
            visual.line(orthos[0], orthos[1], style);
        }

        visual.text(message, pos.x + 1, pos.y, {
            color: color,
            align: "left",
            opacity: 0.5
        });

        // Aller vers le flag qui porte le nom du role du creep s'il y en a un
        if (Game.flags[creep.memory.role] != undefined) {
            actionMove.do(creep, Game.flags[creep.memory.role]);
            return;
        }

        // Calculer combien porte le creep
        let totalCarry = _.sum(creep.carry);

        // Se mettre en mode recherche d'énergie si on est en mode travail et que l'on n'a plus assez d'énergie
        if (!creep.memory.harvest && totalCarry == 0) {
            creep.memory.harvest = true;
            //creep.say('harvest');
        }

        // Se mettre en mode travail si on est en mode recherche d'énergie et que l'on ne peut rien porter de plus
        if (creep.memory.harvest && totalCarry == creep.carryCapacity) {
            creep.memory.harvest = false;
            //creep.say(creep.memory.role);
        }

        if (creep.memory.harvest) {
            if (actionHarvest.do(creep, sources)) {
                return true;
            }
        }
        if (memoire.get("range", creep) === undefined) {
            memoire.set("range", "local", creep, 60 * 60);
        }

        // Aller dans ma salle si je suis local et que je ne suis pas dans ma salle
        if (creep.memory.range === "local") {
            if (creep.memory.home !== undefined && creep.room.name !== creep.memory.home) {
                actionMove.do(creep, info_room.get_pos_center(creep.memory.home));
                return true;
            }
        }

        if (!creep.memory.harvest) {
            for (let action of actions) {
                if (require('action.' + action).do(creep)) {
                    return true;
                }
            }
        }

        actionMove.do(creep, Game.flags['Wait']);
        return false;
    }
}

module.exports = bot;