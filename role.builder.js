let bot = require('bot');

let info_perf = require('info_perf');

let role = {
    run: function(creep) {
    	let scriptName = "role.builder";
		info_perf.init(scriptName, false);
		let actions = ['build', 'repair','transfer', 'storager']
		info_perf.log(scriptName, "actions : " + actions);
        return bot.run(creep, actions);
    }
}

module.exports = role;