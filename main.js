let creepManage = require('creep.manage');
let structManage = require('infrastructure.manage');
let memoire = require('memoire');
let info_perf = require('info_perf');
let bot = require('bot');
let info_room = require('info.room');
let tower_action = require('tower_action');

module.exports.loop = function() {

    let scriptName = "main";
    info_perf.init(scriptName, false);

    try {
        let towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
        for (let tower of towers) {
            tower_action.run(tower)
        }
        info_perf.log(scriptName, "towers");
    } catch (error) {
        info_perf.simpleLog(scriptName, "[main] towers : " + error);
    }

    try {
        // Assign all role
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            roleName = memoire.get("role", creep);
            if(roleName === undefined){
                console.log(creep.name.match("[a-z]*"));
            }
            require('role.' + creep.memory.role).run(creep);
        }
        info_perf.log(scriptName, "creeps work");
    } catch (error) {
        info_perf.simpleLog(scriptName, "[main] creeps work : " + error);
    }

    // Initialiser la mémoire
    if (Game.time % 60 == 0) {
        let structs = [];
        let sources = [];
        for (room of Object.values(Game.rooms)) {
            roomStruct = room.find(FIND_STRUCTURES);
            structs = structs.concat(roomStruct);

            roomSources = room.find(FIND_SOURCES_ACTIVE);
            sources = sources.concat(roomSources);
        }
        let containers = _.filter(structs, (structure) => structure.structureType == STRUCTURE_CONTAINER)

        Memory["nb.containers"] = containers.length;

        //Game.getObjectById
        //Memory["structures"] = structs;
        Memory["containers"] = containers;
        Memory["sources"] = sources;
        info_perf.log(scriptName, "Initialiser la mémoire");
    }

    try {
        // Create necessary creeps for all rooms
        if (Game.time % 10 == 0) {

            let room = Game.rooms["W2N24"];



            if (room.memory.nb === undefined) room.memory.nb = {};
            room.memory.nb.containers = _.filter(room.find(FIND_STRUCTURES), (structure) => structure.structureType == STRUCTURE_CONTAINER).length;
            creepManage.manage_creep(room);

            info_perf.log(scriptName, "creeps creation");
        }
    } catch (error) {
        info_perf.simpleLog(scriptName, "[main] creeps creation : " + error);
    }

    try {
        if (Game.time % 5 == 0) {
            
            for (let room of info_room.get_my_room()) {
                structManage.manage(room);
            }
            info_perf.log(scriptName, "structures");
        }
    } catch (error) {
        info_perf.simpleLog(scriptName, "[main] structures : " + error);
    }

    try {
        // Clean up creeps dead memory (RIP)
        for (let i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
        info_perf.log(scriptName, "clean memory");
    } catch (error) {
        info_perf.simpleLog(scriptName, "[main] clean memory : " + error);
    }
    info_perf.finish(scriptName);

    info_perf.simpleLog(scriptName, Game.time + "--------------------------------------------------");
}