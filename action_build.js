let actionMove = require('action_move');

let memoire = require('memoire');

let info_creep = require('info_creep');

let info_perf = require('info_perf');

let action = {
	do: function(creep){

		let scriptName = "action_build";
		let info_perf_state=false;//require('memoire').get("role", creep)==="builder";
		info_perf.init(scriptName, info_perf_state);

		// Recuperer le site de construction de la salle le plus proche
		let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		let target = creep.pos.findClosestByRange(targets);
		info_perf.log(scriptName, "cible la plus proche", target);

		// Chercher un site dans les autres salles si besoin
		if(target === null){
			targets = Game.constructionSites;
			target = targets[Object.keys(targets)[0]];
			info_perf.log(scriptName, "cible des autre salles", target);

			// Passer le creep en mode global si la cible est dans une autre piece
			if(target !== null){
				info_creep.set_global(creep);
			}
		}

		// Tenter de construire le site s'il existe
		if(target !== null && target !== undefined){
			info_perf.log(scriptName, "construire le site", target);
			if(creep.build(target) == ERR_NOT_IN_RANGE) {
				info_perf.log(scriptName, "trop loin, avancer", target);
				actionMove.do(creep, target);
			}
			info_perf.finish(scriptName)
			return true;
		}
		info_perf.finish(scriptName)
		return false;
	}
};

module.exports = action;
