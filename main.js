var creepManage = require('creep.manage');
var structManage = require('infrastructure.manage');

var infoPerf = require('info.perf');

var bot = require('bot');

module.exports.loop = function () {

    // Je suis sur github ^^

    var scriptName = "main";
    infoPerf.init(scriptName,false);
    
    try {
        var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
        towers.forEach(function(tower){
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }else if (tower.energy > tower.energyCapacity/2) {
                
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax/2 && structure.structureType != STRUCTURE_WALL
                });
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }else{
                    
                    var closestAlly = tower.pos.findClosestByRange(FIND_CREEPS, {
                        filter: (target) => target.hits < target.hitsMax
                    });
                    if(closestAlly){
                        tower.heal(closestAlly);
                    }
                }
            }
        })
        infoPerf.log(scriptName, "towers");
    } catch(error) {
      console.log("[main] towers : ", error);
    }
    
    try{
        // Assign all role
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            require('role.'+creep.memory.role).run(creep);
        }
        infoPerf.log(scriptName, "creeps work");
    } catch(error) {
      console.log("[main] creeps work : ", error);
    }
    
    try{
        // Create necessary creeps for all rooms
        if (Game.time%1 == 0){

            var room = Game.rooms["W2N24"];;

            if(room.memory.nb === undefined)room.memory.nb={};
            room.memory.nb.containers = _.filter(room.find(FIND_STRUCTURES), (structure) => structure.structureType == STRUCTURE_CONTAINER).length;
            creepManage.manage_creep(room);

        infoPerf.log(scriptName, "creeps creation");
        }
    } catch(error) {
      console.log("[main] creeps creation : ", error);
    }
    
    try{
        if (Game.time%20 == 0){
            for(var roomName in Game.rooms) {
                var room = Game.rooms[roomName];
                structManage.manage(room);
            }
            infoPerf.log(scriptName, "structures");
        }
    } catch(error) {
      console.log("[main] structures : ", error);
    }
    
    try{
        // Clean up creeps dead memory (RIP)
        for(var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
        infoPerf.log(scriptName, "clean memory");
    } catch(error) {
      console.log("[main] clean memory : ", error);
    }
    infoPerf.finish(scriptName);
    
    //var scriptName = "";
    //infoPerf.init(scriptName,true);
    //infoPerf.log(scriptName, "");
    //infoPerf.finish(scriptName);
    
    //console.log(Game.time,"--------------------------------------------------");
    
    //if(creep.memory.role == 'transferer') {
    //    console.log(creep.name,targets)
    //}
}