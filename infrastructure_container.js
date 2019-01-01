let infrastructure_create = require('infrastructure_create');
let infrastructure_get = require('infrastructure_get');

let infoPerf = require('info.perf');

let infrastructure = {
    build: function(room, sources) {
        let scriptName = "infrastructure_container";
        infoPerf.init(scriptName, true, room, sources);


        for (let i = sources.length - 1; i >= 0; i--) {
            let source = sources[i];
            infoPerf.log(scriptName, "debut source ", source);

            // recuperer les sites de construction de containers autour de la source
            let constrs = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1, {
                filter: (constr) => {
                    if (constr.structureType == STRUCTURE_CONTAINER) {
                        return true;
                    }
                    return false;
                }
            });
            infoPerf.log(scriptName, "recuperer les sites de construction de containers autour de la source");

            // recuperer les containers autour de la source
            let structs = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (constr) => {
                    if (constr.structureType == STRUCTURE_CONTAINER) {
                        return true;
                    }
                    return false;
                }
            });
            infoPerf.log(scriptName, "recuperer les containers autour de la source");

            // Ajouter le site de construction s'il n'existe pas et s'il n'y a pas de conteneur
            if (constrs.length === 0 && structs.length === 0) {
                console.log(source, room.controller, 1, room.name)
                let pos = infrastructure_get.pos_on_path(source, room.controller, 1, room.name);
                console.log(pos)
                infrastructure_create.create(pos, STRUCTURE_CONTAINER);
                return true;
            }
            infoPerf.log(scriptName, "Ajouter le site de construction s'il n'existe pas et s'il n'y a pas de conteneur");

            
        }
        infoPerf.finish(scriptName);
        return false;
    }
}

module.exports = infrastructure;