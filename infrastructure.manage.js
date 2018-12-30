let infoPerf = require('info.perf');
let memoire = require('memoire');

let infrastructure = {
    manage: function(room) {

        let scriptName = "infrastructure.manage";
        infoPerf.init(scriptName, false);

        let sites = room.find(FIND_CONSTRUCTION_SITES);
        let newSite = sites.length != 0;
        if(newSite){
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

        infoPerf.log(scriptName, "init variable");

        let infrastructure_tasks = [
            "infrastructure_container", "infrastructure_spawner", "infrastructure_bind_structure_to_source", "infrastructure_tower",
            "infrastructure_road_contournement", "infrastructure_extension", "infrastructure_bind_contoller", "infrastructure_perif"
        ];

        for(let infrastructure_task of infrastructure_tasks){
            newSite = require(infrastructure_task).build(room, sources);
            let finsh = memoire.get(infrastructure_task+".finish", room);
            console.log(finsh)
            infoPerf.log(scriptName, infrastructure_task);
            if (newSite) {
                return newSite;
            }
        }

        infoPerf.finish(scriptName);
    }
};

module.exports = infrastructure;