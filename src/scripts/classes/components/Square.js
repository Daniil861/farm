export default class Square extends Phaser.GameObjects.Container {
	constructor(info) {
		super(info.scene);
		this.scene = info.scene;
		this.x = info.x;
		this.y = info.y;
		this.isSquare = true;

		this.progressStyle = {
			boxColor: 0xFFFFFF,
			barColor: 0x00FF7F,
			x: -22,
			y: 15,
			width: 40,
			height: 5
		}

		this.rect = this.scene.add.rectangle(0, 0, info.width, info.height, 0x9966ff).setStrokeStyle(4, 0xefc53f);

		this.scene.add.existing(this);

		this.add([this.rect]);
		this.setSize(info.width, info.height);
		this.setInteractive();
	}

	createPet(pet) {
		this.img = this.scene.add.sprite(0, 0, pet).setOrigin(0.5).setScale(0.2);
		this.add([this.img]);
		this.activePet = pet;
		this.pet = pet;
		if (pet === 'wheat') {
			this.startTimer();
			this.createProgressBar();
			this.animProgress();
		} else if (pet === 'cow') {
			this.isHungry = true;
			this.createProgressBar();
			this.milkSprite = this.scene.add.sprite(-20, -20, 'milk')
				.setScale(0.1)
				.setAlpha(0)
			this.add([this.milkSprite])
		} else if (pet === 'chicken') {
			this.isHungry = true;
			this.createProgressBar();
			this.eggSprite = this.scene.add.sprite(-20, -20, 'egg')
				.setScale(0.1)
				.setAlpha(0)
			this.add([this.eggSprite])
		}
	}

	createProgressBar() {
		this.progressBox = this.scene.add.graphics();
		this.progressBar = this.scene.add.graphics();

		this.progressBox
			.fillStyle(this.progressStyle.boxColor)
			.fillRect(this.progressStyle.x, this.progressStyle.y, this.progressStyle.width, this.progressStyle.height);

		this.add([this.progressBox, this.progressBar]);

	}

	showProgressBar(value) {
		this.progressBar
			.clear()
			.fillStyle(this.progressStyle.barColor)
			.fillRect(this.progressStyle.x, this.progressStyle.y, this.progressStyle.width * value, this.progressStyle.height);
	}

	animProgress() {
		let count = 0;
		let countRepeat = 0;
		let countTime = 0

		if (this.pet == 'chicken') {
			count = 30;
			countRepeat = 299;
			countTime = 30;
			this.completeEgg();
		} else if (this.pet == 'cow') {
			count = 20;
			countRepeat = 199;
			countTime = 20;
		}

		if (this.pet === 'wheat') {
			this.scene.time.addEvent({
				delay: 100,
				callback: function () {
					count = count + 0.1;
					this.showProgressBar(count / 10);
				}.bind(this),
				repeat: 99
			})
		} else {
			this.isHungry = false;
			this.scene.time.addEvent({
				delay: 100,
				callback: function () {
					count = count - 0.1;
					this.showProgressBar(count / countTime);
					if (count <= 0) {
						this.isHungry = true;
						if (this.pet === 'chicken') this.checkEggComplete.remove();
						if (this.pet === 'cow') {
							this.isMilk = true;
							this.milkSprite.setAlpha(1);
						}
					}
				}.bind(this),
				repeat: countRepeat
			})
		}
	}

	completeEgg() {
		this.checkEggComplete = this.scene.time.addEvent({
			delay: 10000,
			callback: function () {
				this.isEgg = true;
				this.eggSprite.setAlpha(1);
			}.bind(this)
		})
	}

	removeMilkSprite() {
		this.milkSprite.alpha = 0;
		this.isMilk = false;
	}

	removeEggSprite() {
		this.eggSprite.alpha = 0;
		this.isEgg = false;
		this.completeEgg();
	}

	startTimer() {
		this.img.setAlpha(0.2);
		this.scene.tweens.add({
			targets: this.img,
			alpha: 1,
			duration: 10000,
			ease: 'Linear',
			onComplete: function () {
				this.isFieldWheat = true;
			}.bind(this),
		})
	}

	restartWhearTimer() {
		this.isFieldWheat = false;
		this.startTimer();
		this.animProgress();
	}
}