let infoPerf = require('info.perf');

let info_creep = require('info_creep');
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

    let homes = [];
    let home_spawns = [];
    infoPerf.log(scriptName, "Init variables");

    if (config.range === "local") {
        let creeps = info_creep.get(config.role);
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
        infoPerf.log(scriptName, "Init liste home");

        config.home = homes[0]
        infoPerf.log(scriptName, "Init home in config");

        home_spawns = Game.rooms[config.home].find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_SPAWN
        });
        infoPerf.log(scriptName, "Get home spawn");
    }


    let others_spawns = _.difference(Object.values(Game.spawns), home_spawns)
    let spawns = home_spawns.concat(others_spawns);
    infoPerf.log(scriptName, "Get list spawn");

    for (let spawn of spawns) {
        let ret = create_creep(config, spawn);
        if (ret === OK) {
            return true;
        }
    }



    infoPerf.finish(scriptName);
    return false;
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

    let message = config.role + ", home:" + config.home + "(" + spawn.room.name + ")";

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

    message += " (" + body.length + " parts) (" + costBody + "/" + energyAvailable + ")";

    if (!config.strict) {
        okLaunchSpawn = body.length >= 3
        infoPerf.log(scriptName, "vérification de la taille mini du body");
    }

    //message += "config.strict " + config.strict + " okLaunchSpawn " + okLaunchSpawn;
    if (okLaunchSpawn) {
        ret = spawn.spawnCreep(body, config.role + Game.time, {
            memory: {
                role: config.role,
                color: config.color,
                range: config.range,
                home: config.home
            }
        });
        message += " spaw du creep (ret=" + ret + ")"
        infoPerf.log(scriptName, "spaw du creep");
    } else {
        if (config.strict) {
            message += " config.model non respecté (move," + config.model + ")";
        } else {
            message += " ressource insuffisante";
        }
        infoPerf.log(scriptName, "message erreur");
    }

    infoPerf.simpleLog(scriptName, message);
    infoPerf.finish(scriptName);
    return ret;
}

module.exports = {
    create_creep: create_creep,
    try_create_creep: try_create_creep
};