var bot = require('bot');

var role = {
    run: function(creep) {
        return bot.run(creep, ['transfer', 'storager', 'repair', 'build']);
    }
}

module.exports = role;