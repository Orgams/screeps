let bot = require('bot');

let role = {
    run: function(creep) {
        return bot.run(creep, ['repair', 'build', 'transfer', 'storager']);
    }
}

module.exports = role;