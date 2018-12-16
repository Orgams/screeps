var actionTranfser = require('action.transfer');

var action = {
    do: function(creep){
        let res = actionTranfser.do(creep);
        console.log(res)
        return res;
    }
};

module.exports = action;