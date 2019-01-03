let actionMove = require('action.move');

let memoire = require('memoire');

let info_creep = require('info_creep');

let action = {
	do: function(creep){

		// Recuperer le site de construction de la salle le plus proche
		let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		let target = creep.pos.findClosestByRange(targets);

		console.log (target)

		// Chercher un site dans les autres salles si besoin
		if(target === null){
			targets = Game.constructionSites;
			target = targets[Object.keys(targets)[0]];

			// Passer le creep en mode global si la cible est dans une autre piece
			if(target !== null){
				info_creep.set_global(creep);
			}
		}

		console.log (target)
		
		// Tenter de construire le site s'il existe
		if(target !== null){
			if(creep.build(target) == ERR_NOT_IN_RANGE) {
				actionMove.do(creep, target);
			}
			return true;
		}
		return false;
	}
};

module.exports = action;
