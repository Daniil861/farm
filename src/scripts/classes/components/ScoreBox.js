import config from "../../../index";

export default class ScoreBox extends Phaser.GameObjects.Container {
	constructor(info) {
		super(info.scene);
		this.scene = info.scene;
		this.x = info.x;
		this.y = info.y;

		this.style = {
			font: '32px Arco',
		}

		this.infoScore = this.scene.textures.get('board').getSourceImage();
		this.borderScore = this.scene.add.sprite(-50, 0, 'board').setOrigin(0.5, 0);

		this.scoreText = this.scene.add.text(0, this.infoScore.height / 2, config.model._score, this.style)
			.setOrigin(1, 0.5)
			.setTint(0xFFE608, 0xFFE608, 0xFF5C00, 0xFF5C00);

		this.coin = this.scene.add.sprite(-90, this.infoScore.height / 2 - 10, 'coin')
			.setOrigin(0.5)
			.setScale(0.7);

		this.scene.add.existing(this);

		this.add([this.borderScore, this.scoreText, this.coin]);
		if (!config.emitter._events.scoreUpdated) {
			config.emitter.on(config.G.SCORE_UPDATED, this.scoreUpdate, this);
		}
		this.animateCoin();
	}
	animateCoin() {
		this.timer = this.scene.time.addEvent({
			delay: 20000,
			callback: this.startAnimation,
			callbackScope: this,
			loop: true
		})
	}
	startAnimation() {
		let count = 0;
		count = Phaser.Math.Between(1, 3);
		if (count === 1) this.animationCoin_1();
		else if (count === 2) this.animationCoin_2();
		else if (count === 3) this.animationCoin_3();
	}
	animationCoin_1() {
		this.scene.tweens.add({
			targets: this.coin,
			ease: 'Linear',
			x: this.coin.x + 175,
			rotation: 5,
			duration: 2000,
			yoyo: true,
		})
	}
	animationCoin_2() {
		this.scene.tweens.add({
			targets: this.coin,
			scale: 0.4,
			ease: 'Elastic.easeIn',
			duration: 3000,
			yoyo: true,
		})
	}
	animationCoin_3() {
		this.scene.tweens.add({
			targets: this.coin,
			ease: 'Elastic.easeIn',
			rotation: 2,
			duration: 2000,
			yoyo: true,
		})
	}
	scoreUpdate() {
		this.scoreText.setText(config.model.score);
	}
	noMoney() {
		this.scoreText.setTint(0xFF0000, 0xDC143C, 0xFF0000, 0xFF1493);
		this.scene.tweens.add({
			targets: this.scoreText,
			y: this.scoreText.y + 5,
			ease: 'Linear',
			duration: 250,
			yoyo: true,
			repeat: 1,
			onComplete: function () { this.scoreText.setTint(0xFFFFFF) }.bind(this)
		})
	}
	addMoney() {
		this.scoreText.setTint(0xFFD700, 0xFFFF00, 0xFFD700, 0xFFFF00);
		this.scene.tweens.add({
			targets: this.scoreText,
			y: this.scoreText.y - 5,
			ease: 'Linear',
			duration: 250,
			yoyo: true,
			repeat: 1,
			onComplete: function () { this.scoreText.setTint(0xFFFFFF) }.bind(this)
		})
	}
	deleteMoney() {
		this.scoreText.setTint(0xFF0000, 0xDC143C, 0xFF0000, 0xFF1493);
		this.scene.tweens.add({
			targets: this.scoreText,
			y: this.scoreText.y + 10,
			ease: 'Linear',
			duration: 400,
			yoyo: true,
			onComplete: function () { this.scoreText.setTint(0xFFFFFF) }.bind(this)
		})
	}
}