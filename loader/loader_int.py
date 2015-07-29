import sys
sys.path.insert(0, '/home/protected/py/lib/python3.4/site-packages/')

import struct
import binascii

def loadINT(intFile):
	intInfo = {}
	
	headerdata = struct.unpack('>2HI2HI13H', intFile.read(42))
	
	intInfo['header'] = {}
	
	nProcedures = struct.unpack('>I', intFile.read(4))[0]
	procedures = []
	
	for i in range(nProcedures):
		procedure = {}
		
		temp = struct.unpack('>6I', intFile.read(24))
		
		procedure['nameIndex'] = temp[0]
		procedure['flags'] = temp[1]
		procedure['delay'] = temp[2]
		procedure['conditionalOffset'] = temp[3]
		procedure['functionOffset'] = temp[4]
		procedure['nArguments'] = temp[5]
		
		procedures.append(procedure)
	
	names = {}
	tableSize = struct.unpack('>I', intFile.read(4))[0]
	j = 0
	while(j < tableSize):
		nameOffset = j+4
		nameSize = struct.unpack('>H', intFile.read(2))[0]
		name = struct.unpack("".join([str(nameSize),'s']), intFile.read(nameSize))[0].decode('UTF-8','ignore').strip()
		
		j+=(nameSize + 2)
		names[nameOffset] = name
		
	struct.unpack('>I', intFile.read(4))[0]	#0xFFFFFFFF	
	
	strings = {}
	tableSize = struct.unpack('>I', intFile.read(4))[0]
	if(tableSize != 0xFFFFFFFF):		#if strings table not empty
		j = 0
		while(j < tableSize):
			stringOffset = j+4
			stringSize = struct.unpack('>H', intFile.read(2))[0]
			string = struct.unpack("".join([str(stringSize),'s']), intFile.read(stringSize))[0].decode('UTF-8','ignore').strip()
			
			j+=(stringSize + 2)
			strings[stringOffset] = string	
		
		struct.unpack('>I', intFile.read(4))[0]	#0xFFFFFFFF
	
	
	for key in names:
		print(str(key) + " " + names[key])
		
	print("\n\nSTRINGS\n\n")
		
	for key in strings:
		print(str(key) + " " + strings[key])
	
	
	
	
	
	
if __name__ == "__main__":
	import loader_dat
	
	master_dat_file = "../data/master.dat"
	master_dat = loader_dat.loadDAT(master_dat_file)	
	int = loadINT(loader_dat.getFile(master_dat_file, master_dat["fileEntries"]["scripts/acmorlis.int"]))