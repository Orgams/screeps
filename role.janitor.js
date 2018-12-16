var bot = require('bot');

var role = {
    run: function(creep) {
        return bot.run(creep, ['transfer', 'storager', 'repair', 'build'], [FIND_DROPPED_RESOURCES, STRUCTURE_CONTAINER, STRUCTURE_STORAGE]);
    }
}

module.exports = role;