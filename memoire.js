let infoPerf = require('info.perf');

let scriptName = "memoire"

let memoire = {
	set: function(key, valeur, target, ttl) {
		let keyParts = key.split(".");
		let keyCur = keyParts[0];
		keyParts.shift(1);

		// Initialiser l'objet où il faut ajouter une donnée en mémoire
		let obj = null;
		if (target === undefined) {
			obj = Memory;
		} else {
			obj = target.memory;
		}

		// Appel récursif pour creer les objet et mettre la valeur à la fin
		setRecur(obj, keyCur, keyParts, valeur);

		// Ajouter une valeur ttl si demandé
		if (ttl !== undefined) {
			let keyParts = (key + "ttl").split(".");
			let keyCur = keyParts[0];
			keyParts.shift(1);

			setRecur(obj, keyCur, keyParts, Game.time + ttl);
		}
	},
	get: function(key, target) {
		let keyParts = key.split(".");
		let keyCur = keyParts[0];
		keyParts.shift(1);

		// Initialiser l'objet où il faut ajouter une donnée en mémoire
		let obj = null;
		if (target === undefined) {
			obj = Memory;
		} else {
			obj = target.memory;
		}

		// Appel récursif pour creer les objet et mettre la valeur à la fin
		return getRecur(obj, keyCur, keyParts);
	}
};

let getRecur = function(obj, keyCur, keyParts) {
	if (keyParts.length > 0) {
		obj = obj[keyCur];
		keyCur = keyParts[0];
		keyParts.shift(1);
		return getRecur(obj, keyCur, keyParts);
	} else {
		if(obj[keyCur+"ttl"] !== undefined && obj[keyCur+"ttl"] < Game.time){
			//infoPerf.simpleLog(scriptName, "data out to date");
			return null
		}
		return obj[keyCur];
	}
}

let setRecur = function(obj, keyCur, keyParts, valeur) {
	//infoPerf.simpleLog(scriptName, "----");
	//infoPerf.simpleLog(scriptName, obj, keyCur, keyParts, valeur);
	if (keyParts.length > 0) {
		if (obj[keyCur] === undefined) {
			obj[keyCur] = {};
		}
		obj = obj[keyCur];
		keyCur = keyParts[0];
		keyParts.shift(1);
		setRecur(obj, keyCur, keyParts, valeur);
	} else {
		obj[keyCur] = valeur;
	}
}

module.exports = memoire;