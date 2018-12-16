var bot = require('bot');

var role = {
    run: function(creep) {
        return bot.run(creep, ['build', 'repair','transfer', 'storager']);
    }
}

module.exports = role;