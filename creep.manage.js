var creepCreate = require('creep.create');

var infoPerf = require('info.perf');

const fullWork = [WORK, WORK, WORK, WORK, WORK, WORK];
const carryWork = [CARRY, WORK, MOVE, CARRY, MOVE, WORK, MOVE];
const oneWorkTreeCarry = [WORK, CARRY, CARRY, MOVE, CARRY, MOVE];
const small = [WORK, CARRY]
const claim = [CLAIM]

const freqAffichage = 1;

var fonc_manage_creep = function(room){
    var scriptName = "creep.manage";
    infoPerf.init(scriptName, false);
    var roomCreeps = room.find(FIND_MY_CREEPS);

    var configs = [];
    configs.push(new Config('transferer', 1, 1, 1, 1,  oneWorkTreeCarry, "#00ff00"));
    configs.push(new Config('miner',      2, 0, 0, 0,  fullWork,         "#ff00ff", true));
    configs.push(new Config('builder',    3, 0, 1, 1,  carryWork,        "#ff0000"));
    configs.push(new Config('upgrader',   4, 1, 1, 1,  oneWorkTreeCarry, "#0000ff"));
    configs.push(new Config('janitor',    5, 0, 0, 0,  oneWorkTreeCarry, "#00ffff"));
    configs.push(new Config('repairer',   6, 0, 0, 0,  oneWorkTreeCarry, "#ffff00"));
    configs.push(new Config('claimer',    7, 0, 0, 1,  claim,            "#ffffff", true));
    infoPerf.log(scriptName, "Init configs");
    
    // Initialisation for this room
    var totalCreeps = 0;
    var totalRestePopOpti = 0;
    var allMinOk = true;
    infoPerf.log(scriptName, "Init vars");
    
    // Initialiser le minimum du minier au nombre de conteneur de la salle
    var nbMiners = room.memory.nb.containers;
    var configMineur = configs.find((config) => config.role == 'miner');
    configMineur.min = nbMiners;
    configMineur.max = nbMiners;
    configMineur.popOpti = nbMiners;
    infoPerf.log(scriptName, "Init miner");
    
    // Initialiser la configuration du builder au nombre au total site de construction / 1000 de la salle
    var constrs = room.find(FIND_MY_CONSTRUCTION_SITES);
    var rafConstr = 0;
    for (var i = constrs.length - 1; i >= 0; i--) {
        var constr = constrs[i];
        rafConstr += constr.progressTotal - constr.progress;
    }
    var nbBuilders = Math.max(1, rafConstr/10000);
    var configBuilder = configs.find((config) => config.role == 'builder');
    configBuilder.popOpti = nbBuilders;
    infoPerf.log(scriptName, "Init builder");

    /// Inisialiser les données de configs spécifique à cette salle
    // Initialiser config.nb : le nombre actuel de creep de ce type
    for (var indexConfig in configs){
        var config = configs[indexConfig];
        config.nb = _.sum(roomCreeps, (c) => c.memory.role == config.role);
        if (config.nb === undefined) config.nb = 0;
        room.memory.nb[config.role]=config.nb;
    }
    for(var name in Game.spawns) {
        var spawn = Game.spawns[name];
        if (spawn.spawning != null){
            let roleCur = spawn.spawning.name.replace(/[0-9]/g, '');
            let confCur = configs.filter((config) => config.role === roleCur)[0];
            confCur.nb++;
        }
    }
    var configClaimer = configs.find((config) => config.role == 'claimer');
    if(Game.gcl.level > Object.keys(Game.rooms).length){
        configClaimer.nb = _.sum(Game.creeps, (creep) => creep.memory.role == 'claimer');
    }else{
        configClaimer.min = 0;
        configClaimer.max = 0;
        configClaimer.popOpti = 0;
    }
    
    //console.log(room.memory.nb.builder)
    infoPerf.log(scriptName, "Init nb for each type creep");
    
    // Eliminer les configuration qui sont arriver à leur max de population
    configs = configs.filter((config) => config.maxOk());
    infoPerf.log(scriptName, "Delete conf in max");
    
    // Initialiser totalRestePopOpti : l'adition de toutes les population optimal qui ne sont pas à leur max
    for (var indexConfig in configs){
        var config = configs[indexConfig];
        totalRestePopOpti += config.popOpti;
    }
    infoPerf.log(scriptName, "Init totalRestePopOpti");
    
    // Initialiser 
    //    config.ratio : le ratio optimal des creep de ce type par rapport au total des population optimal qui ne sont pas à leur max
    //    totalCreeps : le total des creeps de type qui ne sont pas à leur max
    for (var indexConfig in configs){
        var config = configs[indexConfig];
        if(config.ratio === null)config.ratio=0;
        if(totalRestePopOpti === 0){
            config.ratio=0;
        }else{
            config.ratio = config.popOpti/totalRestePopOpti;
        }
        totalCreeps += config.nb;
        allMinOk = allMinOk && config.minOk();
    }
    infoPerf.log(scriptName, "Init ratio");
    
    // Initialiser config.actualRatio : le ratio actuel des creeps de ce type par rapport au total de population actuel qui ne sont pas à leur max
    for (var indexConfig in configs){
        var config = configs[indexConfig];
        if(totalCreeps === 0){
            config.actualRatio=0;
        }else{
            config.actualRatio = config.nb/totalCreeps;
        }
        //console.log(config.nb, config.role, "(de",config.min,"à",config.max,"au mieux " + config.popOpti + ")", "(",config.printableActualRatio(),"/",config.printableRatio(),")");
    }
    infoPerf.log(scriptName, "Init actual ratio");

    // Create the necessary stuff that does not have its minimum for this room
    if (!allMinOk){
        for(var name in Game.spawns) {
            var spawn = Game.spawns[name];
            if (spawn.spawning == null){
                for (var indexConfig in configs){
                    var config = configs[indexConfig];
                    if (!config.minOk()){
                        console.log(config.role,": le minimum n'est pas respecter :",config.nb,"/",config.min)
                        creepCreate.create_creep(config.role, config.model, spawn, config.color, config.strict);
                        return; 
                    }
                }
            }
        }
    }
    infoPerf.log(scriptName, "Create creep by min");
    
    // Create the necessary stuff that does not have their popOpti without removing the maximum for this room
    for(var name in Game.spawns) {
        var spawn = Game.spawns[name];
        if (spawn.spawning == null){
            for (var indexConfig in configs){
                var config = configs[indexConfig];
                console.log(config.role,"maxOk", config.maxOk(), "ratioOk", config.ratioOk(), "config.ratio", config.ratio, "config.actualRatio", config.actualRatio)
                if (config.maxOk() && config.ratioOk()){
                    //console.log(config.role,": le maximum et le ratio ne sont pas atteint (",config.nb,"/",config.max," et ", config.printableActualRatio(),"/", config.printableRatio(),")");
                    creepCreate.create_creep(config.role, config.model, spawn, config.color, config.strict);
                    return;
                }
            }
        }
    }
    infoPerf.log(scriptName, "Create creep by opti");

}

function Config (role, priority, min, popOpti, max, model, color, strict) {
    this.role = role;
    this.priority = priority;
    this.min = min;
    this.popOpti = popOpti;
    this.max = max;
    this.model = model;
    this.color = color;
    this.strict = strict;
    this.minOk = function(){
        if (this.nb == undefined) return undefined;
        return this.nb >= this.min;
    }
    this.maxOk = function(){
        if (this.nb == undefined) return undefined;
        return this.nb < this.max;
    }
    this.ratioOk = function(){
        if (this.ratio == undefined || this.actualRatio == undefined) return undefined;
        return this.actualRatio <= this.ratio;
    }
    this.formatPerCent = function(float){
        return parseFloat(float*100).toFixed(1)+"%"
    }
    this.printableRatio = function(){
        return this.formatPerCent(this.ratio);
    }
    this.printableActualRatio = function(){
        return this.formatPerCent(this.actualRatio);
    }
    this.toString = function(){
        return "role : " + this.role + ", min : " + this.min + ", popOpti : " + this.popOpti + ", max : " + this.max + ", model : " + this.model;
    }
}

module.exports = {
    manage_creep: fonc_manage_creep
};