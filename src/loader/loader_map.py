import struct
import loader_pro
import loader_dat
import sys
import loader_util

mapScriptTypes = ["system", "map", "time", "item", "critter"]

def loadMAP(mapFile, dat_file, loadData):

	proCache = {}

	mapInfo = {}

	mapInfo['type'] = "map"
	mapInfo['map_version'] = loader_util.readUint32(mapFile, 1)
	mapInfo['filename'] = str(mapFile.read(16))

	mapInfo['playerStartPos'] = loader_util.readInt32(mapFile, 1)
	mapInfo['defaultElevation'] = loader_util.readInt32(mapFile, 1)
	mapInfo['playerStartDir'] = loader_util.readInt32(mapFile, 1)
	mapInfo['nLocalVars'] = loader_util.readInt32(mapFile, 1)
	mapInfo['scriptID'] = loader_util.readInt32(mapFile, 1)
	mapInfo['elevationFlags'] = loader_util.readInt32(mapFile, 1)
	mapInfo['unknown'] = loader_util.readInt32(mapFile, 1)
	mapInfo['nGlobalVars'] = loader_util.readInt32(mapFile, 1)
	mapInfo['mapID'] = loader_util.readInt32(mapFile, 1)


	mapInfo['mapTime'] = loader_util.readUint32(mapFile, 1)

	mapFile.seek((4*44),1)

	mapInfo['globalVars'] = struct.unpack("".join([">",str(mapInfo['nGlobalVars']),"i"]), mapFile.read(4*mapInfo['nGlobalVars']))
	mapInfo['localVars'] = struct.unpack("".join([">",str(mapInfo['nLocalVars']),"i"]), mapFile.read(4*mapInfo['nLocalVars']))

	mapInfo['elevationAt0'] = False if (mapInfo['elevationFlags'] & 2 ) else True
	mapInfo['elevationAt1'] = False if (mapInfo['elevationFlags'] & 4 ) else True
	mapInfo['elevationAt2'] = False if (mapInfo['elevationFlags'] & 8 ) else True

	mapInfo['nElevations'] = 1

	if mapInfo['elevationAt1']:
		mapInfo['nElevations'] += 1

	if mapInfo['elevationAt2']:
		mapInfo['nElevations'] += 1


	mapInfo['tileInfo'] = []        #read tiles
	for e in range(mapInfo['nElevations']):
		elevInfo = {'roofTiles': [], 'floorTiles': []}

		for i in range(10000):
			elevInfo['roofTiles'].append(loader_util.readUint16(mapFile, 1))
			elevInfo['floorTiles'].append(loader_util.readUint16(mapFile, 1))

		mapInfo['tileInfo'].append(elevInfo)


	mapInfo['scriptInfo'] = {}

	for i in range(5):
		mapInfo['scriptInfo'][mapScriptTypes[i]] = {}

		nScripts = loader_util.readUint32(mapFile, 1)

		if nScripts == 0:
			continue

		loop = nScripts
		if nScripts%16 > 0:
			loop += (16 - nScripts%16)

		check = 0
		for j in range(loop):

			script = {}

			script['PID'] = loader_util.readInt32(mapFile, 1)
			script['PID_id'] = script['PID'] & 0xffff
			script['PID_type'] = (script['PID'] & 0xFF000000) >> 24

			script['unknown1'] = loader_util.readInt32(mapFile, 1)

			if script['PID_type'] == 1:
				script['unknown2'] = loader_util.readInt32(mapFile, 1)
				script['unknown3'] = loader_util.readInt32(mapFile, 1)
			elif script['PID_type'] == 2:
				script['unknown2'] = loader_util.readInt32(mapFile, 1)

			script['unknown4'] = loader_util.readInt32(mapFile, 1)
			script['scriptID'] = loader_util.readInt32(mapFile, 1)

			script['unknown5'] = loader_util.readInt32(mapFile, 1)
			script['unknown6'] = loader_util.readInt32(mapFile, 1)
			script['unknown7'] = loader_util.readInt32(mapFile, 1)
			script['unknown8'] = loader_util.readInt32(mapFile, 1)
			script['unknown9'] = loader_util.readInt32(mapFile, 1)
			script['unknown10'] = loader_util.readInt32(mapFile, 1)
			script['unknown11'] = loader_util.readInt32(mapFile, 1)
			script['unknown12'] = loader_util.readInt32(mapFile, 1)
			script['unknown13'] = loader_util.readInt32(mapFile, 1)
			script['unknown14'] = loader_util.readInt32(mapFile, 1)
			script['unknown15'] = loader_util.readInt32(mapFile, 1)
			script['unknown16'] = loader_util.readInt32(mapFile, 1)

			if j < nScripts:
				mapInfo['scriptInfo'][mapScriptTypes[i]][script['PID_id']] = script

			if j%16 == 15:    # after every 16 scripts is the check block
				check += loader_util.readUint32(mapFile, 1)
				mapFile.seek(4,1)

		if check != nScripts:
			print("fail")

	mapInfo['objectInfo'] = []

	def loadMapObject(objNum = 0):
		object = {}

		mapFile.seek(4,1)
		object['hexPosition'] = loader_util.readInt32(mapFile, 1)
		mapFile.seek(4*4,1)

		object['frameNumber'] = loader_util.readUint32(mapFile, 1)
		object['orientation'] = loader_util.readUint32(mapFile, 1)

		object['FID'] = loader_util.readUint32(mapFile, 1)
		object['frmTypeID'] = object['FID'] >> 24
		object['frmID'] = 0x00FFFFFF & object['FID']

		object['itemFlags'] = loader_util.readUint32(mapFile, 1)
		object['elevation'] = loader_util.readUint32(mapFile, 1)

		object['PID'] = loader_util.readUint32(mapFile, 1)
		object['objectTypeID'] = object['PID'] >> 24
		object['objectID'] = 0x00FFFFFF & object['PID']
		mapFile.seek(4*4,1)

		mapScriptPID = loader_util.readInt32(mapFile, 1)
		mapScriptPID_type = (mapScriptPID & 0xFF000000) >> 24
		mapScriptPID_id = mapScriptPID & 0xffff


		if mapScriptPID != -1:
			if mapInfo['scriptInfo'][mapScriptTypes[mapScriptPID_type]][mapScriptPID_id]:
				object['mapScriptID'] = mapScriptPID_id



		object['scriptID'] = loader_util.readInt32(mapFile, 1)

		object['inventorySize'] = loader_util.readInt32(mapFile, 1)
		mapFile.seek(4*3,1)

		if(object['objectTypeID'] not in range(0, 6)):
			sys.exit("".join(["unrecognized filetype: ",str(object['objectTypeID'])]))

		filetype = ('items', 		# 0... etc
			'critters',
			'scenery',
			'walls',
			'tiles',
			'misc')[object['objectTypeID']]


		loadDataPRO = loadData.getFile( "".join(["proto/",filetype,"/",filetype,".lst"]) )
		filename = "".join(["proto/",filetype,"/",loadDataPRO['data'][object['objectID']-1].lower()])	# caching
		if filename in proCache:
			proto = proCache[filename]
		else:
			proCache[filename] = loader_pro.loadPRO(dat_file.getFile(filename))		# @TODO: Fix tight coupling issue here
			proto = proCache[filename]


		if('subtypeID' in proto):
			object['subtypeID'] = proto['subtypeID']

		object['textID'] = proto['textID']

		if object['objectTypeID'] == 0:        #items
			if proto['subtypeID'] == 0:
				object['armorMaleFID'] = proto['armorMaleFID']
				object['armorFemaleFID'] = proto['armorFemaleFID']
			elif proto['subtypeID'] == 3:
				object['animCode'] = proto['animCode']
				mapFile.seek(4*2,1)
			elif (proto['subtypeID'] == 4 or proto['subtypeID'] == 5 or proto['subtypeID'] == 6):
				mapFile.seek(4,1)

		elif object['objectTypeID'] == 1:    #critters
			mapFile.seek((10*4),1)

			object['frmID'] = 0x00000FFF & object['FID']
			object['objectID1'] = (object['FID'] & 0x0000F000) >> 12
			object['objectID2'] = (object['FID'] & 0x00FF0000) >> 16
			object['frmTypeID'] = (object['FID'] & 0x0F000000) >> 24
			object['objectID3'] = (object['FID'] & 0xF0000000) >> 28


		elif object['objectTypeID'] == 2:    #scenery
			if proto['subtypeID'] == 0:    #door
				mapFile.seek(4,1)
			if proto['subtypeID'] == 1:    #stairs
				mapFile.seek(4*2,1)
			if proto['subtypeID'] == 2:    #elevator
				mapFile.seek(4*2,1)
			if (proto['subtypeID'] == 3 or proto['subtypeID'] == 4):    #ladder top/bottom
				mapFile.seek(4*2,1)

		elif object['objectTypeID'] == 5:    #misc
			if object['objectID'] == 12:
				pass
			elif( 16 <= object['objectID'] <= 23 ):    # 16-23
				object['exitMap'] = loader_util.readInt32(mapFile, 1)
				object['exitPosition'] = loader_util.readInt32(mapFile, 1)
				object['exitElevation'] = loader_util.readInt32(mapFile, 1)
				object['exitOrientation'] = loader_util.readInt32(mapFile, 1)
			else:
				mapFile.seek(4*4,1)

		if object['inventorySize'] > 0:
			object['inventory'] = []
			for w in range(object['inventorySize']):
				subobject_amount = loader_util.readInt32(mapFile, 1)
				subobject = loadMapObject()
				subobject['amount'] = subobject_amount
				object['inventory'].append(subobject)

		return object


	objects_total = loader_util.readInt32(mapFile, 1)

	def readElevation(nElevation = 0):
		objects_elevation = loader_util.readUint32(mapFile, 1)
		return list(map(loadMapObject, range(objects_elevation)))

	mapInfo['objectInfo'] = list(map(readElevation, range(mapInfo['nElevations'])))


	return mapInfo
