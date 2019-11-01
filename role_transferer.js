let bot = require('bot');

let role = {
    run: function(creep) {
        return bot.run(creep, ['transfer', 'storager', 'repair', 'build'], [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, FIND_DROPPED_RESOURCES, FIND_SOURCES_ACTIVE]);
    }
}

module.exports = role;