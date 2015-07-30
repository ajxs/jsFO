import sys
sys.path.insert(0, '/home/protected/py/lib/python3.4/site-packages/')

def loadMSG(msgFile):
	msgInfo = {}

	msgInfo['type'] = "msg"
	msgInfo['lines'] = []
	
	msgLines = []
	
	lastIndex = 0
	
	#@todo - can potentially optimize this to not need first array
	
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
		
		msgInfo['lines'].append(newLine);
				
	return msgInfo