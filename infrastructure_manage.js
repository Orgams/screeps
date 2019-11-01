let info_perf = require('info_perf');
let memoire = require('memoire');

let infrastructure = {
    manage: function(room) {

        let scriptName = "infrastructure_manage";
        let debug = room.name === "W3N24";
        info_perf.init(scriptName, false, room);

        let sites = room.find(FIND_CONSTRUCTION_SITES);
        let newSite = sites.length != 0;
        if (newSite) {
            return true;
        }
        let sources = room.find(FIND_SOURCES);

        // Détruire tout les site de constructions
        if (false) {
            for (let i = sites.length - 1; i >= 0; i--) {
                let site = sites[i];
                site.remove();
            }
        }

        info_perf.log(scriptName, "init variable");

        let infrastructure_tasks = [
            "infrastructure_bind_structure_to_source", 
            "infrastructure_spawner", 
            "infrastructure_tower",
            "infrastructure_extension", 
            "infrastructure_storage",
            "infrastructure_container", 
            "infrastructure_bind_structure_to_source_fin",
            "infrastructure_road_contournement", 
            "infrastructure_bind_contoller", 
            "infrastructure_perif"

        ];

        for (let infrastructure_task of infrastructure_tasks) {
            // Définir le clef mémoire pour noté si la tache est fini pour ce niveau de controlleur
            let key_memory = "finish." + infrastructure_task;

            // Définir le début du message
            let message = room + infrastructure_task + " : ";

            // Récuperer la clef mémoire 
            let is_finish = memoire.get(key_memory, room);

            // Creer l'infrastructure si cette tache n'a pas déjàété fini
            if (is_finish === undefined || is_finish < room.controller.level) {
                newSite = require(infrastructure_task).build(room, sources);

                if (newSite) {
                    info_perf.log(scriptName, message + "Creation")
                    return newSite;
                } else {
                    memoire.set(key_memory, room.controller.level, room);
                    info_perf.log(scriptName, message + "Note comme fini")
                }
            } else {
                info_perf.log(scriptName, message + "Deja fini")
            }
        }

        info_perf.finish(scriptName);
    }
};

module.exports = infrastructure;