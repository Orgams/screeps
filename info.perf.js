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
			console.log("["+script+"]",message+ " :", now - old+ "ms");
			times[script] = now;
		}
		
	},
	simpleLog: function(script, message) {
		console.log("["+script+"]",message);
	}
};

module.exports = info;