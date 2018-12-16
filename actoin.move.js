var action = {
    do: function(creep, target){
        var energyDroped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if(energyDroped.length > 0 && creep.carry.energy != creep.carryCapacity){
            creep.pickup(energyDroped[0]);
        }else{
        	creep.moveTo(target, {visualizePathStyle: {
        	    stroke: creep.memory.color,
                fill: 'transparent',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: .3
        	}});
        }
    }
};

module.exports = action;
