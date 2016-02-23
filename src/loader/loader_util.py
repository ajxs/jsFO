import struct

def readUint32(stream, bigEndian = 0):
	return struct.unpack((">I" if bigEndian else "<I"), stream.read(4))[0]

def readInt32(stream, bigEndian = 0):
	return struct.unpack((">i" if bigEndian else "<i"), stream.read(4))[0]

def readUint16(stream, bigEndian = 0):
	return struct.unpack((">H" if bigEndian else "<H"), stream.read(2))[0]
