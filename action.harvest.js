let actionMove = require('action.move');
let actionPickup = require('action.pickup');
let info_perf = require('info_perf');

let actionHarvest = {
    do: function(creep, srcs) {
        let scriptName = "action_harvest " + creep;
        let debug = creep.room.name === "W3N24";
        info_perf.init(scriptName, debug, creep.room);


        let sources = srcs;

        if (sources === undefined) {
            sources = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, FIND_DROPPED_RESOURCES, FIND_SOURCES_ACTIVE];
        }
        info_perf.log(scriptName, "Initialisation des variables");

        let target = false;

        for (let source of sources) {
            target = findTarget(creep, source);
            if (target) {
                if (take(creep, source, target) == ERR_NOT_IN_RANGE) {
                    actionMove.do(creep, target);
                }
                info_perf.log(scriptName, "Récolte pour " + source);
                info_perf.finish(scriptName);
                return true;
            }
            info_perf.log(scriptName, "Impossible de récolter pour " + source);
        }
        info_perf.finish(scriptName);
        return false;

    }
};

let take = function(creep, source, target) {
    if ([STRUCTURE_CONTAINER, STRUCTURE_STORAGE].includes(source)) {
        return creep.withdraw(target, RESOURCE_ENERGY);
    }
    if ([FIND_DROPPED_RESOURCES].includes(source)) {
        return creep.pickup(target);
    }
    if ([FIND_SOURCES_ACTIVE].includes(source)) {
        return creep.harvest(target);
    }
}

let findTarget = function(creep, source) {

    let targets = [];
    if ([STRUCTURE_CONTAINER, STRUCTURE_STORAGE].includes(source)) {
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                if (structure.structureType == source) {
                    let path = creep.pos.findPathTo(structure, {
                        ignoreCreeps: true
                    });
                    let coutDist = path.length * 10;
                    let totalCarry = 0;
                    for (let amountTypeCarry of Object.values(creep.carry)) {
                        totalCarry += amountTypeCarry;
                    }
                    let stockRest = creep.carryCapacity - totalCarry;
                    let energy_min = stockRest + coutDist;
                    if (structure.store[RESOURCE_ENERGY] > energy_min) {
                        return true;
                    }
                }
                return false;
            }
        });
    }
    if ([FIND_DROPPED_RESOURCES].includes(source)) {
        targets = creep.room.find(FIND_DROPPED_RESOURCES);
    }
    if ([FIND_SOURCES_ACTIVE].includes(source)) {
        // Recolter sur les sources si il n'y a pas le bon nombre de mineur
        if (Memory["nb.containers"] > Memory["nb.miner"]) {
            targets = creep.room.find(FIND_SOURCES_ACTIVE);
        }
    }
    if (targets.length === 0) {
        return false;
    }
    let ret = creep.pos.findClosestByPath(targets);
    console.log("ret : ", ret, "targets : ", targets)
    return ret;
}

module.exports = actionHarvest;