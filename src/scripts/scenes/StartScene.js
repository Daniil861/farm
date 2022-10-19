import config from '../../index';
import ScoreBox from '../classes/components/ScoreBox';
import Square from '../classes/components/square';

export default class StartScene extends Phaser.Scene {
	constructor() {
		super('Start');
		this.style = {
			font: '50px Arco',
			color: '#000'
		}
		this.config = {
			rows: 8,
			cols: 8,
			width: 50,
			height: 50
		}
		this.state = {
			gameState: 1, // 1 - доступно для выбора животного, доступно для клика по полю и сбора пшеницы или продуктов, 2 - кликнули по животному или по пшенице и готовы записать в клетку
			currentPetChoice: null
		}
		this.events();
	}

	disableClick(block) {
		block.disableInteractive();
		this.time.addEvent({
			delay: 500,
			callback: function () { block.setInteractive() }.bind(this)
		})
	}
	create() {
		this.initPositionsSquares();
		this.createTitle();
		this.createField();
		this.createSprites();
		this.createScore();
		this.createGoals();

		this.input.on('gameobjectdown', this.onSceneClick, this);
	}
	createTitle() {
		this.add.text(config.width / 2, 20, 'this is a farm', this.style).setOrigin(0.5, 0);
	}
	events() {
		config.emitter.on(config.G.WHEAT_UPDATED, this.wheatUpdate, this);
		config.emitter.on(config.G.MILK_UPDATED, this.milkUpdate, this);
		config.emitter.on(config.G.EGG_UPDATED, this.eggUpdate, this);
	}
	wheatUpdate() {
		this.countWheat.setText(config.model.wheat);
	}
	milkUpdate() {
		this.countMilk.setText(config.model.milk);
	}
	eggUpdate() {
		this.countEgg.setText(config.model.egg);
	}

	createField() {
		this.squares = [];
		this.squaresPositions.forEach(square => {
			this.squares.push(new Square({ scene: this, x: square.x, y: square.y, width: this.config.width, height: this.config.height }));
		})
	}

	createSprites() {
		let cowSizes = this.textures.get('cow').getSourceImage();
		this.cow = this.add.sprite(config.width / 10, config.height / 2 - cowSizes.height / 2, 'cow')
			.setInteractive()
			.setScale(0.4);
		this.cow.isCow = true;

		this.chicken = this.add.sprite(config.width / 10, config.height / 2, 'chicken')
			.setInteractive()
			.setScale(0.3);
		this.chicken.isChicken = true;

		this.wheat = this.add.sprite(config.width / 10, config.height / 2 + cowSizes.height / 2, 'wheat')
			.setInteractive()
			.setScale(0.4);
		this.wheat.isWheat = true;
	}
	createGoals() {
		// create wheat score container
		const cowSizes = this.textures.get('cow').getSourceImage();
		const wheat = this.add.sprite(0, 0, 'wheat')
			.setScale(0.4);
		this.countWheat = this.add.text(110, -10, '0', { font: '50px Arco' })
			.setTint(0xFFE608, 0xFFE608, 0xFF5C00, 0xFF5C00);

		let wheatContainer = this.add.container(config.width - 300, config.height / 2 - cowSizes.height / 2, [wheat, this.countWheat]);

		// create egg score container
		const egg = this.add.sprite(0, 0, 'egg')
			.setScale(0.4);
		this.countEgg = this.add.text(110, -20, '0', { font: '50px Arco' })
			.setTint(0xFFE608, 0xFFE608, 0xFF5C00, 0xFF5C00);
		this.btnSellEgg = this.add.text(180, -10, 'sell', { font: '30px Arco', color: '#000' }).setInteractive();
		this.btnSellEgg.isBtnSellEgg = true;
		let eggContainer = this.add.container(config.width - 300, config.height / 2, [egg, this.countEgg, this.btnSellEgg]);

		// create milk score container
		const milk = this.add.sprite(0, 0, 'milk')
			.setScale(0.4);
		this.countMilk = this.add.text(110, -20, '0', { font: '50px Arco' })
			.setTint(0xFFE608, 0xFFE608, 0xFF5C00, 0xFF5C00);
		this.btnSellMilk = this.add.text(180, -10, 'sell', { font: '30px Arco', color: '#000' }).setInteractive();
		this.btnSellMilk.isBtnSellMilk = true;
		let milkContainer = this.add.container(config.width - 300, config.height / 2 + cowSizes.height / 2, [milk, this.countMilk, this.btnSellMilk]);
	}

	initPositionsSquares() {
		this.squaresPositions = [];
		let squareWidth = this.config.width + 5;
		let squareHeight = this.config.height + 5;
		let xOffset = (config.width - squareWidth * this.config.cols) / 2 + squareWidth / 2;
		let yOffset = 150;
		for (let i = 0; i < this.config.rows; i++) {
			for (let k = 0; k < this.config.cols; k++) {
				this.squaresPositions.push({
					x: xOffset + k * squareWidth,
					y: yOffset + i * squareHeight
				})
			}
		}
		// console.log(this.squaresPositions);
	}

	onSceneClick(pointer, object) {
		this.disableClick(object);
		if (object.isSquare && this.state.gameState === 2 && !object.activePet) {
			// add pet in container
			object.createPet(this.state.currentPetChoice);
			this.time.addEvent({
				delay: 100,
				callback: function () { this.state.gameState = 1 }.bind(this)
			})
		}
		if (this.state.gameState === 1 && object.isFieldWheat) {
			// add point whear
			object.restartWhearTimer();
			config.emitter.emit(config.G.UP_WHEAT_POINTS, 1);
		}
		if (this.state.gameState === 1 && object.pet !== 'wheat' && object.isHungry && config.model.wheat > 0 && !object.isMilk && !object.isEgg) {
			// кормим корову или курицу
			object.isHungry = false;
			object.animProgress();
			config.emitter.emit(config.G.DOWN_WHEAT_POINTS, 1);
		}

		if (this.state.gameState === 1 && object.isMilk) {
			config.emitter.emit(config.G.UP_MILK_POINTS, 1);
			object.removeMilkSprite();
		}

		if (this.state.gameState === 1 && object.isEgg) {
			config.emitter.emit(config.G.UP_EGG_POINTS, 1);
			object.removeEggSprite();
		}


		if (object.isCow) {
			this.state.gameState = 2;
			this.state.currentPetChoice = 'cow';
		}
		if (object.isChicken) {
			this.state.gameState = 2;
			this.state.currentPetChoice = 'chicken';
		}
		if (object.isWheat) {
			this.state.gameState = 2;
			this.state.currentPetChoice = 'wheat';
		}
		if (object.isBtnSellMilk && config.model.milk > 0) {
			config.emitter.emit(config.G.DOWN_MILK_POINTS);
		}
		if (object.isBtnSellEgg && config.model.egg > 0) {
			config.emitter.emit(config.G.DOWN_EGG_POINTS);
		}
	}

	createScore() {
		this.sb = new ScoreBox({ scene: this, x: config.width / 2 + 50, y: config.height - 100 });
	}
}