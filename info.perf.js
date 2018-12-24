let times = {};
let start = {};
let activate = {};

let info = {
	init:function(script, activation) {
		activate[script] = activation;
		if(activate[script]){
			times[script] = new Date().getTime();
			start[script] = times[script];
			console.log("["+script+"]","--------------------------");
		}
	},
	finish:function(script) {
		if(activate[script]){
			let now = new Date().getTime();
			console.log("["+script+"]","-------- Total :",now-start[script]+" ms");
		}
	},
	log: function(script, message) {
		if(activate[script]){
			let old = times[script];
			let now = new Date().getTime();
			if(!old){
				old = now;
			}
			console.log("["+script+"] -> ",message+ " :", now - old+ "ms");
			times[script] = now;
		}
		
	},
	logWithoutTimer: function(script, ...messages) {
		if(activate[script]){
			console.log("["+script+"]",message);
		}
		
	},
	simpleLog: function(script, ...messages) {
		console.log("["+script+"]",messages);
	}
};

module.exports = info;