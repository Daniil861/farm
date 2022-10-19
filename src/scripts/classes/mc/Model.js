import config from "../../..";
export default class Model {
	constructor() {
		this._score = 0;
		this._wheat = 0;
		this._egg = 0;
		this._milk = 0;
	}
	set score(val) {
		this._score = val;
		config.emitter.emit(config.G.SCORE_UPDATED);
	}
	get score() {
		return this._score;
	}

	set wheat(val) {
		this._wheat = val;
		config.emitter.emit(config.G.WHEAT_UPDATED);
	}
	get wheat() {
		return this._wheat;
	}

	set egg(val) {
		this._egg = val;
		config.emitter.emit(config.G.EGG_UPDATED);
	}
	get egg() {
		return this._egg;
	}

	set milk(val) {
		this._milk = val;
		config.emitter.emit(config.G.MILK_UPDATED);
	}
	get milk() {
		return this._milk;
	}
}