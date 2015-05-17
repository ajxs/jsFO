import struct
import loader_pro
import sys

urlprefix = "../data/"

def loadMAP(src):

	try:
		mapFile = open(src,"rb")
	except (OSError, IOError):
		print("MAP file not found")
		sys.exit(2)	

	lst_pro = {"items":[], "walls":[], "tiles":[], "scenery":[], "critters":[], "misc":[]}

	lstFile = open("".join([urlprefix,"proto/items/items.lst"]),"r")
	for line in lstFile:
		lst_pro["items"].append(line.strip())

	lstFile = open("".join([urlprefix,"proto/walls/walls.lst"]),"r")
	for line in lstFile:
		lst_pro["walls"].append(line.strip())

	lstFile = open("".join([urlprefix,"proto/tiles/tiles.lst"]),"r")
	for line in lstFile:
		lst_pro["tiles"].append(line.strip())

	lstFile = open("".join([urlprefix,"proto/scenery/scenery.lst"]),"r")
	for line in lstFile:
		lst_pro["scenery"].append(line.strip())

	lstFile = open("".join([urlprefix,"proto/critters/critters.lst"]),"r")
	for line in lstFile:
		lst_pro["critters"].append(line.strip())

	lstFile = open("".join([urlprefix,"proto/misc/misc.lst"]),"r")
	for line in lstFile:
		lst_pro["misc"].append(line.strip())
		
	proCache = {}

	mapInfo = {}

	mapInfo['map_version'] = struct.unpack('>I', mapFile.read(4))[0]
	mapInfo['filename'] = str(mapFile.read(16))

	temp = struct.unpack('>9i', mapFile.read(4*9))

	mapInfo['playerStartPos'] =  temp[0]
	mapInfo['defaultElevation'] =  temp[1]
	mapInfo['playerStartDir'] =  temp[2]
	mapInfo['nLocalVars'] =  temp[3]
	mapInfo['scriptID'] =  temp[4]
	mapInfo['elevationFlags'] =  temp[5]
	mapInfo['unknown'] = temp[6]
	mapInfo['nGlobalVars'] =  temp[7]
	mapInfo['mapID'] =  temp[8]


	mapInfo['mapTime'] =  struct.unpack('>I', mapFile.read(4))[0]

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
			elevInfo['roofTiles'].append(struct.unpack('>H', mapFile.read(2))[0])
			elevInfo['floorTiles'].append(struct.unpack('>H', mapFile.read(2))[0])

		mapInfo['tileInfo'].append(elevInfo)


	mapInfo['scriptInfo'] = []

	for i in range(5):
		nScripts = struct.unpack('>I', mapFile.read(4))[0]
		scriptInfo = []

		if nScripts > 0:
			loop = nScripts
			if nScripts%16 > 0:
				loop += (16 - nScripts%16)

				check = 0
				for j in range(loop):

					script = {}

					script['PID'] = struct.unpack('>i', mapFile.read(4))[0]
					mapFile.seek(4,1)

					if ((script['PID'] & 0xFF000000) >> 24) == 1:
						mapFile.seek((4*2),1)
					elif ((script['PID'] & 0xFF000000) >> 24) == 2:
						mapFile.seek(4,1)

					mapFile.seek(4,1)
					script['scriptID'] = struct.unpack('>i', mapFile.read(4))[0]

					mapFile.seek((4*12),1)
					scriptInfo.append(script)

					if j%16 == 15:    # after every 16 scripts is the check block
						check += struct.unpack('>I', mapFile.read(4))[0]
						mapFile.seek(4,1)

				if check != nScripts:
					print("fail")
		mapInfo['scriptInfo'].append(scriptInfo)

	mapInfo['objectInfo'] = []

	def loadMapObject():
		object = {}

		mapFile.seek(4,1)
		object['hexPosition'] = struct.unpack('>i', mapFile.read(4))[0]
		mapFile.seek(4*4,1)

		object['frameNumber'] = struct.unpack('>I', mapFile.read(4))[0]
		object['orientation'] = struct.unpack('>I', mapFile.read(4))[0]

		object['FID'] = struct.unpack('>I', mapFile.read(4))[0]
		object['frmTypeID'] = object['FID'] >> 24
		object['frmID'] = 0x00FFFFFF & object['FID']

		object['itemFlags'] = struct.unpack('>I', mapFile.read(4))[0]
		object['elevation'] = struct.unpack('>I', mapFile.read(4))[0]

		object['PID'] = struct.unpack('>I', mapFile.read(4))[0]
		object['objectTypeID'] = object['PID'] >> 24
		object['objectID'] = 0x00FFFFFF & object['PID']
		mapFile.seek(4*4,1)

		mapScriptID = struct.unpack('>i', mapFile.read(4))[0]

		if mapScriptID != -1:
			for l in range(len(mapInfo['scriptInfo'])):        # incase changed from hardcoded 5 types
				for m in range(len(mapInfo['scriptInfo'][l])):
					if mapScriptID == mapInfo['scriptInfo'][l][m]['scriptID']:
						object['mapScriptID'] = mapScriptID

		scriptID = struct.unpack('>i', mapFile.read(4))[0]
		if scriptID != -1:
			object['scriptID'] = scriptID

		object['inventorySize'] = struct.unpack('>i', mapFile.read(4))[0]
		mapFile.seek(4*3,1)

		filetype = ""

		if object['objectTypeID'] == 0:
			filetype = "items"
		elif object['objectTypeID'] == 1:
			filetype = "critters"
		elif object['objectTypeID'] == 2:
			filetype = "scenery"
		elif object['objectTypeID'] == 3:
			filetype = "walls"
		elif object['objectTypeID'] == 4:
			filetype = "tiles"
		elif object['objectTypeID'] == 5:
			filetype = "misc"
		else:
			sys.exit("".join(["unrecognized filetype: ",str(object['objectTypeID'])]))

		filename = "".join([urlprefix,"proto/",filetype,"/",lst_pro[filetype][object['objectID']-1].lower()])	# caching
		if filename in proCache:
			proto = proCache[filename]
		else:
			proCache[filename] = loader_pro.loadPRO(filename)
			proto = proCache[filename]
			

		if('subtypeID' in proto):
			object['subtypeID'] = proto['subtypeID']
		
		object['textID'] = proto['textID']
		
		if object['objectTypeID'] == 0:        #items
			if proto['subtypeID'] == 3:
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
				temp = struct.unpack('>4i', mapFile.read(4*4))
				object['exitMap'] = temp[0]
				object['exitPosition'] = temp[1]
				object['exitElevation'] = temp[2]
				object['exitOrientation'] = temp[3]
			else:
				mapFile.seek(4*4,1)

		if object['inventorySize'] > 0:
			object['inventory'] = []
			for w in range(object['inventorySize']):
				subobject_amount = struct.unpack('>i', mapFile.read(4))[0]
				subobject = loadMapObject()
				subobject['amount'] = subobject_amount
				object['inventory'].append(subobject)
				
		return object


	objects_total = struct.unpack('>i', mapFile.read(4))[0]


	for e in range(mapInfo['nElevations']):
		objects_elevation = struct.unpack('>I', mapFile.read(4))[0]

		objectInfo_elevation = []
		for j in range(objects_elevation):
			objectInfo_elevation.append(loadMapObject())
		
		mapInfo['objectInfo'].append(objectInfo_elevation)


	return mapInfo
