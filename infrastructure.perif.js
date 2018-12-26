let infrastructure_create = require('infrastructure_create');

let infrastructureGet= require('infrastructure.get');

let infrastructure = {

    build: function(room, targets, distance){
        
        let dist = distance || 1;
        
        // Essayer de construire des routes autoure des sources
        for (let i = targets.length - 1; i >= 0; i--) {
            let target = targets[i];
            if(room.memory[target.id] === undefined)room.memory[target.id]={};
            if(room.memory[target.id]['perif'] === undefined)room.memory[target.id]['perif']={};
            if(room.memory[target.id]['perif'][dist] === undefined)room.memory[target.id]['perif'][dist]=false;
            
            if (!room.memory[target.id]['perif'][dist]){
                let poss = infrastructureGet.perif(target, dist, room);
                for (let j = poss.length - 1; j >= 0; j--) {
                    let pos = poss[j];
                    let ret = infrastructure_create.create(pos, STRUCTURE_ROAD);
                    if(ret === OK){
                        return true;
                    }
                }
                room.memory[target.id]['perif'][dist]=true;
            }
        }
        return false;
    }
}

module.exports = infrastructure;
