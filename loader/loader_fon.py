import sys
sys.path.insert(0, '/home/protected/py/lib/python3.4/site-packages/')

import struct
import math
from PIL import Image
import base64
import io
import json

def loadFON(fonFile):
	fontInfo = {}

	fontInfo['type'] = "fon"

	temp = struct.unpack('5i', fonFile.read(5*4))
	#fontInfo['nChars'] = temp[0]
	nChars = temp[0]
	fontInfo['height'] = temp[1]
	fontInfo['gapSize'] = temp[2]
	#fontInfo['pointer_info'] = temp[3]
	#fontInfo['pointer_data'] = temp[4]

	fontInfo['symbolInfo'] = []

	offsets = [];

	for i in range(nChars):
		symbol = {}
		temp = struct.unpack('2i', fonFile.read(2*4))
		symbol['width'] = temp[0]
		symbol['height'] = fontInfo['height']
		offsets.append(temp[1])
		fontInfo['symbolInfo'].append(symbol)


	size =  offsets[nChars-1] + (fontInfo['symbolInfo'][nChars-1]['width'] + 7) / 8 * fontInfo['height'];
	fontData = fonFile.read(math.floor(size))

	rowWidth = 0
	maxRowWidth = 0
	nRows = 0
	for i in range(nChars):
		if(i%16 == 0):
			if(rowWidth > maxRowWidth):
				maxRowWidth = rowWidth
			rowWidth = 0
			nRows += 1

		rowWidth += fontInfo['symbolInfo'][i]['width']

	mainimg = Image.new("RGBA", (maxRowWidth,8*fontInfo['height']),(0,0,0,0))
	currentX = 0
	currentY = 0
	currentRow = 0


	for i in range(nChars):
		if(fontInfo['height'] * fontInfo['symbolInfo'][i]['width'] != 0):
			bytesPerLine = math.floor((fontInfo['symbolInfo'][i]['width'] + 7) / 8)
			img = Image.new("RGBA", (fontInfo['symbolInfo'][i]['width'],fontInfo['height']),(0,0,0,0))
			pix = img.load()

			for h in range(fontInfo['height']):
				for j in range(fontInfo['symbolInfo'][i]['width']):
					ofs = math.floor(offsets[i] + h * bytesPerLine + (j / 8))
					if(fontData[ofs] & (1 << (7 - (j % 8)))):
						pix[j,h] = (255,255,255,255)

			mainimg.paste(img, (currentX,currentY))
			fontInfo['symbolInfo'][i]['x'] = currentX
			fontInfo['symbolInfo'][i]['y'] = currentY

			if(i%16 == 0):
				currentX = 0
				currentRow += 1
			else:
				currentX += fontInfo['symbolInfo'][i]['width'];

			currentY = currentRow * fontInfo['height']

	output = io.BytesIO()
	mainimg.save(output, "PNG", bits=8)

	datastring = str( base64.b64encode( output.getvalue()) )
	datastring_length = len(datastring)


	fontInfo['imgdata'] = "".join(["data:image/png;base64,", datastring[2: (datastring_length-1)] ])


	return fontInfo
