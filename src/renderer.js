function blitFRM(frm, dest, dx, dy, dir = 0, frame = 0) {
	dest.drawImage(frm.img,
		frm.frameInfo[dir][frame].atlasX,
	 	frm.frameInfo[dir][frame].atlasY,
		frm.frameInfo[dir][frame].width,
		frm.frameInfo[dir][frame].height,
		dx,
		dy,
		frm.frameInfo[dir][frame].width,
		frm.frameInfo[dir][frame].height);
};
