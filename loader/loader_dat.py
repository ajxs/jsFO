import sys
import struct
import binascii
import io
import zlib
import json
import re

from PIL import Image
import numpy
import base64

def loadDAT(src):
	datInfo = {}
	datFile = open(src,"rb")
	
	datFile.seek(0,2) # move the cursor to the end of the file
	size = datFile.tell()
	
	datFile.seek(-8,2)
	
	temp = struct.unpack('II', datFile.read(8))
	datInfo["treeSize"] = temp[0]
	datInfo["datSize"] = temp[1]
	
	datFile.seek(datInfo["datSize"] - datInfo["treeSize"] - 8)
	temp = struct.unpack('I', datFile.read(4))
	datInfo['nFiles'] = temp[0]

	datInfo["fileEntries"] = {}
	
	for i in range(datInfo["nFiles"]):
		fileEntry = {}
		nameSize = struct.unpack('I', datFile.read(4))[0]
		temp = struct.unpack("".join([str(nameSize),'s']), datFile.read(nameSize))
		fileEntry["path"] = temp[0].decode(encoding='UTF-8').lower().replace('\\','/')
		
		temp = struct.unpack('B', datFile.read(1))
		fileEntry["compression"] = temp[0]
		
		temp = struct.unpack('3I', datFile.read(12))
		fileEntry["realSize"] = temp[0]
		fileEntry["packedSize"] = temp[1]
		fileEntry["offset"] = temp[2]
		
		datInfo["fileEntries"][fileEntry["path"]] = fileEntry
		
	
	return datInfo
	
	
def getFile(datFile,fileEntry):
	datFile = open(datFile,"rb")
	
	datFile.seek(fileEntry["offset"],0)
	data = datFile.read(fileEntry["packedSize"])
	
	if(fileEntry["compression"] == 1):
		file = io.BytesIO(zlib.decompress(data))
		
		file.seek(0,2)		# compare file size
		fileSize = file.tell()
		if(fileSize != fileEntry["realSize"]):
			print("Decompression error")
		file.seek(0,0)
	else:
		file = io.BytesIO(data)
	
	
	return file
	