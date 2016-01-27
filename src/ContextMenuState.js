"use strict";

function ContextMenuState() {
	GameState.call(this);
}

ContextMenuState.prototype = new GameState();
ContextMenuState.prototype.constructor = ContextMenuState;


ContextMenuState.prototype.x = 0;
ContextMenuState.prototype.y = 0;
ContextMenuState.prototype.prevX = 0;
ContextMenuState.prototype.prevY = 0;
ContextMenuState.prototype.targetItem = 0;
ContextMenuState.prototype.menuItems = [];
ContextMenuState.prototype.activeItems = [];
ContextMenuState.prototype.objectIndex = 0;


ContextMenuState.prototype.menu_talk = 0;
ContextMenuState.prototype.menu_look = 0;
ContextMenuState.prototype.menu_use = 0;
ContextMenuState.prototype.menu_get = 0;
ContextMenuState.prototype.menu_push = 0;
ContextMenuState.prototype.menu_rotate = 0;
ContextMenuState.prototype.menu_cancel = 0;
ContextMenuState.prototype.menu_inven = 0;
ContextMenuState.prototype.menu_rotate = 0;
ContextMenuState.prototype.menu_skill = 0;



ContextMenuState.prototype.init = function() {

	console.log("ContextMenuState: menuItems init");

	this.menu_talk = {
			img: _assets["art/intrface/talkn.frm"].frameInfo[0][0].img,
			hoverImg: _assets["art/intrface/talkh.frm"].frameInfo[0][0].img,
			action: "talk",
		};

	this.menu_look = {
			img: _assets["art/intrface/lookn.frm"].frameInfo[0][0].img,
			hoverImg: _assets["art/intrface/lookh.frm"].frameInfo[0][0].img,
			action: "look",
		};

	this.menu_use = {
			img: _assets["art/intrface/usegetn.frm"].frameInfo[0][0].img,
			hoverImg: _assets["art/intrface/usegeth.frm"].frameInfo[0][0].img,
			action: "use",
		};

	this.menu_push = {
			img: _assets["art/intrface/pushn.frm"].frameInfo[0][0].img,
			hoverImg: _assets["art/intrface/pushh.frm"].frameInfo[0][0].img,
			action: "push",
		};

	this.menu_rotate = {
			img: _assets["art/intrface/rotaten.frm"].frameInfo[0][0].img,
			hoverImg: _assets["art/intrface/rotateh.frm"].frameInfo[0][0].img,
			action: "rotate",
		};

	this.menu_cancel = {
			img: _assets["art/intrface/canceln.frm"].frameInfo[0][0].img,
			hoverImg: _assets["art/intrface/cancelh.frm"].frameInfo[0][0].img,
			action: "cancel",
		};

	this.menu_inven = {
			img: _assets["art/intrface/invenn.frm"].frameInfo[0][0].img,
			hoverImg: _assets["art/intrface/invenh.frm"].frameInfo[0][0].img,
			action: "cancel",
		};

	this.menu_skill = {
			img: _assets["art/intrface/skilln.frm"].frameInfo[0][0].img,
			hoverImg: _assets["art/intrface/skillh.frm"].frameInfo[0][0].img,
			action: "skill",
		};

	this.menu_get = {
			img: _assets["art/intrface/usegetn.frm"].frameInfo[0][0].img,
			hoverImg: _assets["art/intrface/usegeth.frm"].frameInfo[0][0].img,
			action: "get",
		};

};

ContextMenuState.prototype.input = function(e) {

	switch(e.type) {
		case "mousemove":
			break;
		case "keydown":
			break;
		case "mousedown":
			break;
		case "mouseup":
			mainState.contextMenuAction(this.activeItems[this.targetItem].action, this.objectIndex );	// context menu action
			_mouse.x = this.prevX;	// reset to previous stored mouse location
			_mouse.y = this.prevY;
			main_gameStateFunction('closeContextMenu');

			break;

		case "click":
			break;
		case 'contextmenu':	// switch input modes on mouse2
			break;
	};

};

ContextMenuState.prototype.update = function() {
	this.targetItem = Math.max(0,Math.min( ((_mouse.y - this.y)/10)|0, this.activeItems.length-1));	// context menu action
}

ContextMenuState.prototype.render = function() {
	for(var c = 0; c < this.activeItems.length; c++) {
		_context.drawImage((c == this.targetItem) ? this.activeItems[c].hoverImg : this.activeItems[c].img, this.x, this.y+(40*c));
	}

	_context.drawImage(_assets["art/intrface/actarrow.frm"].frameInfo[0][0].img, this.prevX, this.prevY);

}
