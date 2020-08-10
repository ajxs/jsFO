/**
 * @file interface.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief Interface class.
 * Contains the implementation of the Interface class, used to display ingame interfaces.
 */

"use strict";

/**
 * Game interface class.
 */
class Interface {
	constructor(file = null) {
		this.x = 0;
		this.y = 0;
		this.elements = [];

		console.log("Interface: loading file:" + file);
		if(!file) return false;
		main_loadJsonPayload(file)
			.then(res => {
				this.elements = res.elements;
				this.x = res.x;
				this.y = res.y;
				this.width = res.width;
				this.height = res.height;
			}).catch(main_payloadError);

		this.activeItem = -1;
		this.mouseState = 0;
	};

	update() {
		if(intersectTest(_mouse.x, _mouse.y,
			0,0,
			this.x, this.y,
			this.width, this.height)) {
				if(_mouse[0]) this.mouseState = 1;
				else this.mouseState = 0;

				this.elements.forEach((element, index) => {
					if(intersectTest(_mouse.x, _mouse.y,
					0,0,
					this.x + element.x,
					this.y + element.y,
					element.width, element.height)) {
						this.activeItem = index;
						return index;
					}
				});
				return -1;
			} else {
				this.activeItem = -1;
				return -1;
			}
	};

	clickHandler() {
		if(this.activeItem != -1) return this.elements[this.activeItem].handle;
		else return false;
	};
};
