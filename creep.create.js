let infoPerf = require('info.perf');

let info_creep = require('info.creep');
let info_room = require('info.room');

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
        let home;
        if (config.range === "local") {
            let creeps = info_creep.get_creeps(config.role);
            let creepsGroupByHome = _.groupBy(creeps, 'memory.home')

            for (room_key of info_room.get_room_keys()){
                let creepsRoom = creepsGroupByHome[room_key];
                let nbCreepsRoom;
                if (creepsRoom !== undefined){
                    nbCreepsRoom = creepsRoom.length;
                }else{
                    nbCreepsRoom = 0;
                }
                let nb_max_creep_by_room = config.max/info_room.get_nb_room();
                infoPerf.simpleLog(scriptName, room_key, nbCreepsRoom, config.max, info_room.get_nb_room(), nb_max_creep_by_room)
                if(nbCreepsRoom < nb_max_creep_by_room){
                    home = room_key;
                    break;
                }
            }
            //console.log(Object.values(creepsGroupByHome['W2N24']))
        }

        spawn.spawnCreep(body, config.role + Game.time, {
            memory: {
                role: config.role,
                color: config.color,
                range: config.range,
                home: home
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