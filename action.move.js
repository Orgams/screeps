let info_pos = require('info_pos');

let info_perf = require('info_perf');

let memoire = require('memoire');

let action = {
    do: function(creep, target){
        if(target === null)return false;
        scriptName="action.move";

        info_perf_state=false; //require('memoire').get("role", creep)==="builder";
        info_perf.init(scriptName, info_perf_state);

        if(target === null){
            info_perf.finish(scriptName)
            return false;
        }
        let energyDroped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if(energyDroped.length > 0 && creep.carry.energy != creep.carryCapacity){
            info_perf.log(scriptName, "Ramasser l'energy au sol")
            creep.pickup(energyDroped[0]);
        }else{
            let pos = info_pos.get_pos(target);

            console.log("pos : ",pos, "target : ",target)
            let target_id=pos.roomName+"-"+pos.x+"-"+pos.y;

            let pos_tmp = memoire.get("move."+target_id, creep);

            if(pos_tmp === undefined){
                let path = creep.pos.findPathTo(pos);
                path = path.slice(0, 20);

                let point=path[path.length-1];
                pos_tmp = new RoomPosition(point.x, point.y, creep.room.name);

                memoire.set("move."+target_id, pos_tmp, creep, path.length-1);
            }

            pos_tmp = new RoomPosition(pos_tmp.x, pos_tmp.y, pos_tmp.roomName);

            console.log(pos_tmp)

            info_perf.log(scriptName, "aller vers la cible : " + "creep : " + creep + " (" + typeof creep + ") " + "target : " + target + " (" + typeof target + ") " + " " + "pos : " + pos + " (" + typeof pos + ") ")
            let ret = creep.moveTo(pos_tmp, {visualizePathStyle: {
                stroke: creep.memory.color,
                fill: 'transparent',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: .3
            }});
            if(ret === ERR_NO_PATH){
                info_perf.finish(scriptName)
                return false;
            }
        }
        info_perf.finish(scriptName)
        return true;
    }
};

module.exports = action;
