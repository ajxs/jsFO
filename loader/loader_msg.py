def loadMSG(msgFile):
	msgInfo = {}

	msgInfo['type'] = "msg"
	msgInfo['data'] = {}


	msgLines = []	#@todo - can potentially optimize this to not need first array
	lastIndex = 0

	lines = msgFile.readlines()
	for i in range(len(lines)):
		line = lines[i].decode("utf-8","ignore").strip()

		if(line):
			if(line[0] == "#"):
				continue
			elif(line[0] == "{"):
				msgLines.append(line)
				lastIndex = len(msgLines)-1
			else:
				msgLines[lastIndex] += " " + line

	for i in range(len(msgLines)):
		split = msgLines[i].split("{");

		newLine = {}

		newLine['id'] = int(split[1].replace("}",""));
		newLine['sound'] = split[2].replace("}","");
		newLine['text'] = split[3].replace("}","");

		msgInfo['data'][newLine['id']] = newLine;		#set index to id for easy referencing later.

	return msgInfo
