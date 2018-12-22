let bot = require('bot');

let role = {
    run: function(creep) {
        return bot.run(creep, ['repair','transfer', 'storager', 'build']);
    }
}

module.exports = role;