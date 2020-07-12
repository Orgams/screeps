let bot = require('bot');

let role = {
	run: function(creep) {
		return bot.run(creep, ['destroy']);
	}
}

module.exports = role;