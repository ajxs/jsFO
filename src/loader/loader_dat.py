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



class DATFile:
	'DATFile'

	def __init__(self, src):
		self.path = src

		datFile = open(self.path,"rb")

		datFile.seek(0,2) # move the cursor to the end of the file
		size = datFile.tell()

		datFile.seek(-8,2)

		temp = struct.unpack('II', datFile.read(8))
		treeSize = temp[0]
		datSize = temp[1]

		datFile.seek(datSize - treeSize - 8)
		temp = struct.unpack('I', datFile.read(4))
		self.nFiles = temp[0]

		self.fileEntries = {}

		for i in range(self.nFiles):
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

			self.fileEntries[fileEntry["path"]] = fileEntry


	def printFileEntries(self):
		for key in self.fileEntries:
			print(self.fileEntries[key]["path"])


	def getFile(self, path):
		datFile = open(self.path,"rb")


		if path in self.fileEntries:
			fileEntry = self.fileEntries[path]
		else:
			return None

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




if __name__ == "__main__":
	testDat = DATFile("../../data/master.dat")
	testDat.printFileEntries()
