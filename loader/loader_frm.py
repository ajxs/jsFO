import sys
sys.path.insert(0, '/home/protected/py/lib/python3.4/site-packages/')

import struct
from PIL import Image
import numpy
import base64
import io

def loadFRM(frmFile,pal):
	frmInfo = {}
	frmInfo['type'] = "frm"
	
	temp = struct.unpack('>I3H', frmFile.read(10))
	
	version = temp[0]
	

	frmInfo['fps'] = temp[1]
	frmInfo['actionFrame'] = temp[2]
	frmInfo['nFrames'] = temp[3]
	
	frmInfo['shift'] = []
	for i in range(6):
		shiftInfo = {}
		shiftInfo['x'] = struct.unpack('>h', frmFile.read(2))[0]
		frmInfo['shift'].append(shiftInfo)
		
	for i in range(6):
		frmInfo['shift'][i]['y'] = struct.unpack('>h', frmFile.read(2))[0]
		
	fileOffset = []
	for i in range(6):
		fileOffset.append(struct.unpack('>I', frmFile.read(4))[0])
			
	frameAreaSize = struct.unpack('>I', frmFile.read(4))[0]
	
	nDir = 1
	for i in range(6):
		if fileOffset[i] > 0:
			nDir += 1
	
	frmInfo['frameInfo'] = []
	for dir in range(nDir):
		dirInfo = []
		for f in range(frmInfo['nFrames']):
			imgInfo = {}
			temp = struct.unpack('>2HI2h', frmFile.read(12))
			
			imgInfo['width'] = temp[0]
			imgInfo['height'] = temp[1]
			
			totalPixels = temp[2]
			
			imgInfo['offsetX'] = temp[3]
			imgInfo['offsetY'] = temp[4]
			
			imgData = numpy.empty([imgInfo['height'],imgInfo['width']],numpy.uint8)

			for h in range(imgInfo['height']):
				for w in range(imgInfo['width']):
					imgData[h][w] = struct.unpack('>B', frmFile.read(1))[0]				
			

			img = Image.fromarray(imgData,'P')
			img.putpalette(pal)
			
			output = io.BytesIO()
			img.save(output, "GIF", transparency=0)
			
			datastring = str( base64.b64encode( output.getvalue()) )
			datastring_length = len(datastring)		
			
			imgInfo['imgdata'] = "".join(["data:image/gif;base64,",datastring[2: datastring_length-1] ])
			
			dirInfo.append(imgInfo)
		
		frmInfo['frameInfo'].append(dirInfo)
	
	return frmInfo