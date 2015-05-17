import sys

import loader_map
import loader_frm
import loader_pal
import loader_fon
import loader_aaf

urlprefix = "../data/"	# use this to point to the directory with the undat'd Fallout2 data

color = loader_pal.loadPAL("".join([urlprefix,"color.pal"]))
loadData = {}

def loadFRM(filename):
	if(filename not in loadData):
		loadItem = loader_frm.loadFRM( "".join( [urlprefix, filename] ) ,color)	
		if(loadItem is not None):
			loadData[filename] = loadItem


def loadCritter(frmindex):
	loadFRM("".join(["art/critters/",frmindex,"aa.frm"]))
	loadFRM("".join(["art/critters/",frmindex,"ab.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"ae.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"ag.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"ah.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"ai.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"aj.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"ak.frm"]))
	loadFRM("".join(["art/critters/",frmindex,"al.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"an.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"ao.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"ap.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"aq.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"ar.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"as.frm"]))
	loadFRM("".join(["art/critters/",frmindex,"at.frm"]))


	#loadFRM("".join(["art/critters/",frmindex,"ba.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bb.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bc.frm"]))
	
	#loadFRM("".join(["art/critters/",frmindex,"bd.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bd.fr0"]))
	#loadFRM("".join(["art/critters/",frmindex,"bd.fr1"]))
	#loadFRM("".join(["art/critters/",frmindex,"bd.fr2"]))
	#loadFRM("".join(["art/critters/",frmindex,"bd.fr3"]))
	#loadFRM("".join(["art/critters/",frmindex,"bd.fr4"]))
	#loadFRM("".join(["art/critters/",frmindex,"bd.fr5"]))			
	
	#loadFRM("".join(["art/critters/",frmindex,"be.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bf.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bg.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bh.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bi.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bj.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bk.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bl.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bm.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bn.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bo.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"bp.frm"]))
	
	#loadFRM("".join(["art/critters/",frmindex,"ch.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"cj.frm"]))
	
	for r in range(9):	# D-M
		loadFRM("".join(["art/critters/",frmindex,chr(97 + 3 + r) + "a.frm"]))
		loadFRM("".join(["art/critters/",frmindex,chr(97 + 3 + r) + "b.frm"]))
		#loadFRM("".join(["art/critters/",frmindex,chr(97 + 3 + r) + "c.frm"]))
		#loadFRM("".join(["art/critters/",frmindex,chr(97 + 3 + r) + "d.frm"]))
		#loadFRM("".join(["art/critters/",frmindex,chr(97 + 3 + r) + "e.frm"]))

	
	#loadFRM("".join(["art/critters/",frmindex,"df.frm"]))
	#loadFRM("".join(["art/critters/",frmindex,"ef.frm"]))		
	#loadFRM("".join(["art/critters/",frmindex,"ff.frm"]))		
	#loadFRM("".join(["art/critters/",frmindex,"gf.frm"]))
	
	#loadFRM("".join(["art/critters/",frmindex,"dg.frm"]))	
	#loadFRM("".join(["art/critters/",frmindex,"eg.frm"]))		
	#loadFRM("".join(["art/critters/",frmindex,"fg.frm"]))

	#for r in range(5):
		#loadFRM("".join(["art/critters/",frmindex,chr(97 + 7 + r) + "h.frm"]))
		#loadFRM("".join(["art/critters/",frmindex,chr(97 + 7 + r) + "i.frm"]))
		#loadFRM("".join(["art/critters/",frmindex,chr(97 + 7 + r) + "j.frm"]))
		#loadFRM("".join(["art/critters/",frmindex,chr(97 + 7 + r) + "k.frm"]))
		#loadFRM("".join(["art/critters/",frmindex,chr(97 + 7 + r) + "l.frm"]))	

		

def loadGameState(loadVars):

	mapIndex = "".join( ['maps/', loadVars['map'] ] )
	loadData[mapIndex] = loader_map.loadMAP("".join([urlprefix,mapIndex]) )
	
	loadData["font0.aaf"] = loader_aaf.loadAAF("".join([urlprefix,"font0.aaf"]))	# fonts
	loadData["font1.aaf"] = loader_aaf.loadAAF("".join([urlprefix,"font1.aaf"]))	# fonts
	loadData["font2.aaf"] = loader_aaf.loadAAF("".join([urlprefix,"font2.aaf"]))	# fonts
	loadData["font3.aaf"] = loader_aaf.loadAAF("".join([urlprefix,"font3.aaf"]))	# fonts
	loadData["font4.aaf"] = loader_aaf.loadAAF("".join([urlprefix,"font4.aaf"]))	# fonts

	
	loadData["font0.fon"] = loader_fon.loadFON("".join([urlprefix,"font0.fon"]))
	loadData["font0.fon"] = loader_fon.loadFON("".join([urlprefix,"font1.fon"]))
	loadData["font0.fon"] = loader_fon.loadFON("".join([urlprefix,"font2.fon"]))
	loadData["font0.fon"] = loader_fon.loadFON("".join([urlprefix,"font3.fon"]))
	loadData["font0.fon"] = loader_fon.loadFON("".join([urlprefix,"font5.fon"]))

	
	msgFile = open("".join([urlprefix,"text/english/game/pro_crit.msg"]),"r")
	loadData["text/english/game/pro_crit.msg"] = {}
	loadData["text/english/game/pro_crit.msg"]["data"] = []
	for line in msgFile:
		loadData["text/english/game/pro_crit.msg"]["data"].append(line.strip().lower())	
	
	msgFile = open("".join([urlprefix,"text/english/game/pro_item.msg"]),"r")
	loadData["text/english/game/pro_item.msg"] = {}
	loadData["text/english/game/pro_item.msg"]["data"] = []
	for line in msgFile:
		loadData["text/english/game/pro_item.msg"]["data"].append(line.strip().lower())	
	
	msgFile = open("".join([urlprefix,"text/english/game/pro_scen.msg"]),"r")
	loadData["text/english/game/pro_scen.msg"] = {}
	loadData["text/english/game/pro_scen.msg"]["data"] = []
	for line in msgFile:
		loadData["text/english/game/pro_scen.msg"]["data"].append(line.strip().lower())	

	msgFile = open("".join([urlprefix,"text/english/game/pro_misc.msg"]),"r")
	loadData["text/english/game/pro_misc.msg"] = {}
	loadData["text/english/game/pro_misc.msg"]["data"] = []
	for line in msgFile:
		loadData["text/english/game/pro_misc.msg"]["data"].append(line.strip().lower())	

	msgFile = open("".join([urlprefix,"text/english/game/pro_wall.msg"]),"r")
	loadData["text/english/game/pro_wall.msg"] = {}
	loadData["text/english/game/pro_wall.msg"]["data"] = []
	for line in msgFile:
		loadData["text/english/game/pro_wall.msg"]["data"].append(line.strip().lower())	

	msgFile = open("".join([urlprefix,"text/english/game/pro_tile.msg"]),"r")
	loadData["text/english/game/pro_tile.msg"] = {}
	loadData["text/english/game/pro_tile.msg"]["data"] = []
	for line in msgFile:
		loadData["text/english/game/pro_tile.msg"]["data"].append(line.strip().lower())	


	
	lstFile = open("".join([urlprefix,"art/items/items.lst"]),"r")
	loadData["art/items/items.lst"] = []
	for line in lstFile:
		loadData["art/items/items.lst"].append(line.strip().lower())
		
	lstFile = open("".join([urlprefix,"art/walls/walls.lst"]),"r")
	loadData["art/walls/walls.lst"] = []
	for line in lstFile:
		loadData["art/walls/walls.lst"].append(line.strip().lower())

	lstFile = open("".join([urlprefix,"art/tiles/tiles.lst"]),"r")
	loadData["art/tiles/tiles.lst"] = []
	for line in lstFile:
		loadData["art/tiles/tiles.lst"].append(line.strip().lower())

	lstFile = open("".join([urlprefix,"art/scenery/scenery.lst"]),"r")		
	loadData["art/scenery/scenery.lst"] = []
	for line in lstFile:
		loadData["art/scenery/scenery.lst"].append(line.strip().lower())

	lstFile = open("".join([urlprefix,"art/misc/misc.lst"]),"r")
	loadData["art/misc/misc.lst"] = []
	for line in lstFile:
		loadData["art/misc/misc.lst"].append(line.strip().lower())
		
	lstFile = open("".join([urlprefix,"art/critters/critters.lst"]),"r")
	loadData["art/critters/critters.lst"] = []
	for line in lstFile:
		line = line.strip().lower()
		split = line.split(',')
		
		if(len(split) > 1):
			critter = {}
			critter['base'] = split[0]
			critter['ID1'] = split[1]
			if(len(split) > 2):
				critter['ID2'] = split[2]
		else:
			critter = line
		
		loadData["art/critters/critters.lst"].append(critter)

		
	loadFRM("art/intrface/msef000.frm")		#hex cursors
	loadFRM("art/intrface/msef003.frm")
	
	loadFRM("art/intrface/screast.frm")		#scroll cursors
	loadFRM("art/intrface/screx.frm")
	loadFRM("art/intrface/scrneast.frm")
	loadFRM("art/intrface/scrnex.frm")
	loadFRM("art/intrface/scrnorth.frm")
	
	loadFRM("art/intrface/scrnwest.frm")
	loadFRM("art/intrface/scrnwx.frm")
	loadFRM("art/intrface/scrseast.frm")
	loadFRM("art/intrface/scrnx.frm")
	
	loadFRM("art/intrface/scrsex.frm")
	loadFRM("art/intrface/scrsouth.frm")
	loadFRM("art/intrface/scrswest.frm")
	loadFRM("art/intrface/scrswx.frm")
	
	loadFRM("art/intrface/scrsx.frm")
	loadFRM("art/intrface/scrwest.frm")
	loadFRM("art/intrface/scrwx.frm")
	
	
	loadFRM("art/intrface/actarrow.frm")
	
	loadFRM("art/intrface/iface.frm")
	loadFRM("art/intrface/stdarrow.frm")

	
	loadFRM("art/intrface/usegetn.frm")
	loadFRM("art/intrface/usegeth.frm")
	loadFRM("art/intrface/talkn.frm")
	loadFRM("art/intrface/talkh.frm")
	loadFRM("art/intrface/skilln.frm")
	loadFRM("art/intrface/skillh.frm")
	loadFRM("art/intrface/rotaten.frm")
	loadFRM("art/intrface/rotateh.frm")
	loadFRM("art/intrface/pushn.frm")
	loadFRM("art/intrface/pushh.frm")
	loadFRM("art/intrface/lookn.frm")
	loadFRM("art/intrface/lookh.frm")
	loadFRM("art/intrface/invenn.frm")
	loadFRM("art/intrface/invenh.frm")
	loadFRM("art/intrface/canceln.frm")
	loadFRM("art/intrface/cancelh.frm")
		
	loadFRM("art/intrface/opbase.frm")
	loadFRM("art/intrface/opbtnoff.frm")
	loadFRM("art/intrface/opbtnon.frm")

		
	loadCritter("hmjmps")
	
		
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
			filename = "".join(["art/tiles/", loadData['art/tiles/tiles.lst'][index] ]).lower()
		
			loadFRM(filename)

			index = loadData[mapIndex]['tileInfo'][e]['roofTiles'][i]
			filename = "".join(["art/tiles/", loadData['art/tiles/tiles.lst'][index] ]).lower()
		
			loadFRM(filename)
	

		for i in range(len(loadData[mapIndex]['objectInfo'][e])):
			index = loadData[mapIndex]['objectInfo'][e][i]['frmID']
			filetype = getFiletype(loadData[mapIndex]['objectInfo'][e][i]['frmTypeID'])
			
			if(filetype == "critters"):
				loadCritter(loadData['art/critters/critters.lst'][index]['base'])
			else:	
				lstname = "".join(["art/",filetype,"/",filetype,".lst"])
				filename = "".join(["art/",filetype,"/", loadData[lstname][index] ]).lower()
				loadFRM(filename)
			
			for k in range(loadData[mapIndex]['objectInfo'][e][i]['inventorySize']):
				invfiletype = getFiletype(loadData[mapIndex]['objectInfo'][e][i]['inventory'][k]['frmTypeID'])
				invindex = loadData[mapIndex]['objectInfo'][e][i]['inventory'][k]['frmID']
				
				if(invfiletype == "critters"):
					loadCritter(loadData['art/critters/critters.lst'][invindex]['base'])
				else:
					lstname = "".join(["art/",invfiletype,"/",invfiletype,".lst"])
					filename = "".join(["art/",invfiletype,"/", loadData[lstname][invindex] ]).lower()
					loadFRM(filename)
			
			
	return loadData