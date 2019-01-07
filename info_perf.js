let times = {};
let start = {};
let activate = {};

/*let scriptName = "";
info_perf.init(scriptName, true);
info_perf.log(scriptName, "");
info_perf.finish(scriptName);*/
let info = {
	init: function(script, activation, ...messages) {
		activate[script] = activation;
		if (activate[script]) {
			times[script] = new Date().getTime();
			start[script] = times[script];
			console.log("[" + script + "]", "--------", ...messages);
		}
	},
	finish: function(script) {
		if (activate[script]) {
			let now = new Date().getTime();
			console.log("[" + script + "]", "-------- Total :", now - start[script] + " ms");
		}
	},
	log: function(script, ...messages) {
		if (activate[script]) {
			let old = times[script];
			let now = new Date().getTime();
			if (!old) {
				old = now;
			}
			console.log("[" + script + "]" + " :", now - old + "ms -> ", messages);
			times[script] = now;
		}

	},
	logWithoutTimer: function(script, ...messages) {
		if (activate[script]) {
			console.log("[" + script + "]", message);
		}

	},
	simpleLog: function(script, ...messages) {
		console.log("[" + script + "]", messages);
	}
};

module.exports = info;