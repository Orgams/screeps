var roadCreate = require('road.create');
var infrastructureGet= require('infrastructure.get');

var infrastructure = {

    build: function(room, targets, distance){
        
        var dist = distance || 1;
        
        // Essayer de construire des routes autoure des sources
        for (var i = targets.length - 1; i >= 0; i--) {
            var target = targets[i];
            if(room.memory[target.id] === undefined)room.memory[target.id]={};
            if(room.memory[target.id]['perif'] === undefined)room.memory[target.id]['perif']={};
            if(room.memory[target.id]['perif'][dist] === undefined)room.memory[target.id]['perif'][dist]=false;
            
            if (!room.memory[target.id]['perif'][dist]){
                var poss = infrastructureGet.perif(target, dist, room);
                for (var j = poss.length - 1; j >= 0; j--) {
                    var pos = poss[j];
                    var ret = roadCreate.create(pos);
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
