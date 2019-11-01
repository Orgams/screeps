let bot = require('bot');

let info_perf = require('info_perf');

let role = {
    run: function(creep) {
    	let scriptName = "role_builder";
		info_perf.init(scriptName, false);

		let actions = ['build', 'repair','transfer', 'storager']
		info_perf.log(scriptName, "Début actions : " + actions);

		let ret = bot.run(creep, actions)

		info_perf.log(scriptName, "Fin actions : " + actions);
        return ret;
    }
}

module.exports = role;