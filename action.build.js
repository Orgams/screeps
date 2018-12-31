let actionMove = require('action.move');

let action = {
	do: function(creep){

		// Recuperer le site de construction de la salle le plus proche
		let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		let target = creep.pos.findClosestByRange(targets);

		// Chercher un site dans les autres salles si besoin
		if(target == null){
			targets = Game.constructionSites;
			target = targets[Object.keys(targets)[0]];

			// Passer le creep en mode global si la cible est dans une autre piece
			if(target == null){
				memoire.set("range", global, creep, 10);
			}
		}

		// Tenter de construire le site s'il existe
		if(target != null){
			if(creep.build(target) == ERR_NOT_IN_RANGE) {
				actionMove.do(creep, target);
			}
			return true;
		}
		return false;
	}
};

module.exports = action;
