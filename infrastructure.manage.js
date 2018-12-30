let Container = require('infrastructure.container');
let bind_structure_to_source = require('infrastructure.bind_structure_to_source');
let bind_contoller = require('infrastructure.bind_contoller')
let Perif = require('infrastructure.perif');

let infrastructure_spawner = require('infrastructure_spawner');
let infrastructure_road_contournement = require('infrastructure_road_contournement');
let infrastructure_extension = require('infrastructure_extension');
let infrastructure_tower = require('infrastructure_tower');



let infoPerf = require('info.perf');

let infrastructure = {
    manage: function(room) {

        let scriptName = "infrastructure.manage";
        infoPerf.init(scriptName, false);

        let sites = room.find(FIND_CONSTRUCTION_SITES);
        let newSite = sites.length != 0;
        let sources = room.find(FIND_SOURCES);

        // Détruire tout les site de constructions
        if (false) {
            let sites = room.find(FIND_CONSTRUCTION_SITES)
            for (let i = sites.length - 1; i >= 0; i--) {
                let site = sites[i];
                site.remove();
            }
        }

        infoPerf.log(scriptName, "init variable");

        /// ajouter des conteneurs autour des sources qui n'en ont pas
        // Parcourir les sources
        if (!newSite) {
            newSite = Container.build(room, sources);
            infoPerf.log(scriptName, "Ajouter des conteneurs autour des sources qui n'en ont pas");
        }

        // Creer un nouveau Spawner
        if (!newSite) {
            newSite = infrastructure_spawner.build(room, sources);
            infoPerf.log(scriptName, "Creer un nouveau Spawner");
        }

        // relier Les structures et les sources par des routes
        if (!newSite) {
            newSite = bind_structure_to_source.build(room, sources)
            infoPerf.log(scriptName, "Ajouter des routes entre les sources et les batiments");
        }

        // Creer des tourelles
        if (!newSite) {
            newSite = infrastructure_tower.build(room, sources)
            infoPerf.log(scriptName, "Creer des tourelles");
        }

        // Creer des voies de contournement
        if (!newSite) {
            newSite = infrastructure_road_contournement.build(room, sources)
            infoPerf.log(scriptName, "Creer des voies de contournement");
        }

        // Creer les extensions
        if (!newSite) {
            newSite = infrastructure_extension.build(room, sources)
            infoPerf.log(scriptName, "Creer les extensions");
        }

        // Relier les controllers par des routes
        if (!newSite) {
            newSite = bind_contoller.build(room);
            infoPerf.log(scriptName, "Ajouter des routes entre les controllers");
        }

        // Creer des perifieriques
        if (!newSite) {
            // Creer des perifieriques autour des sources
            //newSite = Perif.build(room, sources,1);
            //infoPerf.log(scriptName, "Creer les perifieriques sources 1");
            if (!newSite) {
                newSite = Perif.build(room, sources, 2);
                infoPerf.log(scriptName, "Creer les perifieriquessources 2");
            }
            if (!newSite) {
                newSite = Perif.build(room, [room.controller], 4);
                infoPerf.log(scriptName, "Creer les perifieriquescontroleur 4");
            }
            // Creer des perifieriques autour des storages
            if (!newSite) {
                let containers = room.find(FIND_STRUCTURES, {
                    filter: (struct) => struct.structureType == STRUCTURE_STORAGE
                });
                newSite = Perif.build(room, containers, 3);
                infoPerf.log(scriptName, "Creer les perifieriques containers 3");
            }
        }
        infoPerf.finish(scriptName);
    }
};

module.exports = infrastructure;