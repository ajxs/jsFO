class Interface {
	constructor(file = null, callback = null) {
		console.log("Interface: loading file:" + file);
		if(!file) return false;
		main_loadJsonPayload(file)
			.then(function(res) {
				console.log(res);
				this.buttons = res.buttons;
				this.width = res.width;
				this.height = res.height;
			}.bind(this))
			.catch(main_payloadError);

		this.callback = callback;
		this.activeItem = 0;
		this.mouseState = 0;
	};

	update() {
		if(intersectTest(MOUSE.x, MOUSE.y,
			0,0,
			this.x, this.y,
			this.width, this.height)) {
				this.buttons.forEach(function(btn, index) {
					if(intersectTest(MOUSE.x, MOUSE.y,
					0,0,
					this.x + btn.x,
					this.y + btn.y,
					btn.width, btn.height)) {
						this.activeItem = index;
						return index;
					}
				}, this);
			} else return -1;
	};

	clickHandler() {
		return this.buttons[this.activeItem].handle;
	};


};
