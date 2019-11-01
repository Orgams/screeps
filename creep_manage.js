let creep_create = require('creep_create');

let info_room = require('info_room');
let info_perf = require('info_perf');

const fullWork = [WORK, WORK, MOVE, WORK, WORK, WORK, MOVE, WORK];
const carryWork = [CARRY, WORK, MOVE, CARRY, MOVE, WORK, MOVE, MOVE];
const oneWorkTreeCarry = [WORK, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
const small = [CARRY, WORK, MOVE]
const claim = [CLAIM, MOVE]

let fonc_manage_creep = function(room) {
    let scriptName = "creep_manage";
    info_perf.init(scriptName, false);
    let creeps = Object.values(Game.creeps);

    let configs = [];
    //                       role,        priority, min, popOpti, max, model,             color,     range,  strict
    configs.push(new Config('transferer', 1,        1,   1,       1,   oneWorkTreeCarry, "#00ff00", "local", false));
    configs.push(new Config('janitor'   , 2,        0,   0,       0,   oneWorkTreeCarry, "#00ffff", "local", false));
    configs.push(new Config('miner'     , 3,        0,   0,       0,   fullWork,         "#ff00ff", "autre", true));
    configs.push(new Config('builder'   , 4,        1,   1,       1,   carryWork,        "#ff0000", "local", false));
    configs.push(new Config('upgrader'  , 5,        1,   2,       2,   oneWorkTreeCarry, "#0000ff", "local", false));
    configs.push(new Config('repairer'  , 6,        0,   0,       1,   oneWorkTreeCarry, "#ff9900", "local", false));
    configs.push(new Config('claimer'   , 7,        0,   0,       0,   claim,            "#ffff00", "autre", true));
    info_perf.log(scriptName, "Init configs");

    // Supprimer les configuration dont le role a déjàun creep en création
    let creepCreating = new Set();
    for (spawn of Object.values(Game.spawns)) {
        if (spawn.spawning !== null) {
            let roleCur = spawn.spawning.name.replace(/[0-9]/g, '');
            creepCreating.add(roleCur);
        }

    }
    configs = configs.filter((config) => !creepCreating.has(config.role));

    // prise en compte des local
    for (config of configs) {
        if (config.range === "local") {
            let nb_room = info_room.get_nb_my_room();
            config.popOpti = config.popOpti * nb_room;
            config.max = config.max * nb_room;
        }
    }

    // Initialisation for this room
    let totalCreeps = 0;
    let totalRestePopOpti = 0;
    let allMinOk = true;
    info_perf.log(scriptName, "Init vars");

    // Initialiser le minimum du minier au nombre de conteneur de la salle
    let nbMiners = Memory["nb.containers"];
    let configMineur = configs.find((config) => config.role == 'miner');
    if (configMineur !== undefined) {
        configMineur.min = nbMiners;
        configMineur.max = nbMiners;
        configMineur.popOpti = nbMiners;
    }
    info_perf.log(scriptName, "Init miner");

    /// Inisialiser les données de configs spécifique àcette salle
    // Initialiser config.nb : le nombre actuel de creep de ce type
    for (let indexConfig in configs) {
        let config = configs[indexConfig];
        config.nb = _.sum(creeps, (c) => c.memory.role == config.role);
        if (config.nb === undefined) config.nb = 0;
        Memory["nb." + config.role] = config.nb;
    }
    info_perf.log(scriptName, "Initialiser config.nb : le nombre actuel de creep de ce type");

    // Initialiser la configuration du claimer
    if (Game.gcl.level > info_room.get_nb_my_room()) {
        let configClaimer = configs.find((config) => config.role == 'claimer');
        configClaimer.max = 1;
        info_perf.log(scriptName, "Initialiser la configuration du claimer", configClaimer);
    }

    // Eliminer les configuration qui sont arriver àleur max de population
    configs = configs.filter((config) => config.maxOk());
    info_perf.log(scriptName, "Delete conf in max");

    // Initialiser totalRestePopOpti : l'adition de toutes les population optimal qui ne sont pas àleur max
    for (let indexConfig in configs) {
        let config = configs[indexConfig];
        totalRestePopOpti += config.popOpti;
    }
    info_perf.log(scriptName, "Init totalRestePopOpti");

    // Initialiser 
    //    config.ratio : le ratio optimal des creep de ce type par rapport au total des population optimal qui ne sont pas àleur max
    //    totalCreeps : le total des creeps de type qui ne sont pas àleur max
    for (let indexConfig in configs) {
        let config = configs[indexConfig];
        if (config.ratio === null) config.ratio = 0;
        if (totalRestePopOpti === 0) {
            config.ratio = 0;
        } else {
            config.ratio = config.popOpti / totalRestePopOpti;
        }
        totalCreeps += config.nb;
        allMinOk = allMinOk && config.minOk();
    }
    info_perf.log(scriptName, "Init ratio");


    // Create the necessary stuff that does not have its minimum for this room
    if (!allMinOk) {
        for (let indexConfig in configs) {
            let config = configs[indexConfig];
            if (!config.minOk()) {
                info_perf.logWithoutTimer(scriptName, config.role + " : le minimum n'est pas respecter : " + config.nb + " / " + config.min)
                return creep_create.try_create_creep(config);
            }
        }
    }
    info_perf.log(scriptName, "Create creep by min");

    // Initialiser config.actualRatio : le ratio actuel des creeps de ce type par rapport au total de population actuel qui ne sont pas àleur max
    for (let indexConfig in configs) {
        let config = configs[indexConfig];
        if (totalCreeps === 0) {
            config.actualRatio = 0;
        } else {
            config.actualRatio = config.nb / totalCreeps;
        }
        //info_perf.simpleLog(scriptName, config.nb + " " + config.role " (de " + config.min + " à" + config.max + " au mieux " + config.popOpti + ") " + " (" + config.printableActualRatio() + "/" + config.printableRatio() + ")");
    }
    info_perf.log(scriptName, "Init actual ratio");


    // Create the necessary stuff that does not have their popOpti without removing the maximum for this room
    for (let indexConfig in configs) {
        let config = configs[indexConfig];
        info_perf.logWithoutTimer(scriptName, config.role + " maxOk " + config.maxOk() + " ratioOk " + config.ratioOk() + " config.ratio " + config.ratio + " config.actualRatio " + config.actualRatio)
        if (config.maxOk() && config.ratioOk()) {
            info_perf.logWithoutTimer(scriptName, config.role + " : le maximum et le ratio ne sont pas atteint (" + config.nb + "/" + config.max + " et " + config.printableActualRatio() + "/" + config.printableRatio() + ")");
            return creep_create.try_create_creep(config);
        }
    }
    info_perf.log(scriptName, "Create creep by opti");

    info_perf.finish(scriptName);

}

function Config(role, priority, min, popOpti, max, model, color, range, strict) {
    this.role = role;
    this.priority = priority;
    this.min = min;
    this.popOpti = popOpti;
    this.max = max;
    this.model = model;
    this.color = color;
    this.strict = strict;
    this.range = range
    this.minOk = function() {
        if (this.nb == undefined) return undefined;
        return this.nb >= this.min;
    }
    this.maxOk = function() {
        if (this.nb == undefined) return undefined;
        return this.nb < this.max;
    }
    this.ratioOk = function() {
        if (this.ratio == undefined || this.actualRatio == undefined) return undefined;
        return this.actualRatio <= this.ratio;
    }
    this.formatPerCent = function(float) {
        return parseFloat(float * 100).toFixed(1) + "%"
    }
    this.printableRatio = function() {
        return this.formatPerCent(this.ratio);
    }
    this.printableActualRatio = function() {
        return this.formatPerCent(this.actualRatio);
    }
    this.toString = function() {
        return "role : " + this.role + ", min : " + this.min + ", popOpti : " + this.popOpti + ", max : " + this.max + ", model : " + this.model;
    }
}

module.exports = {
    manage_creep: fonc_manage_creep
};