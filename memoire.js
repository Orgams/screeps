let info_perf = require('info_perf');

let scriptName = "memoire"

let lock = function(key, target) {
	// Initialiser l'objet où il faut ajouter une donnée en mémoire
	let obj = getTarget(target);
}

let getTarget = function(target){
	if (target === undefined) {
		return Memory;
	} else {
		return target.memory;
	}
}

let set = function(key, valeur, target, ttl) {
	let keyParts = key.split(".");
	let keyCur = keyParts[0];
	keyParts.shift(1);

	// Initialiser l'objet où il faut ajouter une donnée en mémoire
	let obj = getTarget(target);

	// Appel récursif pour creer les objet et mettre la valeur à la fin
	setRecur(obj, keyCur, keyParts, valeur);

	// Ajouter une valeur ttl si demandé
	if (ttl !== undefined) {
		let keyParts = (key + "ttl").split(".");
		let keyCur = keyParts[0];
		keyParts.shift(1);

		setRecur(obj, keyCur, keyParts, Game.time + ttl);
	}
}

let get = function(key, target) {
	let keyParts = key.split(".");
	let keyCur = keyParts[0];
	keyParts.shift(1);

	// Initialiser l'objet où il faut ajouter une donnée en mémoire
	let obj = getTarget(target);

	// Appel récursif pour creer les objet et mettre la valeur à la fin
	return getRecur(obj, keyCur, keyParts);
}


let getRecur = function(obj, keyCur, keyParts) {
	if (obj === undefined) {
		return undefined;
	}
	if (keyParts.length > 0) {
		obj = obj[keyCur];
		keyCur = keyParts[0];
		keyParts.shift(1);
		return getRecur(obj, keyCur, keyParts);
	} else {
		if (obj[keyCur + "ttl"] !== undefined && obj[keyCur + "ttl"] < Game.time) {
			//info_perf.simpleLog(scriptName, "data out to date");
			return undefined
		}
		return obj[keyCur];
	}
}

let setRecur = function(obj, keyCur, keyParts, valeur) {
	// info_perf.simpleLog(scriptName, "----");
	// info_perf.simpleLog(scriptName, obj, keyCur, keyParts, valeur);
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

module.exports = {
	set: set,
	get: get
};