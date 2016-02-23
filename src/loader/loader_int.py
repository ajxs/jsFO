import struct
import binascii
import loader_util

def loadINT(intFile):
	intInfo = {}
	intInfo['type'] = "int"

	intInfo['header'] = {}
	headerdata = struct.unpack('>2HI2HI13H', intFile.read(42))

	nProcedures = loader_util.readUint32(intFile, 1)
	intInfo['procedures'] = {}

	procedures = []

	for i in range(nProcedures):
		procedure = {}

		procedure['nameIndex'] = loader_util.readUint32(intFile, 1)
		procedure['flags'] = loader_util.readUint32(intFile, 1)
		procedure['delay'] = loader_util.readUint32(intFile, 1)
		procedure['conditionalOffset'] = loader_util.readUint32(intFile, 1)
		procedure['functionOffset'] = loader_util.readUint32(intFile, 1)
		procedure['nArguments'] = loader_util.readUint32(intFile, 1)

		procedures.append(procedure)

	identifiers = {}
	identifiers_blockOffset = intFile.tell()
	identifiers_blockSize = loader_util.readUint32(intFile, 1)

	while((intFile.tell() - identifiers_blockOffset) < identifiers_blockSize):
		nameSize = loader_util.readUint16(intFile, 1)
		nameOffset = intFile.tell() - identifiers_blockOffset
		identifiers[nameOffset] = struct.unpack("".join([str(nameSize),'s']), intFile.read(nameSize))[0].decode('UTF-8','ignore').strip()

	assert loader_util.readUint32(intFile, 1) == 0xFFFFFFFF, "did not get 0xFF check byte at end of block"

	for proc in procedures:
		name = identifiers[proc['nameIndex']]
		intInfo["procedures"][name] = proc

	intInfo['strings'] = {}
	strings_blockOffset = intFile.tell()
	strings_blockSize = loader_util.readUint32(intFile, 1)
	if(strings_blockSize != 0xFFFFFFFF):		#if strings table not empty
		while((intFile.tell() - strings_blockOffset) < strings_blockSize):
			stringSize = loader_util.readUint16(intFile, 1)
			stringOffset = intFile.tell() - strings_blockOffset
			intInfo['strings'][stringOffset] = struct.unpack("".join([str(stringSize),'s']), intFile.read(stringSize))[0].decode('UTF-8','ignore').strip()


	intInfo['body'] = {}
	opcode = 0

	while True:
		try:
			address = intFile.tell()
			opcode = loader_util.readUint16(intFile, 1)
			intInfo['body'][address] = opcode
		except:
			break

	return intInfo


if __name__ == "__main__":
	import loader_dat

	master_dat = loader_dat.DATFile("../../data/master.dat")
	#int = loadINT(master_dat.getFile("scripts/ahhakun.int"))
	int = loadINT(master_dat.getFile("scripts/gcfestus.int"))

	print("\n\nPROCEDURES\n")
	for key in int['procedures']:
		print(str(key))

	print("\n\nSTRINGS\n")

	for key in int['strings']:
		print(int['strings'][key])
