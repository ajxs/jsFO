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

loadData = {}
		

	
def loadGameState(loadVars):

	master_dat_file = "".join([urlprefix,"master.dat"])
	master_dat = loader_dat.loadDAT(master_dat_file)

	critter_dat_file = "".join([urlprefix,"critter.dat"])
	critter_dat = loader_dat.loadDAT(critter_dat_file)
	
	color = loader_pal.loadPAL(loader_dat.getFile(master_dat_file, master_dat["fileEntries"]["color.pal"]))
	
	
	def loadFRM(datname, datfile, filename):		#these functions look hideous, I'll fix this one day
		if(filename not in datfile["fileEntries"]):
			return
	
		if(filename not in loadData):
			loadItem =  loader_frm.loadFRM(loader_dat.getFile(datname,datfile["fileEntries"][filename]),color)
			if(loadItem is not None):
				loadData[filename] = loadItem


	def loadCritter(frmindex):
		loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"aa.frm"]))
		loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ab.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ae.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ag.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ah.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ai.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"aj.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ak.frm"]))
		loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"al.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"an.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ao.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ap.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"aq.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ar.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"as.frm"]))
		loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"at.frm"]))


		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ba.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bb.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bc.frm"]))
		
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bd.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bd.fr0"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bd.fr1"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bd.fr2"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bd.fr3"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bd.fr4"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bd.fr5"]))			
		
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"be.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bf.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bg.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bh.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bi.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bj.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bk.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bl.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bm.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bn.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bo.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"bp.frm"]))
		
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ch.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"cj.frm"]))
		
		for r in range(9):	# D-M
			loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "a.frm"]))
			loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "b.frm"]))
			#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "c.frm"]))
			#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "d.frm"]))
			#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "e.frm"]))
		
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"df.frm"]))
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ef.frm"]))		
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"ff.frm"]))		
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"gf.frm"]))
		
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"dg.frm"]))	
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"eg.frm"]))		
		#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,"fg.frm"]))

		#for r in range(5):
			#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "h.frm"]))
			#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "i.frm"]))
			#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "j.frm"]))
			#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "k.frm"]))
			#loadFRM(critter_dat_file,critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "l.frm"]))	
	
	
	mapIndex = "".join( ['maps/', loadVars['map'] ] )
	loadData[mapIndex] = loader_map.loadMAP(mapIndex)


	lstFile = loader_dat.getFile(master_dat_file,master_dat["fileEntries"]["art/items/items.lst"])
	loadData["art/items/items.lst"] = {}
	loadData["art/items/items.lst"]["type"] = "lst"
	loadData["art/items/items.lst"]["data"] = []
	for line in lstFile:
		loadData["art/items/items.lst"]["data"].append(line.decode("utf-8").strip().lower())

	lstFile = loader_dat.getFile(master_dat_file,master_dat["fileEntries"]["art/walls/walls.lst"])
	loadData["art/walls/walls.lst"] = {}
	loadData["art/walls/walls.lst"]["type"] = "lst"
	loadData["art/walls/walls.lst"]["data"] = []
	for line in lstFile:
		loadData["art/walls/walls.lst"]["data"].append(line.decode("utf-8").strip().lower())

	lstFile = loader_dat.getFile(master_dat_file,master_dat["fileEntries"]["art/tiles/tiles.lst"])
	loadData["art/tiles/tiles.lst"] = {}
	loadData["art/tiles/tiles.lst"]["type"] = "lst"
	loadData["art/tiles/tiles.lst"]["data"] = []
	
	for line in lstFile:
		loadData["art/tiles/tiles.lst"]["data"].append(line.decode("utf-8").strip().lower())

	lstFile = loader_dat.getFile(master_dat_file,master_dat["fileEntries"]["art/scenery/scenery.lst"])	
	loadData["art/scenery/scenery.lst"] = {}
	loadData["art/scenery/scenery.lst"]["type"] = "lst"
	loadData["art/scenery/scenery.lst"]["data"] = []
	for line in lstFile:
		loadData["art/scenery/scenery.lst"]["data"].append(line.decode("utf-8").strip().lower())

	lstFile = loader_dat.getFile(master_dat_file,master_dat["fileEntries"]["art/misc/misc.lst"])	
	loadData["art/misc/misc.lst"] = {}
	loadData["art/misc/misc.lst"]["type"] = "lst"
	loadData["art/misc/misc.lst"]["data"] = []
	for line in lstFile:
		loadData["art/misc/misc.lst"]["data"].append(line.decode("utf-8").strip().lower())
		
	lstFile = loader_dat.getFile(critter_dat_file,critter_dat["fileEntries"]["art/critters/critters.lst"])	
	loadData["art/critters/critters.lst"] = {}
	loadData["art/critters/critters.lst"]["type"] = "lst"
	loadData["art/critters/critters.lst"]["data"] = []
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
		
		loadData["art/critters/critters.lst"]["data"].append(critter)
	
		
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
		
			loadFRM(master_dat_file,master_dat,filename)

			index = loadData[mapIndex]['tileInfo'][e]['roofTiles'][i]
			filename = "".join(["art/tiles/", loadData['art/tiles/tiles.lst']["data"][index] ]).lower()
		
			loadFRM(master_dat_file,master_dat,filename)
	

		for i in range(len(loadData[mapIndex]['objectInfo'][e])):
			index = loadData[mapIndex]['objectInfo'][e][i]['frmID']
			filetype = getFiletype(loadData[mapIndex]['objectInfo'][e][i]['frmTypeID'])
			
			if(filetype == "critters"):
				loadCritter(loadData['art/critters/critters.lst']["data"][index]['base'])
			else:	
				lstname = "".join(["art/",filetype,"/",filetype,".lst"])
				filename = "".join(["art/",filetype,"/", loadData[lstname]["data"][index] ]).lower()
				loadFRM(master_dat_file,master_dat,filename)
			
			for k in range(loadData[mapIndex]['objectInfo'][e][i]['inventorySize']):
				invfiletype = getFiletype(loadData[mapIndex]['objectInfo'][e][i]['inventory'][k]['frmTypeID'])
				invindex = loadData[mapIndex]['objectInfo'][e][i]['inventory'][k]['frmID']
				
				if(invfiletype == "critters"):
					loadCritter(loadData['art/critters/critters.lst']["data"][invindex]['base'])
				else:
					lstname = "".join(["art/",invfiletype,"/",invfiletype,".lst"])
					filename = "".join(["art/",invfiletype,"/", loadData[lstname]["data"][invindex] ]).lower()
					loadFRM(master_dat_file,master_dat,filename)
			
			
	return loadData
	
	
if __name__ == "__main__":
	loadVars = {}
	loadVars["map"] = None
	output = None
	
	try:
		opts, args = getopt.getopt(sys.argv[1:], "mo", ["map=", "output="])
	except getopt.GetoptError as err:
		print(err)
		sys.exit(2)
	for o, a in opts:	
		if o in "--map":
			loadVars["map"] = a
		elif o in ("--output"):
			output = a
	if(loadVars["map"] == None or output == None):
		print("Insufficient arguments, No map, or no output file provided.\nUsage: --map <mapfile> --output <outfile>")
		sys.exit(2)
	
	outfile = open(output, 'w')
	
	loadData = loadGameState(loadVars)
	response = json.JSONEncoder().encode(loadData)
	#response = gzip.compress(response.encode())
	outfile.flush()
	#outfile.buffer.write(response)
	outfile.write(response)


