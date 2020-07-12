let bot = require('bot');

let role = {
	run: function(creep) {
		return bot.run(creep, ['upgrade']);
	}
}

module.exports = role;