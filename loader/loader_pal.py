import struct

def loadPAL(palFile):
	palInfo = []

	for i in range(256):
		palInfo.append(min(struct.unpack('>B', palFile.read(1))[0]*4,255))
		palInfo.append(min(struct.unpack('>B', palFile.read(1))[0]*4,255))
		palInfo.append(min(struct.unpack('>B', palFile.read(1))[0]*4,255))
	
	return palInfo