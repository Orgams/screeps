let action = {
    do: function(creep, target){
        if(target === null)return
        let energyDroped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if(energyDroped.length > 0 && creep.carry.energy != creep.carryCapacity){
            creep.pickup(energyDroped[0]);
        }else{
            if (target.roomName === undefined) {
                target = target.pos;
            }
            const pos = new RoomPosition(target.x, target.y, target.roomName);
            //infoPerf.simpleLog(scriptName, creep + target + pos)
        	let ret = creep.moveTo(pos, {visualizePathStyle: {
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
