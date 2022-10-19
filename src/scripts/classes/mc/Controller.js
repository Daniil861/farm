import config from '../../../index';

export default class Controller {
	constructor() {
		this.prices = {
			egg: 5,
			milk: 10
		}
		config.emitter.on(config.G.SET_SCORE, this.setScore, this);
		config.emitter.on(config.G.UP_POINTS, this.upPoints, this);
		config.emitter.on(config.G.UP_WHEAT_POINTS, this.upWheat, this);
		config.emitter.on(config.G.DOWN_WHEAT_POINTS, this.downWheat, this);
		config.emitter.on(config.G.UP_EGG_POINTS, this.upEgg, this);
		config.emitter.on(config.G.DOWN_EGG_POINTS, this.downEgg, this);
		config.emitter.on(config.G.UP_MILK_POINTS, this.upMilk, this);
		config.emitter.on(config.G.DOWN_MILK_POINTS, this.downMilk, this);
	}

	setScore(score) {
		config.model.score = score;
	}
	upPoints(points) {
		let score = config.model.score;
		score += points;
		config.model.score = score;
	}

	upWheat(points) {
		let wheat = config.model.wheat;
		wheat += points;
		config.model.wheat = wheat;
	}
	downWheat(points) {
		let wheat = config.model.wheat;
		wheat -= points;
		config.model.wheat = wheat;
	}

	upEgg(points) {
		let egg = config.model.egg;
		egg += points;
		config.model.egg = egg;
	}

	downEgg() {
		let countEgg = config.model.egg * this.prices.egg;
		this.upPoints(countEgg);
		config.model.egg = 0;
	}

	upMilk(points) {
		let milk = config.model.milk;
		milk += points;
		config.model.milk = milk;
	}
	downMilk() {
		let countMilk = config.model.milk * this.prices.milk;
		this.upPoints(countMilk);
		config.model.milk = 0;
	}
}