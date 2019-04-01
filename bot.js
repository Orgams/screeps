let actionHarvest = require('action.harvest');

let actionMove = require('action.move');

let info_room = require('info.room');

let info_perf = require('info_perf');

let memoire = require('memoire');

let infrastructure_get = require('infrastructure_get');

let bot = {

    /** @param {Creep} creep **/
    run: function(creep, actions, sources) {

        let scriptName = "bot";
        info_perf.init(scriptName, true);

        let pos = creep.pos;
        let visual = creep.room.visual;
        let color = memoire.get("color", creep);

        let style = {
            fill: 'transparent',
            radius: 0.55,
            stroke: color
        };

        // Indiquer mon role
        visual.circle(pos, style);
        info_perf.log(scriptName, "Indiquer mon role" + " (" + creep.memory.role + ")");

        // Indiquer si je cherche de l'energie
        if (creep.memory.harvest) {
            style.radius = 0.1;
            visual.circle(pos, style);
        }
        info_perf.log(scriptName, "Indiquer si je cherche de l'energie");

        // Indiquer si je suis chez moi
        if (memoire.get("home", creep) === creep.room.name){
            style.radius = 0.7;
            visual.circle(pos, style);
        }
        info_perf.log(scriptName, "Indiquer si je suis chez moi");

        style = {
            color: color,
            align: "left",
            opacity: 0.5
        };
        // Indiquer si je suis en mode global
        if (memoire.get("range", creep) === "global"){
            console.log("test");
            let orthos = infrastructure_get.ortho(pos, 1, creep.room);
            visual.line(orthos[0], orthos[2], style);
            visual.line(orthos[2], orthos[1], style);
            visual.line(orthos[1], orthos[3], style);
            visual.line(orthos[3], orthos[0], style);
        }
        info_perf.log(scriptName, "Indiquer si je suis en mode global");

        // Aller vers le flag qui porte le nom du role du creep s'il y en a un
        if (Game.flags[creep.memory.role] != undefined) {
            actionMove.do(creep, Game.flags[creep.memory.role]);
            info_perf.log(scriptName, "Aller vers le flag qui porte le nom du role du creep");
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
        info_perf.log(scriptName, "Initialiser le mode");

        // Récolter
        if (creep.memory.harvest) {
            if (actionHarvest.do(creep, sources)) {
                info_perf.log(scriptName, "Récolter");
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
                info_perf.log(scriptName, "Aller dans ma salle si je suis local et que je ne suis pas dans ma salle");
                return true;
            }
        }

        // Effrectuer mes actions
        if (!creep.memory.harvest) {
            for (let action of actions) {
                if (require('action.' + action).do(creep)) {
                    info_perf.log(scriptName, "Effrectuer mes actions");
                    return true;
                }
            }
        }

        // Aller attendre
        actionMove.do(creep, Game.flags['Wait']);
        info_perf.log(scriptName, "Aller attendre");
        return false;
    }
}

module.exports = bot;