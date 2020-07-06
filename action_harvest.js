let actionMove = require('action_move');
let actionPickup = require('action_pickup');
let action_pickup_close = require('action_pickup_close');
let info_perf = require('info_perf');

let mess;

let actionHarvest = {
    do: function(creep, srcs) {

        let scriptName = "action_harvest " + creep;
        //let debug = creep.room.name === "W3N24";
        info_perf.init(scriptName, false, creep.room);


        // Ramasser l'energy au sol s'il y en a
        if(action_pickup_close.do(creep)){
            info_perf.log(scriptName, "Ramasser l'energy au sol")
            info_perf.finish(scriptName)
            return true;
        }

        let sources = srcs;

        // Initialisation des variables : sources
        if (sources === undefined) {
            sources = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, FIND_DROPPED_RESOURCES, FIND_SOURCES_ACTIVE];
        }
        info_perf.log(scriptName, "Initialisation des variables : sources : " + sources + " (" + typeof sources + ") ");

        let target = false;

        mess = ""

        for (let source of sources) {
            target = findTarget(creep, source);
            info_perf.log(scriptName, "Cible trouver pour " + source + " : " + target);
            mess += "Cible trouver pour " + source + " : " + target + "\n";
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
        mess += "Je ne peux pas récolter";
        info_perf.log(creep, "\n"+mess)
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
        mess += "STRUCTURE targets : " + targets + "\n";
    }

    if ([FIND_DROPPED_RESOURCES].includes(source)) {
        targets = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: (structure) => {
                if (structure.store[RESOURCE_ENERGY] > 10) {
                    return true;
                }
                return false;
            }
        });
        mess += "DROPPED_RESOURCES targets : " + targets + "\n";
    }



    if ([FIND_SOURCES_ACTIVE].includes(source)) {

        let has_more_sources_than_container = Memory["nb.sources"] !== Memory["nb.containers"];
        let has_more_container_than_miner = Memory["nb.containers"] > Memory["nb.miner"];
        let workerCanMine = has_more_sources_than_container || has_more_container_than_miner;

        mess += "has_more_sources_than_container : " + has_more_sources_than_container + "\n";
        mess += "has_more_container_than_miner : " + has_more_container_than_miner + "\n";
        mess += "workerCanMine : " + workerCanMine + "\n";

        if (workerCanMine) {
            targets = creep.room.find(FIND_SOURCES_ACTIVE);
        }
        mess += "SOURCES_ACTIVE targets : " + targets + "\n";
    }
    if (targets.length === 0) {
        return false;
    }
    let ret = creep.pos.findClosestByPath(targets);
    mess += "return : " + ret + "\n";
    return ret;
}

module.exports = actionHarvest;