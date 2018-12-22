let creepManage = require('creep.manage');
let structManage = require('infrastructure.manage');

let infoPerf = require('info.perf');

let bot = require('bot');

module.exports.loop = function() {

    // Je suis sur github ^^

    let scriptName = "main";
    infoPerf.init(scriptName, false);

    try {
        let towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
        towers.forEach(function(tower) {
            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            } else if (tower.energy > tower.energyCapacity / 2) {

                let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax / 2 && structure.structureType != STRUCTURE_WALL
                });
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                } else {

                    let closestAlly = tower.pos.findClosestByRange(FIND_CREEPS, {
                        filter: (target) => target.hits < target.hitsMax
                    });
                    if (closestAlly) {
                        tower.heal(closestAlly);
                    }
                }
            }
        })
        infoPerf.log(scriptName, "towers");
    } catch (error) {
        console.log("[main] towers : ", error);
    }

    try {
        // Assign all role
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            require('role.' + creep.memory.role).run(creep);
        }
        infoPerf.log(scriptName, "creeps work");
    } catch (error) {
        console.log("[main] creeps work : ", error);
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

        Memory["containers"] = containers;
        Memory["sources"] = sources;
        infoPerf.log(scriptName, "Initialiser la mémoire");
    }

    try {
        // Create necessary creeps for all rooms
        if (Game.time % 10 == 0) {

            let room = Game.rooms["W2N24"];



            if (room.memory.nb === undefined) room.memory.nb = {};
            room.memory.nb.containers = _.filter(room.find(FIND_STRUCTURES), (structure) => structure.structureType == STRUCTURE_CONTAINER).length;
            creepManage.manage_creep(room);

            infoPerf.log(scriptName, "creeps creation");
        }
    } catch (error) {
        console.log("[main] creeps creation : ", error);
    }

    try {
        if (Game.time % 20 == 0) {
            for (let roomName in Game.rooms) {
                let room = Game.rooms[roomName];
                structManage.manage(room);
            }
            infoPerf.log(scriptName, "structures");
        }
    } catch (error) {
        console.log("[main] structures : ", error);
    }

    try {
        // Clean up creeps dead memory (RIP)
        for (let i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
        infoPerf.log(scriptName, "clean memory");
    } catch (error) {
        console.log("[main] clean memory : ", error);
    }
    infoPerf.finish(scriptName);

    //let scriptName = "";
    //infoPerf.init(scriptName,true);
    //infoPerf.log(scriptName, "");
    //infoPerf.finish(scriptName);

    //console.log(Game.time,"--------------------------------------------------");

    //if(creep.memory.role == 'transferer') {
    //    console.log(creep.name,targets)
    //}
}