function blitFRM(frm, dest, dx, dy, dir = 0, frame = 0, alpha = 1) {
	if(!frm) return;
	if(alpha < 1) dest.globalAlpha = alpha;
	dest.drawImage(frm.img,
		frm.frameInfo[dir][frame].atlasX,
	 	frm.frameInfo[dir][frame].atlasY,
		frm.frameInfo[dir][frame].width,
		frm.frameInfo[dir][frame].height,
		dx,
		dy,
		frm.frameInfo[dir][frame].width,
		frm.frameInfo[dir][frame].height);
	if(alpha < 1) dest.globalAlpha = 1;
};


function blitFRMOutline(frm, dest, dx, dy, dir = 0, frame = 0, alpha = 1) {
	if(!frm) return;
	if(!frm.img_outline) createFRMOutline(frm);
	if(alpha < 1) dest.globalAlpha = alpha;
	dest.drawImage(frm.img_outline,
		frm.frameInfo_outline[dir][frame].atlasX,
	 	frm.frameInfo_outline[dir][frame].atlasY,
		frm.frameInfo_outline[dir][frame].width,
		frm.frameInfo_outline[dir][frame].height,
		dx,
		dy,
		frm.frameInfo_outline[dir][frame].width,
		frm.frameInfo_outline[dir][frame].height);
	if(alpha < 1) dest.globalAlpha = 1;
};

const createFRMOutline_shadowColor = 12;
function createFRMOutline(frm) {
	var outlines = new Array(frm.frameInfo.length);
	var maxHeight = 0, maxWidth = 0;

	for(let dir = 0; dir < frm.frameInfo.length; dir++) {
		outlines[dir] = new Array(frm.nFrames);

		for(let f = 0; f < frm.nFrames; f++) {
			let outlineCanvas = document.createElement('canvas');
			outlineCanvas.width = frm.frameInfo[dir][f].width + 2;
			outlineCanvas.height = frm.frameInfo[dir][f].height + 2;
			let outlineContext = outlineCanvas.getContext('2d');
			outlineContext.imageSmoothingEnabled = false;

			let trimmedCanvas = document.createElement('canvas');		// Trim off shadow then reblit
			trimmedCanvas.width = frm.frameInfo[dir][f].width + 2;
			trimmedCanvas.height = frm.frameInfo[dir][f].height + 2;
			let trimmedContext = trimmedCanvas.getContext('2d');
			trimmedCanvas.imageSmoothingEnabled = false;
			trimmedContext.globalCompositeOperation = 'source-over';
			trimmedContext.drawImage(frm.img,
				frm.frameInfo[dir][f].atlasX,
			 	frm.frameInfo[dir][f].atlasY,
				frm.frameInfo[dir][f].width,
				frm.frameInfo[dir][f].height,
				1,
				1,
				frm.frameInfo[dir][f].width,
				frm.frameInfo[dir][f].height);

			let trimmedData = trimmedContext.getImageData(0,0,
				frm.frameInfo[dir][f].width + 2,
				frm.frameInfo[dir][f].height + 2);

			let x, y;
			outlineContext.fillStyle = "#FF0000";
			for(let i = 0, imgDataLength = trimmedData.data.length; i < imgDataLength; i+=4) {
				if(trimmedData.data[i+3] > 0) {
					x = (i/4) % (frm.frameInfo[dir][f].width + 2);
					y = ((i/4) / (frm.frameInfo[dir][f].width + 2))|0;
					outlineContext.fillRect(x-1, y-1, 3, 3);
				}
			}

			let imgData = outlineContext.getImageData(0,0,
				frm.frameInfo[dir][f].width + 2,
				frm.frameInfo[dir][f].height + 2);

			for(let i = 0, imgDataLength = trimmedData.data.length; i < imgDataLength; i+=4) {
				if(trimmedData.data[i+3] > 0) imgData.data[i+3] = 0;
			}

			outlineContext.putImageData(imgData,0,0);

			maxWidth += frm.frameInfo[dir][f].width + 2;
			if(frm.frameInfo[dir][f].height + 2 > maxHeight) maxHeight = frm.frameInfo[dir][f].height + 2
			outlines[dir][f] = outlineCanvas;

		}
	}

	let total = document.createElement('canvas');
	let totalContext = total.getContext('2d');
	total.width = maxWidth;
	total.height = maxHeight;

	let currentX = 0;
	let outlineInfo = new Array(frm.frameInfo.length);
	for(let dir = 0; dir < frm.frameInfo.length; dir++) {
		outlineInfo[dir] = new Array(frm.nFrames);
		for(let f = 0; f < frm.nFrames; f++) {
			totalContext.drawImage(outlines[dir][f], currentX, 0);

			outlineInfo[dir][f] = {
				atlasX: currentX,
				atlasY: 0,
				width: frm.frameInfo[dir][f].width + 2,
				height: frm.frameInfo[dir][f].height + 2,
				offsetX: frm.frameInfo[dir][f].offsetX,
				offsetY: frm.frameInfo[dir][f].offsetY
			}

			currentX += frm.frameInfo[dir][f].width + 2;
		}
	}

	document.body.appendChild(total);
	frm.img_outline = total;
	frm.frameInfo_outline = outlineInfo;
};
