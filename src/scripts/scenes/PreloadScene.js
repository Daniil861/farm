import LoadingBar from '../classes/components/LoadingBar';
import cow from '../../assets/sprites/other/cow.png';
import chicken from '../../assets/sprites/other/chicken.png';
import wheat from '../../assets/sprites/other/wheat.png';
import milk from '../../assets/sprites/other/milk.png';
import egg from '../../assets/sprites/other/egg.png';
import coin from '../../assets/sprites/icons/coin.png';
import board from '../../assets/sprites/icons/board.svg';

export default class PreloadScene extends Phaser.Scene {
	constructor() {
		super('Preload');
	}
	preload() {
		this.createLoadingBar();
		this.preloadAssets();
	}
	createLoadingBar() {
		const loadingBar = new LoadingBar(this);
	}
	preloadAssets() {
		this.load.image('cow', cow);
		this.load.image('chicken', chicken);
		this.load.image('wheat', wheat);
		this.load.image('milk', milk);
		this.load.image('coin', coin);
		this.load.image('board', board);
		this.load.image('egg', egg);
	}
	create() {
		this.scene.start('Start');
	}
}