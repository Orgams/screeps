var bot = require('bot');

var role = {
    run: function(creep) {
        return bot.run(creep, ['transfer'], [FIND_DROPPED_RESOURCES, STRUCTURE_CONTAINER, STRUCTURE_STORAGE]);
    }
}

module.exports = role;