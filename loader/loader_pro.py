import struct

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
	else:
		return "none"	# can't find type


def loadPRO(proFile):
	proInfo = {}
	proInfo["type"] = "pro"

	temp = struct.unpack('>3i3I',proFile.read(6*4))	#common header
	proInfo['PID'] = temp[0]
	proInfo['textID'] = temp[1]
	proInfo['FID'] = temp[2]
	
	proInfo['lightDistance'] = temp[3]
	proInfo['lightIntensity'] = temp[4]
	
	proInfo['flags'] = temp[5]
	proInfo['typeID'] = (proInfo['PID'] & 0x0F000000) >> 24	
	
	filetype = getFiletype(proInfo['typeID'])
	if(filetype == "items"):
	
		proInfo['flagsExt'] = repr(proFile.read(3))
		proInfo['attackMode'] = ord(proFile.read(1))
		
		temp = struct.unpack('>7IB',proFile.read(7*4+1))
		proInfo['scriptID'] = temp[0]
		proInfo['subtypeID'] = temp[1]
		proInfo['materialID'] = temp[2]
		proInfo['size'] = temp[3]
		proInfo['weight'] = temp[4]
		proInfo['cost'] = temp[5]
		proInfo['invFID'] = temp[6]
		proInfo['sound'] = temp[7]
		
		if proInfo['subtypeID'] == 0:	#armor
			proInfo['armorClass'] = struct.unpack('>i',proFile.read(4))[0]
			
			temp = struct.unpack('>7i',proFile.read(7*4))	#Damage Resistance
			temp = struct.unpack('>7i',proFile.read(7*4))	#Damage Threshold
			
			temp = struct.unpack('>3i',proFile.read(3*4))
			proInfo['perk'] = temp[0]
			proInfo['armorMaleFID'] = temp[1]
			proInfo['armorFemaleFID'] = temp[2]
		
		elif proInfo['subtypeID'] == 1:	#containers
			temp = struct.unpack('>2i',proFile.read(2*4))
			proInfo['maxSize'] = temp[0]
			proInfo['openFlags'] = temp[1]			
			
		elif proInfo['subtypeID'] == 2:	#drugs
		
			temp = struct.unpack('>3i',proFile.read(3*4))	# stats
			temp = struct.unpack('>3i',proFile.read(3*4))	# instant effect
			temp = struct.unpack('>3i',proFile.read(3*4))	# first delayed effect
			temp = struct.unpack('>3i',proFile.read(3*4))	# second delayed effect
			
			temp = struct.unpack('>3i',proFile.read(3*4))	# other
			
		elif proInfo['subtypeID'] == 3:	#weapons
			temp = struct.unpack('>11Ii4IB',proFile.read((16*4)+1))
			
			proInfo['animCode'] = temp[0]
			proInfo['weaponDamageMin'] = temp[1]
			proInfo['weaponDamageMax'] = temp[2]
			proInfo['weaponDamageType'] = temp[3]
			proInfo['weaponRangePrimary'] = temp[4]
			proInfo['weaponRangeSecondary'] = temp[5]
			proInfo['projPID'] = temp[6]
			proInfo['weaponMinimumStrength'] = temp[7]
			proInfo['weaponActionCostPrimary'] = temp[8]
			proInfo['weaponActionCostSecondary'] = temp[9]
			proInfo['criticalfail'] = temp[10]
			
			proInfo['perk'] = temp[11]
			
			proInfo['weaponBurstRounds'] = temp[12]
			proInfo['weaponAmmoType'] = temp[13]
			proInfo['weaponAmmoPID'] = temp[14]
			proInfo['weaponAmmoCapacity'] = temp[15]
			proInfo['soundID'] = temp[16]
			
		elif proInfo['subtypeID'] == 4:	#ammo
			temp = struct.unpack('>6I',proFile.read(6*4))
			
		elif proInfo['subtypeID'] == 5:	#misc
			temp = struct.unpack('>3I',proFile.read(3*4))
			
		elif proInfo['subtypeID'] == 6:	#keys
			temp = struct.unpack('>I',proFile.read(4))

	elif(filetype == "critters"):
		temp = struct.unpack('>6I',proFile.read(6*4))
		
		proInfo['flagsExt'] = temp[0]
		proInfo['scriptID'] = temp[1]
		proInfo['headFID'] = temp[2]
		proInfo['aiPacket'] = temp[3]
		proInfo['teamNumber'] = temp[4]
		proInfo['critterFlags'] = temp[5]
		
		temp = struct.unpack('>17I',proFile.read(17*4))		#base stats
		temp = struct.unpack('>16I',proFile.read(16*4))		#DR/DT
		
		temp = struct.unpack('>2I',proFile.read(2*4))
		proInfo['age'] = temp[0]
		proInfo['sex'] = temp[1]
		
		temp = struct.unpack('>17I',proFile.read(17*4))		#bonus stats
		temp = struct.unpack('>16I',proFile.read(16*4))		#bonus DR/DT		
		temp = struct.unpack('>2I',proFile.read(2*4))	# bonus age/sex
		
		temp = struct.unpack('>18I',proFile.read(18*4))		#skills
		
		temp = struct.unpack('>4I',proFile.read(4*4))
		proInfo['bodyType'] = temp[0]
		proInfo['expVal'] = temp[1]
		proInfo['killType'] = temp[2]
		proInfo['damageType'] = temp[3]
		
	elif(filetype == "scenery"):
		temp = struct.unpack('>2H3IB',proFile.read(4+(3*4)+1))
		proInfo['wallLightTypeFlags'] = temp[0]
		proInfo['actionFlags'] = temp[1]
		proInfo['scriptInfo'] = temp[2]
		proInfo['subtypeID'] = temp[3]
		proInfo['materialID'] = temp[4]
		proInfo['soundID'] = temp[5]
		
		if proInfo['subtypeID'] == 0:	#door
			temp = struct.unpack('>2I',proFile.read(8))
			
		if proInfo['subtypeID'] == 1:	#stairs
			temp = struct.unpack('>2I',proFile.read(8))

		if proInfo['subtypeID'] == 2:	#elevator
			temp = struct.unpack('>2I',proFile.read(8))
			
		if proInfo['subtypeID'] == 3:	#ladder bottom
			temp = struct.unpack('>I',proFile.read(4))

		if proInfo['subtypeID'] == 4:	#ladder top
			temp = struct.unpack('>I',proFile.read(4))

		if proInfo['subtypeID'] == 5:	#generic
			temp = struct.unpack('>I',proFile.read(4))
		
	elif(filetype == "walls"):
		temp = struct.unpack('>2H2I',proFile.read(12))

	elif(filetype == "tiles"):
		temp = struct.unpack('>I',proFile.read(4))		
			
	elif(filetype == "misc"):
		temp = struct.unpack('>I',proFile.read(4))				
			
			
	return proInfo
	