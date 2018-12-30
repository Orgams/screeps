let infrastructure_create = require('infrastructure_create');

let infrastructure_get = require('infrastructure_get');

let infrastructure = {
    build: function(room, sources){
        for (let i = sources.length - 1; i >= 0; i--) {
            let source = sources[i];
            
            // recuperer les sites de construction de containers autour de la source
            let constrs = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1, {
                filter: (constr) => {
                    if (constr.structureType == STRUCTURE_CONTAINER) {
                        return true;
                    }
                    return false;
                }
            });
            
            // recuperer les containers autour de la source
            let structs = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (constr) => {
                    if (constr.structureType == STRUCTURE_CONTAINER) {
                        return true;
                    }
                    return false;
                }
            });
            
            //si il n'y a ni site de construction ni structure conteneur, l'ajouter
            if( constrs.length === 0 && structs.length === 0 ){
                let pos = infrastructure_get.pos_on_path(source, room.controller, 1, room.name);
                infrastructure_create.create(pos, STRUCTURE_CONTAINER);
                return true;
            }
        }
        return false;
    }
}

module.exports = infrastructure;
