var bot = require('bot');

var role = {
    run: function(creep) {
        return bot.run(creep, ['upgrade']);
    }
}

module.exports = role;