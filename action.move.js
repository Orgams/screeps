let info_pos = require('info_pos');

let info_perf = require('info_perf');

let memoire = require('memoire');

let action_pickup_close = require('action_pickup_close');

let action = {
    do: function(creep, target){

        // Initialiser info perf
        scriptName="action.move";
        let info_perf_state=false; //require('memoire').get("role", creep)==="builder";
        info_perf.init(scriptName, info_perf_state);

        // Controler les parametres d'entré
        if(target === null || target === undefined){
            info_perf.log(scriptName,"parametre incorecte" + creep + " " + creep.memory.range + " " + creep.memory.harvest  + " " + "target : " + target + " (" + typeof target + ") ");
            info_perf.finish(scriptName)
            return false;
        }

        // Ramasser l'energy au sol s'il y en a
        if(action_pickup_close.do(creep)){
            info_perf.log(scriptName, "Ramasser l'energy au sol")
            info_perf.finish(scriptName)
            return true;
        }

        // Initialiser les variables
        let pos = info_pos.get_pos(target);
        let target_id=pos.roomName+"-"+pos.x+"-"+pos.y;
        let pos_tmp = memoire.get("move."+target_id, creep);

        // Initialiser la position de déplacement intermaidière si elle n'est pas en cache
        if(pos_tmp === undefined){
            let path = creep.pos.findPathTo(pos);
            path = path.slice(0, 20);

            let point=path[path.length-1];
            pos_tmp = new RoomPosition(point.x, point.y, creep.room.name);

            memoire.set("move."+target_id, pos_tmp, creep, path.length-1);
        }

        // recreer la room position
        let room_tmp = new RoomPosition(pos_tmp.x, pos_tmp.y, pos_tmp.roomName);

        // Déplacer le creep vers la cible
        info_perf.log(scriptName, "aller vers la cible : " + "creep : " + creep + " (" + typeof creep + ") " + "target : " + target + " (" + typeof target + ") " + " " + "pos : " + pos + " (" + typeof pos + ") ")
        let ret = creep.moveTo(room_tmp, {visualizePathStyle: {
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
        
        // Retourner vrai
        info_perf.finish(scriptName)
        return true;
    }
};

module.exports = action;
