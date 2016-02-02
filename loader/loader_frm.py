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
			
	frmInfo['frameAreaSize'] = struct.unpack('>I', frmFile.read(4))[0]
	
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

			pixels = struct.unpack("".join(['>',str(totalPixels),'B']), frmFile.read(totalPixels))
			pixelData = numpy.asarray(pixels, numpy.uint8).reshape((imgInfo['height'], imgInfo['width']))

			img = Image.fromarray(pixelData,'P')
			img.putpalette(pal)

			output = io.BytesIO()
			img.save(output, "GIF", transparency=0)
			
			datastring = str( base64.b64encode( output.getvalue()) )
			datastring_length = len(datastring)		
			
			imgInfo['imgdata'] = "".join(["data:image/gif;base64,",datastring[2: datastring_length-1] ])
			
			dirInfo.append(imgInfo)
		
		frmInfo['frameInfo'].append(dirInfo)
	
	return frmInfo
	
if __name__ == "__main__":
	import loader_dat
	import loader_pal
	
	urlprefix = "../data/"	# use this to point to the directory with the undat'd Fallout2 data
	
	master_dat = loader_dat.DATFile("".join([urlprefix,"master.dat"]))
	critter_dat = loader_dat.DATFile("".join([urlprefix,"critter.dat"]))
	color = loader_pal.loadPAL(master_dat.getFile("color.pal")) 
	testfrm = loadFRM(critter_dat.getFile("art/critters/hmjmpsaa.frm"), color) 
	
	print("FPS: " + str(testfrm['fps']))
	print("actionFrame: " + str(testfrm['actionFrame']))
	print("nFrames: " + str(testfrm['nFrames']))
	
	for i in range(6):
		print("x: " + str(testfrm['shift'][i]['x']) + " y: " + str(testfrm['shift'][i]['y']))
	
	print("frameAreaSize: " + str(testfrm['frameAreaSize']))
	