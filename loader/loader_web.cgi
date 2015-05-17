#!/usr/local/bin/python

import json
import gzip
import cgi
import loader_gamestate
import sys
#cgitb.enable()
	
if __name__ == "__main__":

	postData = cgi.FieldStorage()
	
	loadVars = {}
	loadVars["map"] = postData.getvalue("map")

	loadData = loader_gamestate.loadGameState(loadVars)
	
	response = json.JSONEncoder().encode(loadData)
	response_enc = gzip.compress(response.encode())	
	sys.stdout.write('Content-type: application/octet-stream\n')
	#sys.stdout.write("".join([ "Content-Length: ", str(sys.getsizeof(response_enc)),"\n"]))
	sys.stdout.write('Content-Encoding: gzip\n\n')
	sys.stdout.flush()
	sys.stdout.buffer.write(response_enc)
	