"use strict";

class ContextMenuState extends GameState {
	constructor() {
		super();

		this.x = 0;
		this.y = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.targetItem = 0;
		this.activeItems = [];
		this.objectIndex = 0;

		console.log("ContextMenuState: menuItems init");

		this.menu = {
			talk: {
				img: "art/intrface/talkn.frm",
				hoverImg: "art/intrface/talkh.frm",
				action: "talk"
			},
			look: {
				img: "art/intrface/lookn.frm",
				hoverImg: "art/intrface/lookh.frm",
				action: "look"
			},
			use: {
				img: "art/intrface/usegetn.frm",
				hoverImg: "art/intrface/usegeth.frm",
				action: "use"
			},
			push: {
				img: "art/intrface/pushn.frm",
				hoverImg: "art/intrface/pushh.frm",
				action: "push"
			},
			rotate: {
				img: "art/intrface/rotaten.frm",
				hoverImg: "art/intrface/rotateh.frm",
				action: "rotate"
			},
			cancel: {
				img: "art/intrface/canceln.frm",
				hoverImg: "art/intrface/cancelh.frm",
				action: "cancel"
			},
			inventory: {
				img: "art/intrface/invenn.frm",
				hoverImg: "art/intrface/invenh.frm",
				action: "cancel"
			},
			skill: {
				img: "art/intrface/skilln.frm",
				hoverImg: "art/intrface/skillh.frm",
				action: "skill"
			},
			get: {
				img: "art/intrface/usegetn.frm",
				hoverImg: "art/intrface/usegeth.frm",
				action: "get"
			}
		};

	};

	setMenuItems(obj,x,y) {
		this.objectIndex = obj;		//@TODO: Fix this to decouple
		this.x = x;
		this.y = y;
		this.prevX = _mouse.x;
		this.prevY = _mouse.y;

		this.activeItems = [];		// reset active items

		let targetObject = mainState.mapObjects[mainState.player.currentElevation][obj];

		switch(getObjectType(targetObject.objectTypeID)) {
			case "items":
				this.activeItems.push(this.menu.get);
				this.activeItems.push(this.menu.look);
				this.activeItems.push(this.menu.inventory);
				this.activeItems.push(this.menu.skill);
				break;
			case "critters":
				this.activeItems.push(this.menu.talk);
				this.activeItems.push(this.menu.look);
				this.activeItems.push(this.menu.inventory);
				this.activeItems.push(this.menu.skill);
				break;
			case "scenery":
			case "walls":
			case "tiles":
			case "misc":
				this.activeItems.push(this.menu.look);
				break;
			default:
				break;
		}

		if(targetObject.hasOwnProperty('openState')) {	// if door
			this.activeItems.unshift(this.menu.use);
		}

		this.activeItems.push(this.menu.cancel);

	};

	input(e) {
		switch(e.type) {
			case "mouseup":
				mainState.contextMenuAction(this.activeItems[this.targetItem].action, this.objectIndex );	// context menu action
				_mouse.x = this.prevX;	// reset to previous stored mouse location
				_mouse.y = this.prevY;
				main_gameStateFunction('closeContextMenu');
				break;
			default:
				return;
		};

	};

	update() {
		this.targetItem = Math.max(0,Math.min( ((_mouse.y - this.y)/10)|0, this.activeItems.length-1));	// context menu action
	};

	render() {
		for(var c = 0; c < this.activeItems.length; c++) {
			blitFRM((c == this.targetItem) ? _assets[this.activeItems[c].hoverImg] : _assets[this.activeItems[c].img],
				_context,
				this.x,
				this.y+(40*c));
		}

		blitFRM(_assets["art/intrface/actarrow.frm"],
			_context,
			this.prevX,
			this.prevY);
	};

};
