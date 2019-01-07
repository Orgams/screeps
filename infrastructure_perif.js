let infrastructure_create = require('infrastructure_create');
let infrastructure_get = require('infrastructure_get');
let info_perf = require('info_perf');

let build = function(room, sources) {
    let scriptName = "infrastructure_perif";
    info_perf.init(scriptName, true);

    let newSite = false;

    if (!newSite) {
        newSite = build_perif(room, sources, 2);
        info_perf.log(scriptName, "fin sources", newSite);
    }
    if (!newSite) {
        newSite = build_perif(room, [room.controller], 4);
        info_perf.log(scriptName, "fin controller", newSite);
    }
    // if (!newSite) {
    //     let containers = room.find(FIND_STRUCTURES, {
    //         filter: (struct) => struct.structureType == STRUCTURE_STORAGE
    //     });
    //     newSite = build_perif(room, containers, 3);
    // }

    info_perf.finish(scriptName);
    return newSite;
}

let build_perif = function(room, targets, distance) {

    let dist = distance || 1;

    // Essayer de construire des routes autoure des sources
    for (let i = targets.length - 1; i >= 0; i--) {
        let target = targets[i];
        if (room.memory[target.id] === undefined) room.memory[target.id] = {};
        if (room.memory[target.id]['perif'] === undefined) room.memory[target.id]['perif'] = {};
        if (room.memory[target.id]['perif'][dist] === undefined) room.memory[target.id]['perif'][dist] = false;

        if (!room.memory[target.id]['perif'][dist]) {
            let poss = infrastructure_get.perif(target, dist, room);
            for (let j = poss.length - 1; j >= 0; j--) {
                let pos = poss[j];
                let ret = infrastructure_create.create(pos, STRUCTURE_ROAD);
                if (ret === OK) {
                    return true;
                }
            }
            room.memory[target.id]['perif'][dist] = true;
        }
    }
    return false;
}


module.exports = {
    build: build
}