var actionTranfser = require('action.transfer');

var action = {
    do: function(creep){
        let res = actionTranfser.do(creep);
        return res;
    }
};

module.exports = action;