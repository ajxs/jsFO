import json
import gzip
import sys
import getopt

import loader_dat
import loader_frm
import loader_pal
import loader_fon
import loader_aaf
import loader_txt
import loader_msg
import loader_map
import loader_lst
import loader_int

urlprefix = "../../data/"	# use this to point to the directory with the undat'd Fallout2 data

master_dat = None
critter_dat = None
color = None
mapPreloadData = {}

class AssetContainer:
	'AssetContainer'

	def __init__(self, copy = None):
		self.assets = {}
		if(copy is not None):
			self.assets = copy.assets.copy()


	def printAssets(self):
		for item in self.assets:
			print(item)

	def serializeToJSON(self):
		return json.JSONEncoder().encode(self.assets)

	def getFile(self, path):
		return self.assets[path]

	def loadFile(self, datFile, path):

		extension = path.split('.')[1]		#crude switch
		fileItem = datFile.getFile(path)

		if(fileItem is not None):		# if able to retrieve file from DAT
			if extension == 'frm':
				assetItem = loader_frm.loadFRM(fileItem, color)
			elif extension == 'fon':
				assetItem = loader_fon.loadFON(fileItem)
			elif extension == 'aaf':
				assetItem = loader_aaf.loadAAF(fileItem)
			elif extension == 'int':
				assetItem = loader_int.loadINT(fileItem)
			elif extension == 'msg':
				assetItem = loader_msg.loadMSG(fileItem)
			elif extension == 'txt':
				if path == "data/maps.txt":
					assetItem = loader_txt.loadTxt_maps(fileItem)
				else:
					assetItem = None
			elif extension == 'pal':
				assetItem = loader_pal.loadPAL(fileItem)
			elif extension == 'map':
				assetItem = loader_map.loadMAP(fileItem, master_dat, mapPreloadData)		# @TODO: Minor coupling issue
			elif extension == 'lst':
				if path == "art/critters/critters.lst":
					assetItem = loader_lst.loadLST(fileItem, 'critters')
				elif path == "scripts/scripts.lst":
					assetItem = loader_lst.loadLST(fileItem, 'scripts')
				else:
					assetItem = loader_lst.loadLST(fileItem)

			self.assets[path] = assetItem

		else:
			print("file not found: " + path)
			return False



	def loadCritter(self, datFile, frmindex):
		self.loadFile(datFile, "".join(["art/critters/",frmindex,"aa.frm"]))
		self.loadFile(datFile, "".join(["art/critters/",frmindex,"ab.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ae.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ag.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ah.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ai.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"aj.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ak.frm"]))
		self.loadFile(datFile, "".join(["art/critters/",frmindex,"al.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"an.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ao.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ap.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"aq.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ar.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"as.frm"]))
		self.loadFile(datFile, "".join(["art/critters/",frmindex,"at.frm"]))


		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ba.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bb.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bc.frm"]))

		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bd.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bd.fr0"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bd.fr1"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bd.fr2"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bd.fr3"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bd.fr4"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bd.fr5"]))

		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"be.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bf.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bg.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bh.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bi.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bj.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bk.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bl.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bm.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bn.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bo.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"bp.frm"]))

		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ch.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"cj.frm"]))

		for r in range(9):	# D-M
			self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 3 + r) + "a.frm"]))
			self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 3 + r) + "b.frm"]))
			#self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 3 + r) + "c.frm"]))
			#self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 3 + r) + "d.frm"]))
			#self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 3 + r) + "e.frm"]))

		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"df.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ef.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"ff.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"gf.frm"]))

		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"dg.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"eg.frm"]))
		#self.loadFile(datFile, "".join(["art/critters/",frmindex,"fg.frm"]))

		#for r in range(5):
			#self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 7 + r) + "h.frm"]))
			#self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 7 + r) + "i.frm"]))
			#self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 7 + r) + "j.frm"]))
			#self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 7 + r) + "k.frm"]))
			#self.loadFile(datFile, "".join(["art/critters/",frmindex,chr(97 + 7 + r) + "l.frm"]))


def loadMain():

	loadData = AssetContainer()

	loadData.loadFile(master_dat, "data/maps.txt")

	loadData.loadFile(master_dat, "font0.aaf")		# fonts
	loadData.loadFile(master_dat, "font1.aaf")
	loadData.loadFile(master_dat, "font2.aaf")
	loadData.loadFile(master_dat, "font3.aaf")
	loadData.loadFile(master_dat, "font4.aaf")

	loadData.loadFile(master_dat, "font0.fon")
	loadData.loadFile(master_dat, "font1.fon")
	loadData.loadFile(master_dat, "font2.fon")
	loadData.loadFile(master_dat, "font3.fon")
	loadData.loadFile(master_dat, "font5.fon")

	# MSG files
	loadData.loadFile(master_dat, "text/english/game/proto.msg")		# game lines
	loadData.loadFile(master_dat, "text/english/game/skilldex.msg")

	# Look text
	loadData.loadFile(master_dat, "text/english/game/pro_crit.msg")
	loadData.loadFile(master_dat, "text/english/game/pro_item.msg")
	loadData.loadFile(master_dat, "text/english/game/pro_scen.msg")
	loadData.loadFile(master_dat, "text/english/game/pro_misc.msg")
	loadData.loadFile(master_dat, "text/english/game/pro_wall.msg")
	loadData.loadFile(master_dat, "text/english/game/pro_tile.msg")

	loadData.loadCritter(critter_dat, "hmjmps")	#player

	loadData.loadFile(master_dat,"art/intrface/msef000.frm")		#hex cursors
	loadData.loadFile(master_dat,"art/intrface/msef003.frm")

	loadData.loadFile(master_dat,"art/intrface/screast.frm")		#scroll cursors
	loadData.loadFile(master_dat,"art/intrface/screx.frm")
	loadData.loadFile(master_dat,"art/intrface/scrneast.frm")
	loadData.loadFile(master_dat,"art/intrface/scrnex.frm")
	loadData.loadFile(master_dat,"art/intrface/scrnorth.frm")

	loadData.loadFile(master_dat,"art/intrface/scrnwest.frm")
	loadData.loadFile(master_dat,"art/intrface/scrnwx.frm")
	loadData.loadFile(master_dat,"art/intrface/scrseast.frm")
	loadData.loadFile(master_dat,"art/intrface/scrnx.frm")

	loadData.loadFile(master_dat,"art/intrface/scrsex.frm")
	loadData.loadFile(master_dat,"art/intrface/scrsouth.frm")
	loadData.loadFile(master_dat,"art/intrface/scrswest.frm")
	loadData.loadFile(master_dat,"art/intrface/scrswx.frm")

	loadData.loadFile(master_dat,"art/intrface/scrsx.frm")
	loadData.loadFile(master_dat,"art/intrface/scrwest.frm")
	loadData.loadFile(master_dat,"art/intrface/scrwx.frm")


	loadData.loadFile(master_dat,"art/intrface/actarrow.frm")
	loadData.loadFile(master_dat,"art/intrface/stdarrow.frm")

	loadData.loadFile(master_dat,"art/intrface/iface.frm")

	loadData.loadFile(master_dat,"art/intrface/usegetn.frm")
	loadData.loadFile(master_dat,"art/intrface/usegeth.frm")
	loadData.loadFile(master_dat,"art/intrface/talkn.frm")
	loadData.loadFile(master_dat,"art/intrface/talkh.frm")
	loadData.loadFile(master_dat,"art/intrface/skilln.frm")
	loadData.loadFile(master_dat,"art/intrface/skillh.frm")
	loadData.loadFile(master_dat,"art/intrface/rotaten.frm")
	loadData.loadFile(master_dat,"art/intrface/rotateh.frm")
	loadData.loadFile(master_dat,"art/intrface/pushn.frm")
	loadData.loadFile(master_dat,"art/intrface/pushh.frm")
	loadData.loadFile(master_dat,"art/intrface/lookn.frm")
	loadData.loadFile(master_dat,"art/intrface/lookh.frm")
	loadData.loadFile(master_dat,"art/intrface/invenn.frm")
	loadData.loadFile(master_dat,"art/intrface/invenh.frm")
	loadData.loadFile(master_dat,"art/intrface/canceln.frm")
	loadData.loadFile(master_dat,"art/intrface/cancelh.frm")

	loadData.loadFile(master_dat,"art/intrface/opbase.frm")
	loadData.loadFile(master_dat,"art/intrface/opbtnoff.frm")
	loadData.loadFile(master_dat,"art/intrface/opbtnon.frm")

	loadData.loadFile(master_dat,"art/intrface/lilredup.frm")
	loadData.loadFile(master_dat,"art/intrface/lilreddn.frm")

	loadData.loadFile(master_dat,"art/intrface/bigreddn.frm")
	loadData.loadFile(master_dat,"art/intrface/bigredup.frm")

	loadData.loadFile(master_dat,"art/intrface/menuup.frm")
	loadData.loadFile(master_dat,"art/intrface/menudown.frm")

	loadData.loadFile(master_dat,"art/intrface/skldxbox.frm")
	loadData.loadFile(master_dat,"art/intrface/skldxoff.frm")
	loadData.loadFile(master_dat,"art/intrface/skldxon.frm")

	loadData.loadFile(master_dat,"art/intrface/invbox.frm")
	loadData.loadFile(master_dat,"art/intrface/invbutdn.frm")
	loadData.loadFile(master_dat,"art/intrface/invbutup.frm")
	loadData.loadFile(master_dat,"art/intrface/hand.frm")

	loadData.loadFile(master_dat,"art/intrface/pipup.frm")
	loadData.loadFile(master_dat,"art/intrface/pipdn.frm")

	loadData.loadFile(master_dat,"art/intrface/mapdn.frm")
	loadData.loadFile(master_dat,"art/intrface/mapup.frm")

	loadData.loadFile(master_dat,"art/intrface/optiup.frm")
	loadData.loadFile(master_dat,"art/intrface/optidn.frm")

	loadData.loadFile(master_dat,"art/intrface/edtredt.frm")
	loadData.loadFile(master_dat,"art/intrface/chaup.frm")
	loadData.loadFile(master_dat,"art/intrface/chadn.frm")
	loadData.loadFile(master_dat,"art/intrface/ageon.frm")
	loadData.loadFile(master_dat,"art/intrface/ageoff.frm")
	loadData.loadFile(master_dat,"art/intrface/nameoff.frm")
	loadData.loadFile(master_dat,"art/intrface/nameon.frm")
	loadData.loadFile(master_dat,"art/intrface/sexoff.frm")
	loadData.loadFile(master_dat,"art/intrface/sexon.frm")
	loadData.loadFile(master_dat,"art/intrface/slider.frm")

	loadData.loadFile(master_dat,"art/intrface/karmafdr.frm")
	loadData.loadFile(master_dat,"art/intrface/perksfdr.frm")
	loadData.loadFile(master_dat,"art/intrface/killsfdr.frm")

	loadData.loadFile(master_dat,"art/intrface/automap.frm")

	loadData.loadFile(master_dat,"art/intrface/alltalk.frm")
	loadData.loadFile(master_dat,"art/intrface/di_talk.frm")

	loadData.loadFile(master_dat,"art/intrface/pip.frm")

	loadData.loadFile(master_dat,"art/intrface/automap.frm")
	loadData.loadFile(master_dat,"art/intrface/autoup.frm")

	loadData.loadFile(master_dat,"art/skilldex/strength.frm")		#skilldex
	loadData.loadFile(master_dat,"art/skilldex/perceptn.frm")
	loadData.loadFile(master_dat,"art/skilldex/endur.frm")
	loadData.loadFile(master_dat,"art/skilldex/charisma.frm")
	loadData.loadFile(master_dat,"art/skilldex/intel.frm")
	loadData.loadFile(master_dat,"art/skilldex/agility.frm")
	loadData.loadFile(master_dat,"art/skilldex/luck.frm")
	loadData.loadFile(master_dat,"art/skilldex/level.frm")
	loadData.loadFile(master_dat,"art/skilldex/exper.frm")
	loadData.loadFile(master_dat,"art/skilldex/levelnxt.frm")
	loadData.loadFile(master_dat,"art/skilldex/hitpoint.frm")
	loadData.loadFile(master_dat,"art/skilldex/poisoned.frm")
	loadData.loadFile(master_dat,"art/skilldex/radiated.frm")
	loadData.loadFile(master_dat,"art/skilldex/eyedamag.frm")
	loadData.loadFile(master_dat,"art/skilldex/armright.frm")
	loadData.loadFile(master_dat,"art/skilldex/armleft.frm")
	loadData.loadFile(master_dat,"art/skilldex/legright.frm")
	loadData.loadFile(master_dat,"art/skilldex/legleft.frm")
	loadData.loadFile(master_dat,"art/skilldex/armorcls.frm")
	loadData.loadFile(master_dat,"art/skilldex/actionpt.frm")
	loadData.loadFile(master_dat,"art/skilldex/carryamt.frm")
	loadData.loadFile(master_dat,"art/skilldex/meleedam.frm")
	loadData.loadFile(master_dat,"art/skilldex/damresis.frm")
	loadData.loadFile(master_dat,"art/skilldex/poisnres.frm")
	loadData.loadFile(master_dat,"art/skilldex/sequence.frm")
	loadData.loadFile(master_dat,"art/skilldex/healrate.frm")
	loadData.loadFile(master_dat,"art/skilldex/critchnc.frm")
	loadData.loadFile(master_dat,"art/skilldex/skills.frm")
	loadData.loadFile(master_dat,"art/skilldex/gunsml.frm")
	loadData.loadFile(master_dat,"art/skilldex/gunbig.frm")
	loadData.loadFile(master_dat,"art/skilldex/energywp.frm")
	loadData.loadFile(master_dat,"art/skilldex/unarmed.frm")
	loadData.loadFile(master_dat,"art/skilldex/melee.frm")
	loadData.loadFile(master_dat,"art/skilldex/throwing.frm")
	loadData.loadFile(master_dat,"art/skilldex/firstaid.frm")
	loadData.loadFile(master_dat,"art/skilldex/doctor.frm")
	loadData.loadFile(master_dat,"art/skilldex/sneak.frm")
	loadData.loadFile(master_dat,"art/skilldex/lockpick.frm")
	loadData.loadFile(master_dat,"art/skilldex/steal.frm")
	loadData.loadFile(master_dat,"art/skilldex/traps.frm")
	loadData.loadFile(master_dat,"art/skilldex/science.frm")
	loadData.loadFile(master_dat,"art/skilldex/repair.frm")
	loadData.loadFile(master_dat,"art/skilldex/speech.frm")
	loadData.loadFile(master_dat,"art/skilldex/barter.frm")
	loadData.loadFile(master_dat,"art/skilldex/gambling.frm")
	loadData.loadFile(master_dat,"art/skilldex/outdoors.frm")
	loadData.loadFile(master_dat,"art/skilldex/kills.frm")
	loadData.loadFile(master_dat,"art/skilldex/karma.frm")
	loadData.loadFile(master_dat,"art/skilldex/rep.frm")
	loadData.loadFile(master_dat,"art/skilldex/repbrsrk.frm")
	loadData.loadFile(master_dat,"art/skilldex/repchild.frm")
	loadData.loadFile(master_dat,"art/skilldex/repgood.frm")
	loadData.loadFile(master_dat,"art/skilldex/alchohol.frm")
	loadData.loadFile(master_dat,"art/skilldex/addict.frm")
	loadData.loadFile(master_dat,"art/skilldex/traits.frm")
	loadData.loadFile(master_dat,"art/skilldex/fastmeta.frm")
	loadData.loadFile(master_dat,"art/skilldex/bruiser.frm")
	loadData.loadFile(master_dat,"art/skilldex/smlframe.frm")
	loadData.loadFile(master_dat,"art/skilldex/onehand.frm")
	loadData.loadFile(master_dat,"art/skilldex/finesse.frm")
	loadData.loadFile(master_dat,"art/skilldex/kamikaze.frm")
	loadData.loadFile(master_dat,"art/skilldex/heavyhnd.frm")
	loadData.loadFile(master_dat,"art/skilldex/fastshot.frm")
	loadData.loadFile(master_dat,"art/skilldex/bldmess.frm")
	loadData.loadFile(master_dat,"art/skilldex/jinxed.frm")
	loadData.loadFile(master_dat,"art/skilldex/goodnatr.frm")
	loadData.loadFile(master_dat,"art/skilldex/addict.frm")
	loadData.loadFile(master_dat,"art/skilldex/drugrest.frm")
	loadData.loadFile(master_dat,"art/skilldex/nightper.frm")
	loadData.loadFile(master_dat,"art/skilldex/skilled.frm")
	loadData.loadFile(master_dat,"art/skilldex/gifted.frm")
	loadData.loadFile(master_dat,"art/skilldex/perks.frm")
	loadData.loadFile(master_dat,"art/skilldex/awarenes.frm")
	loadData.loadFile(master_dat,"art/skilldex/hnd2hnd.frm")
	loadData.loadFile(master_dat,"art/skilldex/damage.frm")
	loadData.loadFile(master_dat,"art/skilldex/bonusmve.frm")
	loadData.loadFile(master_dat,"art/skilldex/bonusrng.frm")
	loadData.loadFile(master_dat,"art/skilldex/bonusrat.frm")
	loadData.loadFile(master_dat,"art/skilldex/earlyseq.frm")
	loadData.loadFile(master_dat,"art/skilldex/healrate.frm")
	loadData.loadFile(master_dat,"art/skilldex/morecrit.frm")
	loadData.loadFile(master_dat,"art/skilldex/nightviz.frm")
	loadData.loadFile(master_dat,"art/skilldex/presence.frm")
	loadData.loadFile(master_dat,"art/skilldex/radresis.frm")
	loadData.loadFile(master_dat,"art/skilldex/toughnes.frm")
	loadData.loadFile(master_dat,"art/skilldex/packanim.frm")
	loadData.loadFile(master_dat,"art/skilldex/sharpsht.frm")
	loadData.loadFile(master_dat,"art/skilldex/silntrun.frm")
	loadData.loadFile(master_dat,"art/skilldex/survival.frm")
	loadData.loadFile(master_dat,"art/skilldex/mstrtrad.frm")
	loadData.loadFile(master_dat,"art/skilldex/educated.frm")
	loadData.loadFile(master_dat,"art/skilldex/healer.frm")
	loadData.loadFile(master_dat,"art/skilldex/fortunfd.frm")
	loadData.loadFile(master_dat,"art/skilldex/betrcrit.frm")
	loadData.loadFile(master_dat,"art/skilldex/empathy.frm")
	loadData.loadFile(master_dat,"art/skilldex/slayer.frm")
	loadData.loadFile(master_dat,"art/skilldex/sniper.frm")
	loadData.loadFile(master_dat,"art/skilldex/silentd.frm")
	loadData.loadFile(master_dat,"art/skilldex/action.frm")
	loadData.loadFile(master_dat,"art/skilldex/mentalbk.frm")
	loadData.loadFile(master_dat,"art/skilldex/lifegivr.frm")
	loadData.loadFile(master_dat,"art/skilldex/dodger.frm")
	loadData.loadFile(master_dat,"art/skilldex/snakeeat.frm")
	loadData.loadFile(master_dat,"art/skilldex/mrfixit.frm")
	loadData.loadFile(master_dat,"art/skilldex/medic.frm")
	loadData.loadFile(master_dat,"art/skilldex/mtrthief.frm")
	loadData.loadFile(master_dat,"art/skilldex/speaker.frm")
	loadData.loadFile(master_dat,"art/skilldex/heaveho.frm")
	loadData.loadFile(master_dat,"art/skilldex/frienfoe.frm")
	loadData.loadFile(master_dat,"art/skilldex/pickpock.frm")
	loadData.loadFile(master_dat,"art/skilldex/ghost.frm")
	loadData.loadFile(master_dat,"art/skilldex/cultoper.frm")
	loadData.loadFile(master_dat,"art/skilldex/scroungr.frm")
	loadData.loadFile(master_dat,"art/skilldex/explorer.frm")
	loadData.loadFile(master_dat,"art/skilldex/flower.frm")
	loadData.loadFile(master_dat,"art/skilldex/pathfndr.frm")
	loadData.loadFile(master_dat,"art/skilldex/animalfr.frm")
	loadData.loadFile(master_dat,"art/skilldex/scout.frm")
	loadData.loadFile(master_dat,"art/skilldex/stranger.frm")
	loadData.loadFile(master_dat,"art/skilldex/ranger.frm")
	loadData.loadFile(master_dat,"art/skilldex/quikpock.frm")
	loadData.loadFile(master_dat,"art/skilldex/smoothtk.frm")
	loadData.loadFile(master_dat,"art/skilldex/swftlern.frm")
	loadData.loadFile(master_dat,"art/skilldex/tag.frm")
	loadData.loadFile(master_dat,"art/skilldex/mutate.frm")
	loadData.loadFile(master_dat,"art/skilldex/betray.frm")
	loadData.loadFile(master_dat,"art/skilldex/buffouts.frm")
	loadData.loadFile(master_dat,"art/skilldex/defender.frm")
	loadData.loadFile(master_dat,"art/skilldex/demon.frm")
	loadData.loadFile(master_dat,"art/skilldex/despair.frm")
	loadData.loadFile(master_dat,"art/skilldex/expertsx.frm")
	loadData.loadFile(master_dat,"art/skilldex/fighter.frm")
	loadData.loadFile(master_dat,"art/skilldex/gigolo.frm")
	loadData.loadFile(master_dat,"art/skilldex/graverob.frm")
	loadData.loadFile(master_dat,"art/skilldex/guardian.frm")
	loadData.loadFile(master_dat,"art/skilldex/idolized.frm")
	loadData.loadFile(master_dat,"art/skilldex/jetadict.frm")
	loadData.loadFile(master_dat,"art/skilldex/liked.frm")
	loadData.loadFile(master_dat,"art/skilldex/mademan.frm")
	loadData.loadFile(master_dat,"art/skilldex/married.frm")
	loadData.loadFile(master_dat,"art/skilldex/mentats.frm")
	loadData.loadFile(master_dat,"art/skilldex/neutral.frm")
	loadData.loadFile(master_dat,"art/skilldex/nukacola.frm")
	loadData.loadFile(master_dat,"art/skilldex/pornstar.frm")
	loadData.loadFile(master_dat,"art/skilldex/psycho.frm")
	loadData.loadFile(master_dat,"art/skilldex/radaway.frm")
	loadData.loadFile(master_dat,"art/skilldex/scourge.frm")
	loadData.loadFile(master_dat,"art/skilldex/shldhope.frm")
	loadData.loadFile(master_dat,"art/skilldex/slaver.frm")
	loadData.loadFile(master_dat,"art/skilldex/tragic.frm")
	loadData.loadFile(master_dat,"art/skilldex/villfied.frm")
	loadData.loadFile(master_dat,"art/skilldex/virgin.frm")
	loadData.loadFile(master_dat,"art/skilldex/wanderer.frm")
	loadData.loadFile(master_dat,"art/skilldex/hated.frm")
	loadData.loadFile(master_dat,"art/skilldex/generic.frm")
	loadData.loadFile(master_dat,"art/skilldex/adrnrush.frm")
	loadData.loadFile(master_dat,"art/skilldex/cautious.frm")
	loadData.loadFile(master_dat,"art/skilldex/drmlarmr.frm")
	loadData.loadFile(master_dat,"art/skilldex/geckoskn.frm")
	loadData.loadFile(master_dat,"art/skilldex/h2hevade.frm")
	loadData.loadFile(master_dat,"art/skilldex/harmless.frm")
	loadData.loadFile(master_dat,"art/skilldex/here&now.frm")
	loadData.loadFile(master_dat,"art/skilldex/karmabcn.frm")
	loadData.loadFile(master_dat,"art/skilldex/kmasutra.frm")
	loadData.loadFile(master_dat,"art/skilldex/litestep.frm")
	loadData.loadFile(master_dat,"art/skilldex/lvnganat.frm")
	loadData.loadFile(master_dat,"art/skilldex/magpers.frm")
	loadData.loadFile(master_dat,"art/skilldex/packrat.frm")
	loadData.loadFile(master_dat,"art/skilldex/phnxarmr.frm")
	loadData.loadFile(master_dat,"art/skilldex/pyromnac.frm")
	loadData.loadFile(master_dat,"art/skilldex/qwkrecov.frm")
	loadData.loadFile(master_dat,"art/skilldex/stonwall.frm")
	loadData.loadFile(master_dat,"art/skilldex/vcinnoc.frm")
	loadData.loadFile(master_dat,"art/skilldex/wepnhand.frm")
	loadData.loadFile(master_dat,"art/skilldex/divorced.frm")


	return loadData


def loadMap(mapPath):

	loadData = AssetContainer(mapPreloadData)
	loadData.loadFile(master_dat, mapPath)

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


	for e in range(loadData.getFile(mapPath)['nElevations']):		# load tile FRM
		for i in range(10000):
			index = loadData.getFile(mapPath)['tileInfo'][e]['floorTiles'][i]
			filename = "".join(["art/tiles/", loadData.getFile('art/tiles/tiles.lst')["data"][index] ])

			loadData.loadFile(master_dat,filename)

			index = loadData.getFile(mapPath)['tileInfo'][e]['roofTiles'][i]
			filename = "".join(["art/tiles/", loadData.getFile('art/tiles/tiles.lst')["data"][index] ])

			loadData.loadFile(master_dat,filename)


		for i in range(len(loadData.getFile(mapPath)['objectInfo'][e])):
			index = loadData.getFile(mapPath)['objectInfo'][e][i]['frmID']
			filetype = getFiletype(loadData.getFile(mapPath)['objectInfo'][e][i]['frmTypeID'])

			if(filetype == "critters"):
				loadData.loadCritter(critter_dat, loadData.getFile('art/critters/critters.lst')["data"][index]['base'])
			else:
				lstname = "".join(["art/",filetype,"/",filetype,".lst"])
				filename = "".join(["art/",filetype,"/", loadData.getFile(lstname)["data"][index] ])
				loadData.loadFile(master_dat,filename)

			for k in range(loadData.getFile(mapPath)['objectInfo'][e][i]['inventorySize']):
				invfiletype = getFiletype(loadData.getFile(mapPath)['objectInfo'][e][i]['inventory'][k]['frmTypeID'])
				invindex = loadData.getFile(mapPath)['objectInfo'][e][i]['inventory'][k]['frmID']

				if(invfiletype == "critters"):
					loadData.loadCritter(critter_dat, loadData.getFile('art/critters/critters.lst')["data"][invindex]['base'])
				else:
					lstname = "".join(["art/",invfiletype,"/",invfiletype,".lst"])
					filename = "".join(["art/",invfiletype,"/", loadData.getFile(lstname)["data"][invindex] ])
					loadData.loadFile(master_dat,filename)

			if(loadData.getFile(mapPath)['objectInfo'][e][i]['scriptID'] != -1):
				filename = "".join(["scripts/", loadData.getFile("scripts/scripts.lst")['data'][ loadData.getFile(mapPath)['objectInfo'][e][i]['scriptID'] ]])
				loadData.loadFile(master_dat, filename)


	for scriptType in loadData.getFile(mapPath)['scriptInfo']:
		for scriptID in loadData.getFile(mapPath)['scriptInfo'][scriptType]:
			filename = "".join(["scripts/", loadData.getFile("scripts/scripts.lst")['data'][scriptID]])
			loadData.loadFile(master_dat, filename)

	return loadData


if __name__ == "__main__":
	# Usage: --maps <mapfile [, ...]> [ --outputDir <output directory> ]

	print("jsFO Asset Converter\nInitializing")

	loadVars = {}
	loadVars["maps"] = None
	loadVars["outputDir"] = ""

	print("Loading DAT assets")
	master_dat = loader_dat.DATFile("".join([urlprefix,"master.dat"]))		#master_dat = loader_dat.loadDAT(master_dat_file)
	critter_dat = loader_dat.DATFile("".join([urlprefix,"critter.dat"]))

	color = loader_pal.loadPAL(master_dat.getFile("color.pal"))

	print("Loading main assets")
	loadData_main = loadMain()

	try:
		opts, args = getopt.getopt(sys.argv[1:], "mo", ["maps=", "outputDir="])
	except getopt.GetoptError as err:
		print(err)
		sys.exit(2)
	for o, a in opts:
		if o in "--maps":
			split = a.split(',')
			loadVars["maps"] = split
		elif o in ("--outputDir"):
			loadVars["outputDir"] = a

	print("".join(["Writing to ", loadVars["outputDir"], "main.jsf"]))
	outfile = open("".join([loadVars["outputDir"], "main.jsf"]), 'w')
	outfile.flush()
	outfile.write(loadData_main.serializeToJSON())


	if(loadVars["maps"]):
		print("Loading shared map assets")
		mapPreloadData = AssetContainer()
		mapPreloadData.loadFile(master_dat, "proto/items/items.lst")
		mapPreloadData.loadFile(master_dat, "proto/walls/walls.lst")
		mapPreloadData.loadFile(master_dat, "proto/tiles/tiles.lst")
		mapPreloadData.loadFile(master_dat, "proto/scenery/scenery.lst")
		mapPreloadData.loadFile(master_dat, "proto/critters/critters.lst")
		mapPreloadData.loadFile(master_dat, "proto/misc/misc.lst")

		mapPreloadData.loadFile(master_dat, "art/items/items.lst")
		mapPreloadData.loadFile(master_dat, "art/walls/walls.lst")
		mapPreloadData.loadFile(master_dat, "art/tiles/tiles.lst")
		mapPreloadData.loadFile(master_dat, "art/scenery/scenery.lst")
		mapPreloadData.loadFile(master_dat, "art/misc/misc.lst")
		mapPreloadData.loadFile(master_dat, "scripts/scripts.lst")
		mapPreloadData.loadFile(critter_dat, "art/critters/critters.lst")

		for map in loadVars["maps"]:
			print("".join(["Loading maps/", map]))
			mapPath = "".join( ['maps/', map ] )
			loadData_map = loadMap(mapPath)

			mapName = map.split('.')[0]
			print("".join(["Writing to ", loadVars["outputDir"], mapName, ".jsf"]))
			outfile = open("".join([loadVars["outputDir"], mapName, ".jsf"]), 'w')
			outfile.flush()
			outfile.write(loadData_map.serializeToJSON())


	print("Operation Completed")
