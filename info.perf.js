var times = {};
var start = {};
var activate = {};

var info = {
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
            var now = new Date().getTime();
            console.log("["+script+"]","-------- Total :",now-start[script]+" ms");
        }
    },
    log: function(script, message) {
        if(activate[script]){
            var old = times[script];
            var now = new Date().getTime();
            if(!old){
                old = now;
            }
            console.log("["+script+"]",message+ " :", now - old+ "ms");
            times[script] = now;
        }
        
    }
};

module.exports = info;