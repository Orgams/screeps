let set = function(key, valeur, target, ttl) {
	let keyParts = key.split(".");
	let keyCur = keyParts[0];
	keyParts.shift(1);

	// Initialiser l'objet où il faut ajouter une donnée en mémoire
	let obj = getTarget(target);

	// Appel récursif pour creer les objet et mettre la valeur àla fin
	if(!setRecur(obj, keyCur, keyParts, valeur)){
		return false
	}

	// Ajouter une valeur ttl si demandé
	if (ttl !== undefined) {
		let keyParts = (key + "ttl").split(".");
		let keyCur = keyParts[0];
		keyParts.shift(1);

		return setRecur(obj, keyCur, keyParts, Game.time + ttl);
	}
	return true;
}

let get = function(key, target) {
	let keyParts = key.split(".");
	let keyCur = keyParts[0];
	keyParts.shift(1);

	// Initialiser l'objet où il faut ajouter une donnée en mémoire
	let obj = getTarget(target);

	// Appel récursif pour creer les objet et mettre la valeur àla fin
	return getRecur(obj, keyCur, keyParts);
}

let getTarget = function(target){
	if (target === undefined) {
		return Memory;
	} else {
		return target.memory;
	}
}

let getRecur = function(obj, keyCur, keyParts) {

	// Vérifier les parametres
	if (obj === undefined) {
		return undefined;
	}

	// Appler getRecur s'il y a encore des sous object
	if (keyParts.length > 0) {
		obj = obj[keyCur];
		keyCur = keyParts[0];
		keyParts.shift(1);
		return getRecur(obj, keyCur, keyParts);
	}

	// Retourner undefined s'il y a un ttl et qu'il est dépassé
	if (obj[keyCur + "ttl"] !== undefined && obj[keyCur + "ttl"] < Game.time) {
		return undefined
	}

	// Retourner la valeur
	return obj[keyCur];
	
}

let setRecur = function(obj, keyCur, keyParts, valeur) {

	// Appler setRecur s'il y a encore des sous object
	if (keyParts.length > 0) {
		if (obj[keyCur] === undefined) {
			obj[keyCur] = {};
		}
		obj = obj[keyCur];
		keyCur = keyParts[0];
		keyParts.shift(1);
		return setRecur(obj, keyCur, keyParts, valeur);
	} 
	// Mettre à jour la valeur si elle n'est pas lock
	else {
		if (obj[keyCur+"lock"] !== true){
			obj[keyCur] = valeur;
			return true;
		}
		return false;
	}
}

let lock = function(key, target, ttl) {
	set(key+"lock", true, target, ttl);
}

let unlock = function(key, target) {
	set(key+"lock", false, target);
}

module.exports = {
	set: set,
	get: get,
	lock: lock,
	unlock: unlock
};