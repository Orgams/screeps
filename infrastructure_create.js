let info_pos = require('info_pos');

let create = function(pos, struct_type) {
	pos = info_pos.get_pos(pos);
	let terrain = pos.lookFor(LOOK_TERRAIN);
	if (terrain != "plain" && terrain != "swamp") {
		return false;
	}
	let ret = pos.createConstructionSite(struct_type);
	//infoPerf.simpleLog(scriptName, "create road : " + pos.x +" "+ pos.y +" "+ terrain+" "+ terrain != "plain" +" "+terrain != "swamp"+" "+ ret)
	return ret;
}

module.exports = {
	create: create
}