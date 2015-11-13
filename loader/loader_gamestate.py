import sys

import loader_dat
import loader_map
import loader_frm
import loader_pal
import loader_fon
import loader_aaf

import json
import gzip
import getopt

urlprefix = "../data/"	# use this to point to the directory with the undat'd Fallout2 data

	
def loadGameState(loadVars):

	master_dat = loader_dat.DATFile("".join([urlprefix,"master.dat"]))		#master_dat = loader_dat.loadDAT(master_dat_file)
	critter_dat = loader_dat.DATFile("".join([urlprefix,"critter.dat"]))

	color = loader_pal.loadPAL(master_dat.getFile("color.pal"))
				
	def loadFRM(dat, filename):
		if(filename not in loadData):
			file = dat.getFile(filename)
			if file is not None:
				loadData[filename] = loader_frm.loadFRM(file, color)
			else:
				return None
	
	
	def loadCritter(frmindex):
		loadFRM(critter_dat,"".join(["art/critters/",frmindex,"aa.frm"]))
		loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ab.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ae.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ag.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ah.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ai.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"aj.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ak.frm"]))
		loadFRM(critter_dat,"".join(["art/critters/",frmindex,"al.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"an.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ao.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ap.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"aq.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ar.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"as.frm"]))
		loadFRM(critter_dat,"".join(["art/critters/",frmindex,"at.frm"]))


		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ba.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bb.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bc.frm"]))
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr0"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr1"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr2"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr3"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr4"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr5"]))			
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"be.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bf.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bg.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bh.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bi.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bj.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bk.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bl.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bm.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bn.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bo.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bp.frm"]))
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ch.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"cj.frm"]))
		
		for r in range(9):	# D-M
			loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "a.frm"]))
			loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "b.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "c.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "d.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "e.frm"]))
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"df.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ef.frm"]))		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ff.frm"]))		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"gf.frm"]))
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"dg.frm"]))	
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"eg.frm"]))		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"fg.frm"]))

		#for r in range(5):
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "h.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "i.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "j.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "k.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "l.frm"]))		
	
	
	preloadData = {}
	preloadData["proto/items/items.lst"] = []
	preloadData["proto/walls/walls.lst"] = []
	preloadData["proto/tiles/tiles.lst"] = []
	preloadData["proto/scenery/scenery.lst"] = []
	preloadData["proto/critters/critters.lst"] = []
	preloadData["proto/misc/misc.lst"] = []
	
	lstFile = master_dat.getFile("proto/items/items.lst")
	for line in lstFile:
		preloadData["proto/items/items.lst"].append(line.decode("utf-8").strip())

	lstFile = lstFile = master_dat.getFile("proto/walls/walls.lst")
	for line in lstFile:
		preloadData["proto/walls/walls.lst"].append(line.decode("utf-8").strip())

	lstFile = lstFile = master_dat.getFile("proto/tiles/tiles.lst")
	for line in lstFile:
		preloadData["proto/tiles/tiles.lst"].append(line.decode("utf-8").strip())

	lstFile = lstFile = master_dat.getFile("proto/scenery/scenery.lst")
	for line in lstFile:
		preloadData["proto/scenery/scenery.lst"].append(line.decode("utf-8").strip())

	lstFile = lstFile = master_dat.getFile("proto/critters/critters.lst")
	for line in lstFile:
		preloadData["proto/critters/critters.lst"].append(line.decode("utf-8").strip())

	lstFile = lstFile = master_dat.getFile("proto/misc/misc.lst")
	for line in lstFile:
		preloadData["proto/misc/misc.lst"].append(line.decode("utf-8").strip())
		
	
	lstFile = master_dat.getFile("art/items/items.lst")
	preloadData["art/items/items.lst"] = {}
	preloadData["art/items/items.lst"]["type"] = "lst"
	preloadData["art/items/items.lst"]["data"] = []
	for line in lstFile:
		preloadData["art/items/items.lst"]["data"].append(line.decode("utf-8").strip().lower())

	lstFile = master_dat.getFile("art/walls/walls.lst")
	preloadData["art/walls/walls.lst"] = {}
	preloadData["art/walls/walls.lst"]["type"] = "lst"
	preloadData["art/walls/walls.lst"]["data"] = []
	for line in lstFile:
		preloadData["art/walls/walls.lst"]["data"].append(line.decode("utf-8").strip().lower())

	lstFile = master_dat.getFile("art/tiles/tiles.lst")
	preloadData["art/tiles/tiles.lst"] = {}
	preloadData["art/tiles/tiles.lst"]["type"] = "lst"
	preloadData["art/tiles/tiles.lst"]["data"] = []
	
	for line in lstFile:
		preloadData["art/tiles/tiles.lst"]["data"].append(line.decode("utf-8").strip().lower())

	lstFile = master_dat.getFile("art/scenery/scenery.lst")	
	preloadData["art/scenery/scenery.lst"] = {}
	preloadData["art/scenery/scenery.lst"]["type"] = "lst"
	preloadData["art/scenery/scenery.lst"]["data"] = []
	for line in lstFile:
		preloadData["art/scenery/scenery.lst"]["data"].append(line.decode("utf-8").strip().lower())

	lstFile = master_dat.getFile("art/misc/misc.lst")	
	preloadData["art/misc/misc.lst"] = {}
	preloadData["art/misc/misc.lst"]["type"] = "lst"
	preloadData["art/misc/misc.lst"]["data"] = []
	for line in lstFile:
		preloadData["art/misc/misc.lst"]["data"].append(line.decode("utf-8").strip().lower())
		
	lstFile = critter_dat.getFile("art/critters/critters.lst")	
	preloadData["art/critters/critters.lst"] = {}
	preloadData["art/critters/critters.lst"]["type"] = "lst"
	preloadData["art/critters/critters.lst"]["data"] = []
	for line in lstFile:
		line = line.decode("utf-8").strip().lower()
		split = line.split(',')
		
		if(len(split) > 1):
			critter = {}
			critter['base'] = split[0]
			critter['ID1'] = split[1]
			if(len(split) > 2):
				critter['ID2'] = split[2]
		else:
			critter = line
		
		preloadData["art/critters/critters.lst"]["data"].append(critter)
	

	
	for map in loadVars["maps"]:
	
		loadData = preloadData.copy()
	
		mapIndex = "".join( ['maps/', map ] )
		mapFile = master_dat.getFile(mapIndex)
		
		loadData[mapIndex] = loader_map.loadMAP(mapFile, master_dat, loadData)
		
			
		def getFiletype(typeID):
			if(typeID == 0):
				return "items"
			elif(typeID == 1):
				return "critters"
			elif(typeID == 2):
				return "scenery"
			elif(typeID == 3):
				return "walls"
			elif(typeID == 4):
				return "tiles"
			elif(typeID == 5):
				return "misc"
		
		
		for e in range(loadData[mapIndex]['nElevations']):		# load tile FRM
			for i in range(10000):
				index = loadData[mapIndex]['tileInfo'][e]['floorTiles'][i]
				filename = "".join(["art/tiles/", loadData['art/tiles/tiles.lst']["data"][index] ]).lower()
			
				loadFRM(master_dat,filename)

				index = loadData[mapIndex]['tileInfo'][e]['roofTiles'][i]
				filename = "".join(["art/tiles/", loadData['art/tiles/tiles.lst']["data"][index] ]).lower()
			
				loadFRM(master_dat,filename)
		

			for i in range(len(loadData[mapIndex]['objectInfo'][e])):
				index = loadData[mapIndex]['objectInfo'][e][i]['frmID']
				filetype = getFiletype(loadData[mapIndex]['objectInfo'][e][i]['frmTypeID'])
				
				if(filetype == "critters"):
					loadCritter(loadData['art/critters/critters.lst']["data"][index]['base'])
				else:	
					lstname = "".join(["art/",filetype,"/",filetype,".lst"])
					filename = "".join(["art/",filetype,"/", loadData[lstname]["data"][index] ]).lower()
					loadFRM(master_dat,filename)
				
				for k in range(loadData[mapIndex]['objectInfo'][e][i]['inventorySize']):
					invfiletype = getFiletype(loadData[mapIndex]['objectInfo'][e][i]['inventory'][k]['frmTypeID'])
					invindex = loadData[mapIndex]['objectInfo'][e][i]['inventory'][k]['frmID']
					
					if(invfiletype == "critters"):
						loadCritter(loadData['art/critters/critters.lst']["data"][invindex]['base'])
					else:
						lstname = "".join(["art/",invfiletype,"/",invfiletype,".lst"])
						filename = "".join(["art/",invfiletype,"/", loadData[lstname]["data"][invindex] ]).lower()
						loadFRM(master_dat,filename)
		
		
		mapName = map.split('.')
		outputName = "".join([loadVars["outputDir"], mapName[0], ".jsf"])
		outfile = open(outputName, 'w')
		
		print("".join(["Writing ", map, " to ", outputName, "\n"]))
		
		response = json.JSONEncoder().encode(loadData)
		outfile.flush()
		outfile.write(response)
	
	
if __name__ == "__main__":
	loadVars = {}
	loadVars["maps"] = None
	output = None
	
	try:
		opts, args = getopt.getopt(sys.argv[1:], "mo", ["map=", "output="])
	except getopt.GetoptError as err:
		print(err)
		sys.exit(2)
	for o, a in opts:	
		if o in "--map":
			split = a.split(',')
			loadVars["maps"] = split
		elif o in ("--output"):
			loadVars["outputDir"] = a
	if(loadVars["maps"] == None):
		print("Insufficient arguments, No maps provided.\nUsage: --map <mapfile [, ...]> [ --output <output directory> ]")
		sys.exit(2)
	
	loadGameState(loadVars)