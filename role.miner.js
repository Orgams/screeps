var actionHarvest = require('action.harvest');
var actionMove = require('action.move');
var actionMine = require('action.mine')

var role = {

    /** @param {Creep} creep **/
    run: function(creep) {

        creep.room.visual.circle(creep.pos, {
            fill: 'transparent',
            radius: 0.55,
            stroke: creep.memory.color
        });

        if (Game.flags[creep.memory.role] != undefined) {
            actionMove.do(creep, Game.flags[creep.memory.role]);
            return;
        }

        // Recuperer les containers
        var containers = _.filter(creep.pos.lookFor(LOOK_STRUCTURES), (structure) => structure.structureType == STRUCTURE_CONTAINER);
        var onContainer = containers.length != 0;
        if (onContainer) {
            var container = containers[0];
            if (container.store[RESOURCE_ENERGY] < container.storeCapacity) {
                actionMine.do(creep)
            }
        } else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_CONTAINER) {
                        if (structure.pos.findInRange(FIND_MY_CREEPS, 0).length === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return false;
                }
            });
            if (target === null) {
                targets = Memory["containers"];
                targets = _.filter(targets, (structure) => {
                    let pos = new RoomPosition(structure.pos.x, structure.pos.y, structure.pos.roomName);
                    return pos.findInRange(FIND_MY_CREEPS, 0).length === 0
                })
                target = targets[0];
            }
            actionMove.do(creep, target)
        }
    }
}

module.exports = role;