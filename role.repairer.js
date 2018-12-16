var bot = require('bot');

var role = {
    run: function(creep) {
        return bot.run(creep, ['repair','transfer', 'storager', 'build']);
    }
}

module.exports = role;