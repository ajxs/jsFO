def loadLST(lstFile, lstType = "none"):
	
	lstInfo = {}
	lstInfo["type"] = "lst"
	lstInfo["data"] = []

	if lstType == "none":
		for line in lstFile:
			lstInfo["data"].append(line.decode("utf-8").strip().lower())

	elif lstType == "critters":
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

			lstInfo["data"].append(critter)

	elif lstType == "scripts":
		for line in lstFile:
			line = line.decode("utf-8").strip().lower()
			if line[0] == ';':
				continue
			lstInfo["data"].append(line.split(';')[0].strip())


	return lstInfo
