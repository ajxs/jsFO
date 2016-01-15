import sys
sys.path.insert(0, '/home/protected/py/lib/python3.4/site-packages/')

import struct
import binascii

def loadINT(intFile):
	intInfo = {}
	intInfo['type'] = "int"
	
	headerdata = struct.unpack('>2HI2HI13H', intFile.read(42))
	
	intInfo['header'] = {}
	
	intInfo['nProcedures'] = struct.unpack('>I', intFile.read(4))[0]
	intInfo['procedures'] = []
	
	for i in range(intInfo['nProcedures']):
		procedure = {}
		
		temp = struct.unpack('>6I', intFile.read(24))
		
		procedure['nameIndex'] = temp[0]
		procedure['flags'] = temp[1]
		procedure['delay'] = temp[2]
		procedure['conditionalOffset'] = temp[3]
		procedure['functionOffset'] = temp[4]
		procedure['nArguments'] = temp[5]
		
		intInfo['procedures'].append(procedure)
	
	intInfo['names'] = {}
	tableSize = struct.unpack('>I', intFile.read(4))[0]
	j = 0
	while(j < tableSize):
		nameOffset = j+4
		nameSize = struct.unpack('>H', intFile.read(2))[0]
		name = struct.unpack("".join([str(nameSize),'s']), intFile.read(nameSize))[0].decode('UTF-8','ignore').strip()
		
		j+=(nameSize + 2)
		intInfo['names'][nameOffset] = name
		
	struct.unpack('>I', intFile.read(4))[0]	#0xFFFFFFFF	
	
	intInfo['strings'] = {}
	tableSize = struct.unpack('>I', intFile.read(4))[0]
	if(tableSize != 0xFFFFFFFF):		#if strings table not empty
		j = 0
		while(j < tableSize):
			stringOffset = j+4
			stringSize = struct.unpack('>H', intFile.read(2))[0]
			string = struct.unpack("".join([str(stringSize),'s']), intFile.read(stringSize))[0].decode('UTF-8','ignore').strip()
			
			j+=(stringSize + 2)
			intInfo['strings'][stringOffset] = string	
		
		struct.unpack('>I', intFile.read(4))[0]	#0xFFFFFFFF
	
	intInfo['body'] = {}
	opcode = 0
	
	while True:
		try:
			address = intFile.tell()
			opcode = struct.unpack('>H', intFile.read(2))[0]
			intInfo['body'][address] = opcode
		except:
			break
	
	
	return intInfo
	
if __name__ == "__main__":
	import loader_dat
	

	master_dat = loader_dat.DATFile("../data/master.dat")
	int = loadINT(master_dat.getFile("scripts/ahhakun.int")) 
	
	
	print("\n\nPROCEDURES\n\n")
	for i in range(int['nProcedures']):
		print(int['procedures'][i])	
	
	print("\n\nNAMES\n\n")
	for key in int['names']:
		print(str(key) + " " + int['names'][key])
		
	print("\n\nSTRINGS\n\n")
		
	for key in int['strings']:
		print(str(key) + " " + int['strings'][key])
	
	print("\n\nBODY\n\n")
	
	for key in int['body']:
		print(str(key) + " " + str(hex(int['body'][key])))