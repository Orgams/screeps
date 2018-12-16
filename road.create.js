var road = {
    create: function(pos){
        var terrain = pos.lookFor(LOOK_TERRAIN);
        if (terrain != "plain" && terrain != "swamp") return false;
        var ret = pos.createConstructionSite(STRUCTURE_ROAD);
        //console.log("create road : ", pos.x, pos.y, terrain, terrain != "plain" ,terrain != "swamp", ret)
        return ret;
    }
}

module.exports = road;