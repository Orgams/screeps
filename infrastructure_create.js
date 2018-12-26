let create = function(pos, struct_type) {
	pos = new RoomPosition(pos.x, pos.y, pos.roomName);
	let terrain = pos.lookFor(LOOK_TERRAIN);
	if (terrain != "plain" && terrain != "swamp") return false;
	let ret = pos.createConstructionSite(struct_type);
	//infoPerf.simpleLog(scriptName, "create road : " + pos.x +" "+ pos.y +" "+ terrain+" "+ terrain != "plain" +" "+terrain != "swamp"+" "+ ret)
	return ret;
}

module.exports = {
	create: create
}