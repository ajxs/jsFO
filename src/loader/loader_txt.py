import struct
import loader_pro
import loader_dat
import sys

urlprefix = "../data/"

def loadTxt_maps(txtFile):
	mapsTxt = []
	
	lines = txtFile.readlines()
	for i in range(len(lines)):
		line = lines[i].decode("utf-8").strip()
		if(line and line[0] == "["):	# get start of sequence
			mapInfo = {}
			mapInfo["type"] = "txt_maps"
			mapInfo["randomStartPoints"] = []
			
			innerlines = []
			k = 1
			innerline = lines[i].decode("utf-8").strip()
			while(innerline and (i+k < len(lines)) ):
				innerline = lines[i+k].decode("utf-8").strip()
				
				if(innerline.find(';') == -1):	#	remove comments
					innerline = innerline.split(";")[0]		#remove end of line comments
					varsplit = innerline.split("=")		# split line into property and value
					if(len(varsplit) > 1):		#deals with errors
						property = varsplit[0]
						value = varsplit[1]
						
						if(property == "lookup_name"):
							mapInfo["lookupName"] = value
						elif(property == "map_name"):
							mapInfo["mapName"] = value
						elif(property == "music"):
							mapInfo["music"] = value
						elif(property == "ambient_sfx"):
							mapInfo["ambientSfx"] = value
						elif(property == "saved"):
							mapInfo["saved"] = value							
						elif(property == "dead_bodies_age"):
							mapInfo["deadBodiesAge"] = value	
						elif(property == "can_rest_here"):
							mapInfo["canRestHere"] = value	
						elif("random_start_point_" in property):
							mapInfo["randomStartPoints"].append(value)		# split this later and make sub object	
				k+=1
				
				
			mapsTxt.append(mapInfo)

	return mapsTxt
	
if __name__ == "__main__":

	master_dat_file = "".join([urlprefix,"master.dat"])
	master_dat = loader_dat.loadDAT(master_dat_file)
	txtFile = loader_dat.getFile(master_dat_file,master_dat["fileEntries"]["data/maps.txt"])
	
	test = loadTxt_maps(txtFile)
	print(len(test))