let infoPerf = require('info.perf');

let info_creep = require('info.creep');
let info_room = require('info.room');

let costBody = 0;
let body = [];
let spawn;
let energyAvailable

let add_part = function(part) {
    let cost_part = BODYPART_COST[part];
    if (costBody + cost_part <= energyAvailable && body.length < 50) {
        body.push(part);
        costBody += cost_part;
        return true;
    }
    return false;
}

let try_create_creep = function(config) {

    let scriptName = "creep.create";
    infoPerf.init(scriptName, false);

    let ret = false;

    let homes = [];

    infoPerf.log(scriptName, "Init variables");

    //if (config.range === "local") {
        let creeps = info_creep.get_creeps(config.role);
        let creepsGroupByHome = _.groupBy(creeps, 'memory.home')

        let myRoomKeys = info_room.get_my_room_keys();

        for (room_key of myRoomKeys) {
            let creepsRoom = creepsGroupByHome[room_key];
            let nbCreepsRoom;
            if (creepsRoom !== undefined) {
                nbCreepsRoom = creepsRoom.length;
            } else {
                nbCreepsRoom = 0;
            }
            let nb_max_creep_by_room = config.max / info_room.get_nb_my_room();
            if (nbCreepsRoom < nb_max_creep_by_room) {
                homes.push(room_key);
            }
        }
    //}
    infoPerf.log(scriptName, "Init liste home");
    for (let home of homes){
        console.log(home)
    }
    infoPerf.log(scriptName, "");


    for (let name in Game.spawns) {
        let spawn = Game.spawns[name];
        ret = create_creep(config, spawn);
    }
    infoPerf.log(scriptName, "Création du creep");

    infoPerf.finish(scriptName);
    return ret;
}

let create_creep = function(config, spawn) {

    let scriptName = "creep.create";
    infoPerf.init(scriptName, false);

    if (spawn == undefined) return;
    if (config.strict == undefined) config.strict = false;

    let ret = false;

    energyAvailable = spawn.room.energyAvailable;
    costBody = 0;
    body = [];

    let okLaunchSpawn = false;

    infoPerf.log(scriptName, "Initialisation de variable");

    if (config.strict) {
        config.model.forEach((module) => okLaunchSpawn = add_part(module))
    } else {
        let indexSpe = 0;
        while (add_part(config.model[indexSpe])) {
            indexSpe = (indexSpe + 1) % config.model.length;
        }
    }
    infoPerf.log(scriptName, "construction du body");

    infoPerf.simpleLog(scriptName, config.role + " (" + body.length + " parts : " + body + ") (" + costBody + "/" + energyAvailable + " energy)");

    if (!config.strict) {
        okLaunchSpawn = body.length >= 3
        infoPerf.log(scriptName, "vérification de la taille mini du body");
    }

    infoPerf.simpleLog(scriptName, "config.strict", config.strict, "okLaunchSpawn", okLaunchSpawn)
    if (okLaunchSpawn) {
        let ret = spawn.spawnCreep(body, config.role + Game.time, {
            memory: {
                role: config.role,
                color: config.color,
                range: config.range,
                home: config.home
            }
        });
        infoPerf.log(scriptName, "spaw du creep");
    } else {
        if (config.strict) {
            infoPerf.simpleLog(scriptName, config.role + " : config.model non respecté (move," + config.model + ")");
        } else {
            infoPerf.simpleLog(scriptName, config.role + " : ressource insuffisante");
        }
        infoPerf.log(scriptName, "message erreur");
    }
    infoPerf.finish(scriptName);

    return ret;
}

module.exports = {
    create_creep: create_creep,
    try_create_creep: try_create_creep
};