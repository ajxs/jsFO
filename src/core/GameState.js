/**
 * @file GameState.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief GameState class implementation.
 * Contains the GameState class. This class is responsible for implementing each 'mode' of
 * gameplay. The class contains methods for initialisation, input, updating and rendering.
 * These functions are called by the main game engine methods in `main.js`.
 */


"use strict";

/**
 * GameState class.
 * These class methods are called by the main game engine loop if the specific state
 * instance is active.
 */
class GameState {
	constructor() {
		this.statePause = false;
	};

	init() {};
	input() {};
	update() {};
	render() {};
};
