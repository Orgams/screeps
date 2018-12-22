let infrastructureContainer  = require('infrastructure.container');
let infrastructureRoadbinder = require('infrastructure.roadbinder');
let infrastructurePerif = require('infrastructure.perif');

let infoPerf = require('info.perf');

let infrastructure = {
    manage: function(room){
        
        let scriptName = "infrastructure.manage";
        infoPerf.init(scriptName,false);
        
        let sites = room.find(FIND_CONSTRUCTION_SITES);
        let newSite = sites.length != 0;
        let sources = room.find(FIND_SOURCES);
        
        // Détruire tout les site de constructions
        if(false){
            let sites = room.find(FIND_CONSTRUCTION_SITES)
            for (let i = sites.length - 1; i >= 0; i--) {
                let site = sites[i];
                site.remove();
            }
        }
        
        infoPerf.log(scriptName, "init variable");
        
        /// ajouter des conteneurs autour des sources qui n'en ont pas
        // Parcourir les sources
        if (!newSite){
            newSite = infrastructureContainer.build(room, sources)
            infoPerf.log(scriptName, "Ajouter des conteneurs autour des sources qui n'en ont pas");
        }
        
        // relier Les structures et les sources par des routes
        if(!newSite){
            newSite = infrastructureRoadbinder.build(room, sources)
            infoPerf.log(scriptName, "Ajouter des routes entre les sources et les batiments");
        }
        
        // Creer des perifieriques
        if(!newSite){
            // Creer des perifieriques autour des sources
            //newSite = infrastructurePerif.build(room, sources,1);
            infoPerf.log(scriptName, "Creer les perifieriques sources 1");
            if(!newSite){
                newSite = infrastructurePerif.build(room, sources,2);
                infoPerf.log(scriptName, "Creer les perifieriquessources 2");
            }
            if(!newSite){
                newSite = infrastructurePerif.build(room, [room.controller], 4);
                infoPerf.log(scriptName, "Creer les perifieriquescontroleur 4");
            }
            // Creer des perifieriques autour des storages
            if(!newSite){
                let containers = room.find(FIND_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_STORAGE });
                newSite = infrastructurePerif.build(room, containers, 3);
                infoPerf.log(scriptName, "Creer les perifieriques containers 3");
            }
        }
        
        infoPerf.finish(scriptName);
    }
};

module.exports = infrastructure;
