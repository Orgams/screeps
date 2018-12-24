let infrastructure = {
    build: function(room, sources) {
        console.log("Creer des voies de contournement")

        let structs = room.find(FIND_MY_STRUCTURES);

        for(let struct of structs){
            console.log(struct)
        }

        return false;
    }
}

module.exports = infrastructure;