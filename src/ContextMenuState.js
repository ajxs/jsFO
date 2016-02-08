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
		this.menu_talk = {
				img: "art/intrface/talkn.frm",
				hoverImg: "art/intrface/talkh.frm",
				action: "talk",
			};

		this.menu_look = {
				img: "art/intrface/lookn.frm",
				hoverImg: "art/intrface/lookh.frm",
				action: "look",
			};

		this.menu_use = {
				img: "art/intrface/usegetn.frm",
				hoverImg: "art/intrface/usegeth.frm",
				action: "use",
			};

		this.menu_push = {
				img: "art/intrface/pushn.frm",
				hoverImg: "art/intrface/pushh.frm",
				action: "push",
			};

		this.menu_rotate = {
				img: "art/intrface/rotaten.frm",
				hoverImg: "art/intrface/rotateh.frm",
				action: "rotate",
			};

		this.menu_cancel = {
				img: "art/intrface/canceln.frm",
				hoverImg: "art/intrface/cancelh.frm",
				action: "cancel",
			};

		this.menu_inven = {
				img: "art/intrface/invenn.frm",
				hoverImg: "art/intrface/invenh.frm",
				action: "cancel",
			};

		this.menu_skill = {
				img: "art/intrface/skilln.frm",
				hoverImg: "art/intrface/skillh.frm",
				action: "skill",
			};

		this.menu_get = {
				img: "art/intrface/usegetn.frm",
				hoverImg: "art/intrface/usegeth.frm",
				action: "get",
			};

	};

	setMenuItems(obj,x,y) {
		this.objectIndex = obj;		//@TODO: Fix this to decouple
		this.x = x;
		this.y = y;
		this.prevX = MOUSE.x;
		this.prevY = MOUSE.y;

		this.activeItems = [];		// reset active items

		let targetObject = mainState.mapObjects[mainState.player.currentElevation][obj];

		switch(getObjectType(targetObject.objectTypeID)) {
			case "items":
				this.activeItems.push(this.menu_get);
				this.activeItems.push(this.menu_look);
				this.activeItems.push(this.menu_inven);
				this.activeItems.push(this.menu_skill);
				break;
			case "critters":
				this.activeItems.push(this.menu_talk);
				this.activeItems.push(this.menu_look);
				this.activeItems.push(this.menu_inven);
				this.activeItems.push(this.menu_skill);
				break;
			case "scenery":
			case "walls":
			case "tiles":
			case "misc":
				this.activeItems.push(this.menu_look);
				break;
			default:
				break;
		}

		if(targetObject.hasOwnProperty('openState')) {	// if door
			this.activeItems.unshift(this.menu_use);
		}

		this.activeItems.push(this.menu_cancel);

	};

	input(e) {

		switch(e.type) {
			case "mousemove":
				break;
			case "keydown":
				break;
			case "mousedown":
				break;
			case "mouseup":
				mainState.contextMenuAction(this.activeItems[this.targetItem].action, this.objectIndex );	// context menu action
				MOUSE.x = this.prevX;	// reset to previous stored mouse location
				MOUSE.y = this.prevY;
				main_gameStateFunction('closeContextMenu');

				break;

			case "click":
				break;
			case 'contextmenu':	// switch input modes on mouse2
				break;
		};

	};

	update() {
		this.targetItem = Math.max(0,Math.min( ((MOUSE.y - this.y)/10)|0, this.activeItems.length-1));	// context menu action
	};

	render() {
		for(var c = 0; c < this.activeItems.length; c++) {
			_context.drawImage((c == this.targetItem) ? _assets[this.activeItems[c].hoverImg].frameInfo[0][0].img : _assets[this.activeItems[c].img].frameInfo[0][0].img,
				this.x,
				this.y+(40*c));
		}

		_context.drawImage(_assets["art/intrface/actarrow.frm"].frameInfo[0][0].img, this.prevX, this.prevY);

	};

};
