import config from '../../../index';

export default class LoadingBar {
	constructor(scene) {
		this.scene = scene;
		this.style = {
			boxColor: 0x778899,
			barColor: 0xfed85f,
			x: config.width / 2 - 350,
			y: config.height / 2 + 250,
			width: 700,
			height: 50
		}

		this.progressBox = this.scene.add.graphics();
		this.progressBar = this.scene.add.graphics();


		this.showProgressBox();

		this.setEvents();
	}
	setEvents() {
		this.scene.load.on('progress', this.showProgressBar, this);
		this.scene.load.on('complete', this.onLoadComplete, this);
	}

	showProgressBox() {
		this.progressBox
			.fillStyle(this.style.boxColor)
			.fillRect(this.style.x, this.style.y, this.style.width, this.style.height);
	}


	showProgressBar(value) {
		this.progressBar
			.clear()
			.fillStyle(this.style.barColor)
			.fillRect(this.style.x, this.style.y, this.style.width * value, this.style.height);
	}

	onLoadComplete() {
		this.progressBar.destroy();
		this.progressBox.destroy();
	}
}