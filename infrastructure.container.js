var infrastructure = {
    build: function(room, sources){
        for (var i = sources.length - 1; i >= 0; i--) {
            var source = sources[i];
            
            // recuperer les sites de construction autour de la source
            var constrs = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1, {
                filter: (constr) => {
                    if (constr.structureType == STRUCTURE_CONTAINER) {
                        return true;
                    }
                    return false;
                }
            });
            
            // recuperer les structures autour de la source
            var structs = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (constr) => {
                    if (constr.structureType == STRUCTURE_CONTAINER) {
                        return true;
                    }
                    return false;
                }
            });
            
            //si il n'y a ni site de construction ni structure conteneur, l'ajouter
            if( constrs.length === 0 && structs.length === 0 ){
                 
                var x = source.pos.x + Math.floor((Math.random() * 3) - 1);
                var y = source.pos.y + Math.floor((Math.random() * 3) - 1);

                room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
                return true;
            }
        }
        return false;
    }
}

module.exports = infrastructure;
