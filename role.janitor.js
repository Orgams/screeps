var bot = require('bot');

var role = {
    run: function(creep) {
        return bot.run(creep, ['janitor'], [FIND_DROPPED_RESOURCES]);
    }
}

module.exports = role;