#!/usr/local/bin/python

import json
import gzip
import sys
import loader_gamestate
import getopt
	
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
	
	loadData = loader_gamestate.loadGameState(loadVars)
	response = json.JSONEncoder().encode(loadData)
	#response = gzip.compress(response.encode())
	outfile.flush()
	#outfile.buffer.write(response)
	outfile.write(response)
	