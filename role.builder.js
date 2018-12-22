let bot = require('bot');

let role = {
    run: function(creep) {
        return bot.run(creep, ['build', 'repair','transfer', 'storager']);
    }
}

module.exports = role;