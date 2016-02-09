import sys
sys.path.insert(0, '/home/protected/py/lib/python3.4/site-packages/')

import struct
import math
import base64
import io
from PIL import Image
import numpy
import json


def loadAAF(aafFile):
	fontInfo = {}

	fontInfo['type'] = "aaf"

	pal = [];		# ten colour pallette

	pal.append(0)	#0 = transparent
	pal.append(0)
	pal.append(0)

	pal.append(30)	#1
	pal.append(30)
	pal.append(30)

	pal.append(66)	#2
	pal.append(66)
	pal.append(66)

	pal.append(116)	#3
	pal.append(116)
	pal.append(116)

	pal.append(116)	#4
	pal.append(116)
	pal.append(116)

	pal.append(169) #5
	pal.append(169)
	pal.append(169)

	pal.append(219) #6
	pal.append(219)
	pal.append(219)

	pal.append(255) #7
	pal.append(255)
	pal.append(255)

	for i in range(247):
		pal.append(0)
		pal.append(0)
		pal.append(0)



	temp = struct.unpack('>4c', aafFile.read(4))

	#fontInfo['signature'] = str(temp)

	temp = struct.unpack('>4H', aafFile.read(4*2))

	fontInfo['height'] = temp[0]
	fontInfo['gapSize'] = temp[1]
	fontInfo['spaceWidth'] = temp[2]
	fontInfo['verticalGap'] = temp[3]

	fontInfo['symbolInfo'] = []


	for i in range(256):
		glyphInfo = {}
		temp = struct.unpack('>2HL', aafFile.read(8))
		glyphInfo['width'] = temp[0]
		glyphInfo['height'] = temp[1]
		#glyphInfo['offset'] = temp[2]
		fontInfo['symbolInfo'].append(glyphInfo)

	rowWidth = 0
	maxRowWidth = 0
	nRows = 0

	for i in range(256):
		if( fontInfo['symbolInfo'][i]['height'] * fontInfo['symbolInfo'][i]['width'] != 0):
			if(i%16 == 0):
				if(rowWidth > maxRowWidth):
					maxRowWidth = rowWidth
				rowWidth = 0
				nRows += 1

			rowWidth += fontInfo['symbolInfo'][i]['width']


	mainimg = Image.new("P", (maxRowWidth,nRows*fontInfo['height']))
	mainimg.putpalette(pal)

	currentX = 0
	currentY = 0
	currentRow = 0

	for i in range(256):
		if( fontInfo['symbolInfo'][i]['height'] * fontInfo['symbolInfo'][i]['width'] != 0):
			imgData = numpy.empty([fontInfo['symbolInfo'][i]['height'],fontInfo['symbolInfo'][i]['width']],numpy.uint8)
			for h in range(fontInfo['symbolInfo'][i]['height']):
				for w in range(fontInfo['symbolInfo'][i]['width']):
					imgData[h][w] = struct.unpack('>B', aafFile.read(1))[0]

			img = Image.fromarray(imgData,'P')
			img.putpalette(pal)

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
	mainimg.save(output, "PNG", transparency=0, bits=8)

	datastring = str( base64.b64encode( output.getvalue()) )
	datastring_length = len(datastring)


	fontInfo['imgdata'] = "".join(["data:image/gif;base64,", datastring[2: (datastring_length-1)] ])

	return fontInfo
