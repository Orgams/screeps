let bot = require('bot');

let role = {
    run: function(creep) {
        return bot.run(creep, ['transfer', 'storager', 'repair', 'build']);
    }
}

module.exports = role;