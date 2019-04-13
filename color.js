let color = {
    get: function(roleCreep){
        switch (roleCreep) {
            case 'transferer' : console.log("#00ff00");
            case 'janitor' : console.log("#00ffff");
            case 'miner' : console.log("#ff00ff");
            case 'builder' : console.log("#ff0000");
            case 'upgrader' : console.log("#0000ff");
            case 'repairer' : console.log("#ff9900");
            case 'claimer' : console.log("#ffff00");
        }
    }
};

module.exports = color;