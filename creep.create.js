let info_perf = require('info_perf');

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
    info_perf.init(scriptName, true);

    let homes = [];
    let home_spawns = [];
    info_perf.log(scriptName, "Init variables");

    // Define 
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
        info_perf.log(scriptName, "Init liste home");

        if (config.memory.home === undefined) {
            config.memory.home = homes[0]
            info_perf.log(scriptName, "Init home in config");
        }

        home_spawns = Game.rooms[config.home].find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_SPAWN
        });
        info_perf.log(scriptName, "Get home spawn");
    }


    let others_spawns = _.difference(Object.values(Game.spawns), home_spawns)
    let spawns = home_spawns.concat(others_spawns);
    info_perf.log(scriptName, "Get list spawn");

    for (let spawn of spawns) {
        let ret = create_creep(config, spawn);
        if (ret === OK) {
            return true;
        }
    }



    info_perf.finish(scriptName);
    return false;
}

let create_creep = function(config, spawn) {

    let scriptName = "creep.create";
    info_perf.init(scriptName, false);

    if (spawn == undefined) return;
    if (config.strict == undefined) config.strict = false;

    let ret = false;

    energyAvailable = spawn.room.energyAvailable;
    costBody = 0;
    body = [];

    let okLaunchSpawn = false;

    let message = config.role + ", home:" + config.home + "(" + spawn.room.name + ")";

    info_perf.log(scriptName, "Initialisation de variable");

    if (config.strict) {
        config.model.forEach((module) => okLaunchSpawn = add_part(module))
    } else {
        let indexSpe = 0;
        while (add_part(config.model[indexSpe])) {
            indexSpe = (indexSpe + 1) % config.model.length;
        }
    }
    info_perf.log(scriptName, "construction du body");

    message += " (" + body.length + " parts) (" + costBody + "/" + energyAvailable + ")";

    if (!config.strict) {
        okLaunchSpawn = body.length >= 3
        info_perf.log(scriptName, "vérification de la taille mini du body");
    }

    //message += "config.strict " + config.strict + " okLaunchSpawn " + okLaunchSpawn;
    if (okLaunchSpawn) {
        let json_memory = {
            role: config.role,
            color: config.color,
            range: config.range,
            home: config.home
        };
        config.memory = Object.assign(json_memory, config.memory)
        
        ret = spawn.spawnCreep(body, config.role + Game.time, {
            memory: config.memory
        });
        message += " spaw du creep (ret=" + ret + ")"
        info_perf.log(scriptName, "spaw du creep");
    } else {
        if (config.strict) {
            message += " config.model non respecté (move," + config.model + ")";
        } else {
            message += " ressource insuffisante";
        }
        info_perf.log(scriptName, "message erreur");
    }

    info_perf.simpleLog(scriptName, message);
    info_perf.finish(scriptName);
    return ret;
}

module.exports = {
    create_creep: create_creep,
    try_create_creep: try_create_creep
};