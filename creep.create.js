let infoPerf = require('info.perf');

let costBody = 0;
let body = [];
let spawn;
let energyAvailabl

let add_part = function(part) {
    let cost_part = BODYPART_COST[part];
    if (costBody + cost_part <= energyAvailabl && body.length < 50) {
        body.push(part);
        costBody += cost_part;
        return true;
    }
    return false;
}
let fonc_create_creep = function(config, spawn) {
//creepCreate.create_creep(config.role, config.config.model, spawn, config.color, config.config.strict);

    let scriptName = "creep.create";

    if (spawn == undefined) return;
    if (config.strict == undefined) config.strict = false;

    energyAvailabl = spawn.room.energyAvailable;
    costBody = 0;
    body = [];

    let okLaunchSpawn = false;

    if (config.strict) {
        config.model.forEach((module) => okLaunchSpawn = add_part(module))
    } else {
        let indexSpe = 0;
        while (add_part(config.model[indexSpe])) {
            indexSpe = (indexSpe + 1) % config.model.length;
        }
    }
    infoPerf.simpleLog(scriptName, config.role + " (" + body.length + " parts : " + body + ") (" + costBody + "/" + energyAvailabl + " energy)");

    if (!config.strict) {
        okLaunchSpawn = body.length >= 3
    }
    console.log("config.strict", config.strict, "okLaunchSpawn", okLaunchSpawn)
    if (okLaunchSpawn) {
        spawn.spawnCreep(body, config.role + Game.time, {
            memory: {
                role: config.role,
                color: config.color
            }
        });
    } else {
        if (config.strict) {
            infoPerf.simpleLog(scriptName, config.role + " : config.model non respecté (move," + config.model + ")");
        } else {
            infoPerf.simpleLog(scriptName, config.role + " : ressource insuffisante");
        }
    }
}

module.exports = {
    create_creep: fonc_create_creep
};