let action = {
	do: function(creep){

		let scriptName = "role_claimer";
		info_perf.init(scriptName, true);

		let flag_destroy = Game.flags["destroy"]

		if(flag_destroy){
			same_room = flag_destroy.room === creep.room;
			if (same_room){

			}else{
				actionMove.do(creep, flag_destroy);
			}
			return true;
		}
		return false;
};

module.exports = action;