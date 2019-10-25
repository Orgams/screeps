let info_pos = require('info_pos');

let info_perf = require('info_perf');

let action = {
    do: function(creep, target){
        if(target === null)return
        scriptName="action.move";

        info_perf.init(scriptName, false);

        let energyDroped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if(energyDroped.length > 0 && creep.carry.energy != creep.carryCapacity){
            creep.pickup(energyDroped[0]);
        }else{
            let pos = info_pos.get_pos(target);
            //info_perf.simpleLog(scriptName, creep + target + pos)
            let ret = creep.moveTo(pos, {visualizePathStyle: {
                stroke: creep.memory.color,
                fill: 'transparent',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: .3
            }});
            //info_perf.simpleLog(scriptName, ret)
        }
    }
};

module.exports = action;
