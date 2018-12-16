var action = {
    do: function(creep, colorCreep){

        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
        var source = creep.pos.findClosestByRange(sources);
        if(source != null){
            creep.harvest(source);
            return true;
        }
        return false;  
    }
};

module.exports = action;