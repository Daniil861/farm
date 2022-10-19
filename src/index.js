import Phaser from 'phaser';

import PreloadScene from './scripts/scenes/PreloadScene';
import StartScene from './scripts/scenes/StartScene';

import Constans from './scripts/classes/Constans';
import Controller from './scripts/classes/mc/Controller';
import Model from './scripts/classes/mc/Model'

const config = {
	type: Phaser.AUTO,
	parent: 'thegame',
	width: 1270,
	height: 720,
	backgroundColor: '0xffffe0',
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [PreloadScene, StartScene]
}
window.addEventListener('load', function () {
	const game = new Phaser.Game(config);
	window.focus();
	config['emitter'] = new Phaser.Events.EventEmitter();
	config['G'] = new Constans();
	config['model'] = new Model();
	config['controller'] = new Controller();
})
export default config;