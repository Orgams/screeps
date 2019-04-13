let color = {
    get: function(roleCreep){
        switch (roleCreep) {
            case 'transferer' : return "#00ff00";
            case 'janitor' : return "#00ffff";
            case 'miner' : return "#ff00ff";
            case 'builder' : return "#ff0000";
            case 'upgrader' : return "#0000ff";
            case 'repairer' : return "#ff9900";
            case 'claimer' : return "#ffff00";
        }
    }
};

module.exports = color;