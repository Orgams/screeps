let creep_create = require('creep_create');

let info_room = require('info_room');
let info_perf = require('info_perf');

const fullWork = [WORK, WORK, MOVE, WORK, WORK, WORK, MOVE, WORK];
const carryWork = [CARRY, WORK, MOVE, CARRY, MOVE, WORK, MOVE, MOVE];
const oneWorkTreeCarry = [WORK, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
const small = [CARRY, WORK, MOVE];
const claim = [CLAIM, MOVE];
const attack = [ATTACK, MOVE, ATTACK];

let energy;

let fonc_manage_creep = function(room) {
	let scriptName = "creep_manage";
	info_perf.init(scriptName, false);

	let creeps = Object.values(Game.creeps);

	let level = room.controller.level;

	energy = room.energyAvailable

	let configs = [];
	configs.push(get_config_transferer(level));
	configs.push(get_config_janitor(level));
	configs.push(get_config_miner(level));
	configs.push(get_config_builder(level));
	configs.push(get_config_upgrader(level));
	configs.push(get_config_repairer(level));
	//configs.push(get_config_claimer(level));
	configs.push(get_config_destroyer(level));


	info_perf.log(scriptName, "Init configs");

	// Supprimer les configuration dont le role a déjà un creep en création
	let creepCreating = new Set();
	for (spawn of Object.values(Game.spawns)) {
		if (spawn.spawning !== null) {
			let roleCur = spawn.spawning.name.replace(/[0-9]/g, '');
			creepCreating.add(roleCur);
		}
	}
	configs = configs.filter((config) => !creepCreating.has(config.role));

	// prise en compte des local
	for (config of configs) {
		if (config.range === "local") {
			let nb_room = info_room.get_nb_my_room();
			config.popOpti = config.popOpti * nb_room;
			config.max = config.max * nb_room;
		}
	}

	// Initialisation for this room
	let totalCreeps = 0;
	let totalRestePopOpti = 0;
	let allMinOk = true;
	info_perf.log(scriptName, "Init vars");

	/// Inisialiser les données de configs spécifique à cette salle
	// Initialiser config.nb : le nombre actuel de creep de ce type
	for (let indexConfig in configs) {
		let config = configs[indexConfig];
		config.nb = _.sum(creeps, (c) => c.memory.role == config.role);
		if (config.nb === undefined) config.nb = 0;
		Memory["nb." + config.role] = config.nb;
	}
	info_perf.log(scriptName, "Initialiser config.nb : le nombre actuel de creep de ce type");

	// Eliminer les configuration qui sont arriver à leur max de population
	configs = configs.filter((config) => config.maxOk());
	info_perf.log(scriptName, "Delete conf in max");

	// Initialiser totalRestePopOpti : l'adition de toutes les population optimal qui ne sont pas àleur max
	for (let indexConfig in configs) {
		let config = configs[indexConfig];
		totalRestePopOpti += config.popOpti;
	}
	info_perf.log(scriptName, "Init totalRestePopOpti");

	// Initialiser
	//    config.ratio : le ratio optimal des creep de ce type par rapport au total des population optimal qui ne sont pas àleur max
	//    totalCreeps : le total des creeps de type qui ne sont pas àleur max
	for (let indexConfig in configs) {
		let config = configs[indexConfig];
		if (config.ratio === null) config.ratio = 0;
		if (totalRestePopOpti === 0) {
			config.ratio = 0;
		} else {
			config.ratio = config.popOpti / totalRestePopOpti;
		}
		totalCreeps += config.nb;
		allMinOk = allMinOk && config.minOk();
	}
	info_perf.log(scriptName, "Init ratio");


	// Create the necessary stuff that does not have its minimum for this room
	if (!allMinOk) {
		for (let indexConfig in configs) {
			let config = configs[indexConfig];
			if (!config.minOk()) {
				info_perf.logWithoutTimer(scriptName, config.role + " : le minimum n'est pas respecter : " + config.nb + " / " + config.min)
				return creep_create.try_create_creep(config);
			}
		}
	}
	info_perf.log(scriptName, "Create creep by min");

	// Initialiser config.actualRatio : le ratio actuel des creeps de ce type par rapport au total de population actuel qui ne sont pas àleur max
	for (let indexConfig in configs) {
		let config = configs[indexConfig];
		if (totalCreeps === 0) {
			config.actualRatio = 0;
		} else {
			config.actualRatio = config.nb / totalCreeps;
		}
		//info_perf.simpleLog(scriptName, config.nb + " " + config.role " (de " + config.min + " à" + config.max + " au mieux " + config.popOpti + ") " + " (" + config.printableActualRatio() + "/" + config.printableRatio() + ")");
	}
	info_perf.log(scriptName, "Init actual ratio");


	// Create the necessary stuff that does not have their popOpti without removing the maximum for this room
	for (let indexConfig in configs) {
		let config = configs[indexConfig];
		info_perf.logWithoutTimer(scriptName, config.role + " maxOk " + config.maxOk() + " ratioOk " + config.ratioOk() + " config.ratio " + config.ratio + " config.actualRatio " + config.actualRatio)
		if (config.maxOk() && config.ratioOk()) {
			info_perf.logWithoutTimer(scriptName, config.role + " : le maximum et le ratio ne sont pas atteint (" + config.nb + "/" + config.max + " et " + config.printableActualRatio() + "/" + config.printableRatio() + ")");
			return creep_create.try_create_creep(config);
		}
	}
	info_perf.log(scriptName, "Create creep by opti");

	info_perf.finish(scriptName);
}

function get_config_transferer(level){
	//                 role,        priority, min, popOpti, max, model,             color,     range,  strict
	return new Config('transferer', 1,        1,   1,       2,   oneWorkTreeCarry, "#00ff00", "local", false);
}
function get_config_janitor(level){
	//                 role,        priority, min, popOpti, max, model,             color,     range,  strict
	return new Config('janitor'   , 2,        0,   0,       0,   oneWorkTreeCarry, "#00ffff", "local", false);
}
function get_config_miner(level){

	// Initialiser le minimum du minier au nombre de conteneur global
	let nbMiners = Memory["nb.containers"];

	let strict = true;
	if (energy < 800){
		strict = false;
	}

	//                 role,    priority, min,      popOpti,  max,      model,     color,     range,  strict
	return new Config('miner' , 3,        nbMiners, nbMiners, nbMiners, fullWork, "#ff00ff", "autre", strict);
}
function get_config_builder(level){
	//                 role,        priority, min, popOpti, max, model,             color,     range,  strict
	return new Config('builder'   , 4,        1,   1,       1,   carryWork,        "#ff0000", "local", false);
}
function get_config_upgrader(level){
	//                 role,        priority, min, popOpti, max, model,             color,     range,  strict
	return new Config('upgrader'  , 5,        1,   2,       2,   oneWorkTreeCarry, "#0000ff", "local", false);
}
function get_config_repairer(level){
	//                 role,        priority, min, popOpti, max, model,             color,     range,  strict
	return new Config('repairer'  , 6,        0,   0,       1,   oneWorkTreeCarry, "#ff9900", "local", false);
}
function get_config_claimer(level){

	// Initialiser la configuration du claimer
	max = 0;
	if (Game.gcl.level > info_room.get_nb_my_room()) {
		max = 1;
	}

	//                 role,        priority, min, popOpti, max, model,             color,     range,  strict
	return new Config('claimer'   , 7,        0,   0,       max, claim,            "#ffff00", "autre", true);
}
function get_config_destroyer(level){
	max = 0;
	if (Game.flags["destroy"]) {
		max = 1;
	}

	//                 role,        priority, min, popOpti, max, model,             color,     range,  strict
	return new Config('destroyer' , 8,        0,   0,       max, attack,           "#ffff00", "autre", true);
}

function Config(role, priority, min, popOpti, max, model, color, range, strict) {
	this.role = role;
	this.priority = priority;
	this.min = min;
	this.popOpti = popOpti;
	this.max = max;
	this.model = model;
	this.color = color;
	this.strict = strict;
	this.range = range
	this.minOk = function() {
		if (this.nb == undefined) return undefined;
		return this.nb >= this.min;
	}
	this.maxOk = function() {
		if (this.nb == undefined) return undefined;
		return this.nb < this.max;
	}
	this.ratioOk = function() {
		if (this.ratio == undefined || this.actualRatio == undefined) return undefined;
		return this.actualRatio <= this.ratio;
	}
	this.formatPerCent = function(float) {
		return parseFloat(float * 100).toFixed(1) + "%"
	}
	this.printableRatio = function() {
		return this.formatPerCent(this.ratio);
	}
	this.printableActualRatio = function() {
		return this.formatPerCent(this.actualRatio);
	}
	this.toString = function() {
		return "role : " + this.role + ", min : " + this.min + ", popOpti : " + this.popOpti + ", max : " + this.max + ", model : " + this.model;
	}
}

module.exports = {
	manage_creep: fonc_manage_creep
};