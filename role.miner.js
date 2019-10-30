let actionHarvest = require('action.harvest');
let actionMove = require('action.move');
let actionMine = require('action.mine')
let memoire = require('memoire');

function find_free_container (structure) {
    if (structure.structureType == STRUCTURE_CONTAINER) {
        var creeps_on_container = structure.pos.findInRange(FIND_MY_CREEPS, 0);
        if (creeps_on_container.length === 1) {
            let role = memoire.get("role", creeps_on_container[0]);
            console.log(role)
            if (role !== "miner") {
                return true;
            } else {
                return false
            }
        } else {
            return true;
        }
    }
    return false;
}

let role = {

    /** @param {Creep} creep **/
    run: function(creep) {

        creep.room.visual.circle(creep.pos, {
            fill: 'transparent',
            radius: 0.55,
            stroke: creep.memory.color
        });

        if (Game.flags[creep.memory.role] != undefined) {
            actionMove.do(creep, Game.flags[creep.memory.role]);
            return true;
        }

        // Vérifier si je suis sur un container
        let containers = _.filter(creep.pos.lookFor(LOOK_STRUCTURES), (structure) => structure.structureType == STRUCTURE_CONTAINER);
        let onContainer = containers.length != 0;

        // Miner si je suis sur un container
        if (onContainer) {
            actionMine.do(creep);
            return true;
        }

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: find_free_container
        });
        if (target === null) {
            targets = Memory["containers"];
            targets = _.filter(targets, (structure) => {
                let pos = new RoomPosition(structure.pos.x, structure.pos.y, structure.room.name);
                return pos.findInRange(FIND_MY_CREEPS, 0).length === 0
            })
            target = targets[0];
        }
        if (target !== undefined) {
            actionMove.do(creep, target)
        }
        
    }
}

module.exports = role;