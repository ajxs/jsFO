#!/usr/local/bin/python

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
	
	
urlprefix = "../data/"	# use this to point to the directory with the undat'd Fallout2 data

def loadMain():

	loadData = {}

	master_dat = loader_dat.DATFile("".join([urlprefix,"master.dat"]))		#master_dat = loader_dat.loadDAT(master_dat_file)
	critter_dat = loader_dat.DATFile("".join([urlprefix,"critter.dat"]))

	color = loader_pal.loadPAL(master_dat.getFile("color.pal"))
	loadData["data/maps.txt"] = loader_txt.loadTxt_maps(master_dat.getFile("data/maps.txt"))
				
	def loadFRM(dat, filename):
		if(filename not in loadData):
			file = dat.getFile(filename)
			if file is not None:
				loadData[filename] = loader_frm.loadFRM(file, color)
			else:
				return None
	
	
	def loadCritter(frmindex):
		loadFRM(critter_dat,"".join(["art/critters/",frmindex,"aa.frm"]))
		loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ab.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ae.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ag.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ah.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ai.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"aj.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ak.frm"]))
		loadFRM(critter_dat,"".join(["art/critters/",frmindex,"al.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"an.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ao.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ap.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"aq.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ar.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"as.frm"]))
		loadFRM(critter_dat,"".join(["art/critters/",frmindex,"at.frm"]))


		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ba.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bb.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bc.frm"]))
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr0"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr1"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr2"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr3"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr4"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bd.fr5"]))			
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"be.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bf.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bg.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bh.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bi.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bj.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bk.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bl.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bm.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bn.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bo.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"bp.frm"]))
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ch.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"cj.frm"]))
		
		for r in range(9):	# D-M
			loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "a.frm"]))
			loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "b.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "c.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "d.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 3 + r) + "e.frm"]))
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"df.frm"]))
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ef.frm"]))		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"ff.frm"]))		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"gf.frm"]))
		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"dg.frm"]))	
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"eg.frm"]))		
		#loadFRM(critter_dat,"".join(["art/critters/",frmindex,"fg.frm"]))

		#for r in range(5):
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "h.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "i.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "j.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "k.frm"]))
			#loadFRM(critter_dat,"".join(["art/critters/",frmindex,chr(97 + 7 + r) + "l.frm"]))		
	
	
	loadData["font0.aaf"] = loader_aaf.loadAAF(master_dat.getFile("font0.aaf"))	# fonts
	loadData["font1.aaf"] = loader_aaf.loadAAF(master_dat.getFile("font1.aaf"))	# fonts
	loadData["font2.aaf"] = loader_aaf.loadAAF(master_dat.getFile("font2.aaf"))	# fonts
	loadData["font3.aaf"] = loader_aaf.loadAAF(master_dat.getFile("font3.aaf"))	# fonts
	loadData["font4.aaf"] = loader_aaf.loadAAF(master_dat.getFile("font4.aaf"))	# fonts


	loadData["font0.fon"] = loader_fon.loadFON(master_dat.getFile("font0.fon"))	# fonts
	loadData["font0.fon"] = loader_fon.loadFON(master_dat.getFile("font1.fon"))	# fonts
	loadData["font0.fon"] = loader_fon.loadFON(master_dat.getFile("font2.fon"))	# fonts
	loadData["font0.fon"] = loader_fon.loadFON(master_dat.getFile("font3.fon"))	# fonts
	loadData["font0.fon"] = loader_fon.loadFON(master_dat.getFile("font5.fon"))	# fonts	

	# MSG files
	loadData["text/english/game/proto.msg"] = loader_msg.loadMSG(master_dat.getFile("text/english/game/proto.msg"))	# game lines
	loadData["text/english/game/skilldex.msg"] = loader_msg.loadMSG(master_dat.getFile("text/english/game/skilldex.msg"))	# game lines

	loadData["text/english/game/pro_crit.msg"] = loader_msg.loadMSG(master_dat.getFile("text/english/game/pro_crit.msg"))	# textfiles
	loadData["text/english/game/pro_item.msg"] = loader_msg.loadMSG(master_dat.getFile("text/english/game/pro_item.msg"))	# textfiles
	loadData["text/english/game/pro_scen.msg"] = loader_msg.loadMSG(master_dat.getFile("text/english/game/pro_scen.msg"))	# textfiles
	loadData["text/english/game/pro_misc.msg"] = loader_msg.loadMSG(master_dat.getFile("text/english/game/pro_misc.msg"))	# textfiles
	loadData["text/english/game/pro_wall.msg"] = loader_msg.loadMSG(master_dat.getFile("text/english/game/pro_wall.msg"))	# textfiles
	loadData["text/english/game/pro_tile.msg"] = loader_msg.loadMSG(master_dat.getFile("text/english/game/pro_tile.msg"))	# textfiles

	
	loadCritter("hmjmps")	#player
	
	loadFRM(master_dat,"art/intrface/msef000.frm")		#hex cursors
	loadFRM(master_dat,"art/intrface/msef003.frm")
	
	loadFRM(master_dat,"art/intrface/screast.frm")		#scroll cursors
	loadFRM(master_dat,"art/intrface/screx.frm")
	loadFRM(master_dat,"art/intrface/scrneast.frm")
	loadFRM(master_dat,"art/intrface/scrnex.frm")
	loadFRM(master_dat,"art/intrface/scrnorth.frm")
	
	loadFRM(master_dat,"art/intrface/scrnwest.frm")
	loadFRM(master_dat,"art/intrface/scrnwx.frm")
	loadFRM(master_dat,"art/intrface/scrseast.frm")
	loadFRM(master_dat,"art/intrface/scrnx.frm")
	
	loadFRM(master_dat,"art/intrface/scrsex.frm")
	loadFRM(master_dat,"art/intrface/scrsouth.frm")
	loadFRM(master_dat,"art/intrface/scrswest.frm")
	loadFRM(master_dat,"art/intrface/scrswx.frm")
	
	loadFRM(master_dat,"art/intrface/scrsx.frm")
	loadFRM(master_dat,"art/intrface/scrwest.frm")
	loadFRM(master_dat,"art/intrface/scrwx.frm")
	
	
	loadFRM(master_dat,"art/intrface/actarrow.frm")
	loadFRM(master_dat,"art/intrface/stdarrow.frm")
	
	loadFRM(master_dat,"art/intrface/iface.frm")
	
	loadFRM(master_dat,"art/intrface/usegetn.frm")
	loadFRM(master_dat,"art/intrface/usegeth.frm")
	loadFRM(master_dat,"art/intrface/talkn.frm")
	loadFRM(master_dat,"art/intrface/talkh.frm")
	loadFRM(master_dat,"art/intrface/skilln.frm")
	loadFRM(master_dat,"art/intrface/skillh.frm")
	loadFRM(master_dat,"art/intrface/rotaten.frm")
	loadFRM(master_dat,"art/intrface/rotateh.frm")
	loadFRM(master_dat,"art/intrface/pushn.frm")
	loadFRM(master_dat,"art/intrface/pushh.frm")
	loadFRM(master_dat,"art/intrface/lookn.frm")
	loadFRM(master_dat,"art/intrface/lookh.frm")
	loadFRM(master_dat,"art/intrface/invenn.frm")
	loadFRM(master_dat,"art/intrface/invenh.frm")
	loadFRM(master_dat,"art/intrface/canceln.frm")
	loadFRM(master_dat,"art/intrface/cancelh.frm")
		
	loadFRM(master_dat,"art/intrface/opbase.frm")
	loadFRM(master_dat,"art/intrface/opbtnoff.frm")
	loadFRM(master_dat,"art/intrface/opbtnon.frm")
	
	loadFRM(master_dat,"art/intrface/lilredup.frm")
	loadFRM(master_dat,"art/intrface/lilreddn.frm")
	
	loadFRM(master_dat,"art/intrface/bigreddn.frm")
	loadFRM(master_dat,"art/intrface/bigredup.frm")
	
	loadFRM(master_dat,"art/intrface/menuup.frm")
	loadFRM(master_dat,"art/intrface/menudown.frm")
	
	loadFRM(master_dat,"art/intrface/skldxbox.frm")
	loadFRM(master_dat,"art/intrface/skldxoff.frm")
	loadFRM(master_dat,"art/intrface/skldxon.frm")
	
	loadFRM(master_dat,"art/intrface/invbox.frm")
	loadFRM(master_dat,"art/intrface/invbutdn.frm")
	loadFRM(master_dat,"art/intrface/invbutup.frm")
	loadFRM(master_dat,"art/intrface/hand.frm")
	
	loadFRM(master_dat,"art/intrface/pipup.frm")
	loadFRM(master_dat,"art/intrface/pipdn.frm")
	
	loadFRM(master_dat,"art/intrface/mapdn.frm")
	loadFRM(master_dat,"art/intrface/mapup.frm")
	
	loadFRM(master_dat,"art/intrface/optiup.frm")
	loadFRM(master_dat,"art/intrface/optidn.frm")
	
	loadFRM(master_dat,"art/intrface/edtredt.frm")
	loadFRM(master_dat,"art/intrface/chaup.frm")
	loadFRM(master_dat,"art/intrface/chadn.frm")
	loadFRM(master_dat,"art/intrface/ageon.frm")
	loadFRM(master_dat,"art/intrface/ageoff.frm")
	loadFRM(master_dat,"art/intrface/nameoff.frm")
	loadFRM(master_dat,"art/intrface/nameon.frm")
	loadFRM(master_dat,"art/intrface/sexoff.frm")
	loadFRM(master_dat,"art/intrface/sexon.frm")
	loadFRM(master_dat,"art/intrface/slider.frm")
	
	loadFRM(master_dat,"art/intrface/karmafdr.frm")
	loadFRM(master_dat,"art/intrface/perksfdr.frm")
	loadFRM(master_dat,"art/intrface/killsfdr.frm")

	loadFRM(master_dat,"art/intrface/automap.frm")
	
	loadFRM(master_dat,"art/intrface/alltalk.frm")
	loadFRM(master_dat,"art/intrface/di_talk.frm")
	
	loadFRM(master_dat,"art/intrface/pip.frm")
	
	loadFRM(master_dat,"art/intrface/automap.frm")
	loadFRM(master_dat,"art/intrface/autoup.frm")
	
	loadFRM(master_dat,"art/skilldex/strength.frm")		#skilldex
	loadFRM(master_dat,"art/skilldex/perceptn.frm")
	loadFRM(master_dat,"art/skilldex/endur.frm")
	loadFRM(master_dat,"art/skilldex/charisma.frm")
	loadFRM(master_dat,"art/skilldex/intel.frm")
	loadFRM(master_dat,"art/skilldex/agility.frm")
	loadFRM(master_dat,"art/skilldex/luck.frm")
	loadFRM(master_dat,"art/skilldex/level.frm")
	loadFRM(master_dat,"art/skilldex/exper.frm")
	loadFRM(master_dat,"art/skilldex/levelnxt.frm")
	loadFRM(master_dat,"art/skilldex/hitpoint.frm")
	loadFRM(master_dat,"art/skilldex/poisoned.frm")
	loadFRM(master_dat,"art/skilldex/radiated.frm")
	loadFRM(master_dat,"art/skilldex/eyedamag.frm")
	loadFRM(master_dat,"art/skilldex/armright.frm")
	loadFRM(master_dat,"art/skilldex/armleft.frm")
	loadFRM(master_dat,"art/skilldex/legright.frm")
	loadFRM(master_dat,"art/skilldex/legleft.frm")
	loadFRM(master_dat,"art/skilldex/armorcls.frm")
	loadFRM(master_dat,"art/skilldex/actionpt.frm")
	loadFRM(master_dat,"art/skilldex/carryamt.frm")
	loadFRM(master_dat,"art/skilldex/meleedam.frm")
	loadFRM(master_dat,"art/skilldex/damresis.frm")
	loadFRM(master_dat,"art/skilldex/poisnres.frm")
	loadFRM(master_dat,"art/skilldex/sequence.frm")
	loadFRM(master_dat,"art/skilldex/healrate.frm")
	loadFRM(master_dat,"art/skilldex/critchnc.frm")
	loadFRM(master_dat,"art/skilldex/skills.frm")
	loadFRM(master_dat,"art/skilldex/gunsml.frm")
	loadFRM(master_dat,"art/skilldex/gunbig.frm")
	loadFRM(master_dat,"art/skilldex/energywp.frm")
	loadFRM(master_dat,"art/skilldex/unarmed.frm")
	loadFRM(master_dat,"art/skilldex/melee.frm")
	loadFRM(master_dat,"art/skilldex/throwing.frm")
	loadFRM(master_dat,"art/skilldex/firstaid.frm")
	loadFRM(master_dat,"art/skilldex/doctor.frm")
	loadFRM(master_dat,"art/skilldex/sneak.frm")
	loadFRM(master_dat,"art/skilldex/lockpick.frm")
	loadFRM(master_dat,"art/skilldex/steal.frm")
	loadFRM(master_dat,"art/skilldex/traps.frm")
	loadFRM(master_dat,"art/skilldex/science.frm")
	loadFRM(master_dat,"art/skilldex/repair.frm")
	loadFRM(master_dat,"art/skilldex/speech.frm")
	loadFRM(master_dat,"art/skilldex/barter.frm")
	loadFRM(master_dat,"art/skilldex/gambling.frm")
	loadFRM(master_dat,"art/skilldex/outdoors.frm")
	loadFRM(master_dat,"art/skilldex/kills.frm")
	loadFRM(master_dat,"art/skilldex/karma.frm")
	loadFRM(master_dat,"art/skilldex/rep.frm")
	loadFRM(master_dat,"art/skilldex/repbrsrk.frm")
	loadFRM(master_dat,"art/skilldex/repchild.frm")
	loadFRM(master_dat,"art/skilldex/repgood.frm")
	loadFRM(master_dat,"art/skilldex/alchohol.frm")
	loadFRM(master_dat,"art/skilldex/addict.frm")
	loadFRM(master_dat,"art/skilldex/traits.frm")
	loadFRM(master_dat,"art/skilldex/fastmeta.frm")
	loadFRM(master_dat,"art/skilldex/bruiser.frm")
	loadFRM(master_dat,"art/skilldex/smlframe.frm")
	loadFRM(master_dat,"art/skilldex/onehand.frm")
	loadFRM(master_dat,"art/skilldex/finesse.frm")
	loadFRM(master_dat,"art/skilldex/kamikaze.frm")
	loadFRM(master_dat,"art/skilldex/heavyhnd.frm")
	loadFRM(master_dat,"art/skilldex/fastshot.frm")
	loadFRM(master_dat,"art/skilldex/bldmess.frm")
	loadFRM(master_dat,"art/skilldex/jinxed.frm")
	loadFRM(master_dat,"art/skilldex/goodnatr.frm")
	loadFRM(master_dat,"art/skilldex/addict.frm")
	loadFRM(master_dat,"art/skilldex/drugrest.frm")
	loadFRM(master_dat,"art/skilldex/nightper.frm")
	loadFRM(master_dat,"art/skilldex/skilled.frm")
	loadFRM(master_dat,"art/skilldex/gifted.frm")
	loadFRM(master_dat,"art/skilldex/perks.frm")
	loadFRM(master_dat,"art/skilldex/awarenes.frm")
	loadFRM(master_dat,"art/skilldex/hnd2hnd.frm")
	loadFRM(master_dat,"art/skilldex/damage.frm")
	loadFRM(master_dat,"art/skilldex/bonusmve.frm")
	loadFRM(master_dat,"art/skilldex/bonusrng.frm")
	loadFRM(master_dat,"art/skilldex/bonusrat.frm")
	loadFRM(master_dat,"art/skilldex/earlyseq.frm")
	loadFRM(master_dat,"art/skilldex/healrate.frm")
	loadFRM(master_dat,"art/skilldex/morecrit.frm")
	loadFRM(master_dat,"art/skilldex/nightviz.frm")
	loadFRM(master_dat,"art/skilldex/presence.frm")
	loadFRM(master_dat,"art/skilldex/radresis.frm")
	loadFRM(master_dat,"art/skilldex/toughnes.frm")
	loadFRM(master_dat,"art/skilldex/packanim.frm")
	loadFRM(master_dat,"art/skilldex/sharpsht.frm")
	loadFRM(master_dat,"art/skilldex/silntrun.frm")
	loadFRM(master_dat,"art/skilldex/survival.frm")
	loadFRM(master_dat,"art/skilldex/mstrtrad.frm")
	loadFRM(master_dat,"art/skilldex/educated.frm")
	loadFRM(master_dat,"art/skilldex/healer.frm")
	loadFRM(master_dat,"art/skilldex/fortunfd.frm")
	loadFRM(master_dat,"art/skilldex/betrcrit.frm")
	loadFRM(master_dat,"art/skilldex/empathy.frm")
	loadFRM(master_dat,"art/skilldex/slayer.frm")
	loadFRM(master_dat,"art/skilldex/sniper.frm")
	loadFRM(master_dat,"art/skilldex/silentd.frm")
	loadFRM(master_dat,"art/skilldex/action.frm")
	loadFRM(master_dat,"art/skilldex/mentalbk.frm")
	loadFRM(master_dat,"art/skilldex/lifegivr.frm")
	loadFRM(master_dat,"art/skilldex/dodger.frm")
	loadFRM(master_dat,"art/skilldex/snakeeat.frm")
	loadFRM(master_dat,"art/skilldex/mrfixit.frm")
	loadFRM(master_dat,"art/skilldex/medic.frm")
	loadFRM(master_dat,"art/skilldex/mtrthief.frm")
	loadFRM(master_dat,"art/skilldex/speaker.frm")
	loadFRM(master_dat,"art/skilldex/heaveho.frm")
	loadFRM(master_dat,"art/skilldex/frienfoe.frm")
	loadFRM(master_dat,"art/skilldex/pickpock.frm")
	loadFRM(master_dat,"art/skilldex/ghost.frm")
	loadFRM(master_dat,"art/skilldex/cultoper.frm")
	loadFRM(master_dat,"art/skilldex/scroungr.frm")
	loadFRM(master_dat,"art/skilldex/explorer.frm")
	loadFRM(master_dat,"art/skilldex/flower.frm")
	loadFRM(master_dat,"art/skilldex/pathfndr.frm")
	loadFRM(master_dat,"art/skilldex/animalfr.frm")
	loadFRM(master_dat,"art/skilldex/scout.frm")
	loadFRM(master_dat,"art/skilldex/stranger.frm")
	loadFRM(master_dat,"art/skilldex/ranger.frm")
	loadFRM(master_dat,"art/skilldex/quikpock.frm")
	loadFRM(master_dat,"art/skilldex/smoothtk.frm")
	loadFRM(master_dat,"art/skilldex/swftlern.frm")
	loadFRM(master_dat,"art/skilldex/tag.frm")
	loadFRM(master_dat,"art/skilldex/mutate.frm")
	loadFRM(master_dat,"art/skilldex/betray.frm")
	loadFRM(master_dat,"art/skilldex/buffouts.frm")
	loadFRM(master_dat,"art/skilldex/defender.frm")
	loadFRM(master_dat,"art/skilldex/demon.frm")
	loadFRM(master_dat,"art/skilldex/despair.frm")
	loadFRM(master_dat,"art/skilldex/expertsx.frm")
	loadFRM(master_dat,"art/skilldex/fighter.frm")
	loadFRM(master_dat,"art/skilldex/gigolo.frm")
	loadFRM(master_dat,"art/skilldex/graverob.frm")
	loadFRM(master_dat,"art/skilldex/guardian.frm")
	loadFRM(master_dat,"art/skilldex/idolized.frm")
	loadFRM(master_dat,"art/skilldex/jetadict.frm")
	loadFRM(master_dat,"art/skilldex/liked.frm")
	loadFRM(master_dat,"art/skilldex/mademan.frm")
	loadFRM(master_dat,"art/skilldex/married.frm")
	loadFRM(master_dat,"art/skilldex/mentats.frm")
	loadFRM(master_dat,"art/skilldex/neutral.frm")
	loadFRM(master_dat,"art/skilldex/nukacola.frm")
	loadFRM(master_dat,"art/skilldex/pornstar.frm")
	loadFRM(master_dat,"art/skilldex/psycho.frm")
	loadFRM(master_dat,"art/skilldex/radaway.frm")
	loadFRM(master_dat,"art/skilldex/scourge.frm")
	loadFRM(master_dat,"art/skilldex/shldhope.frm")
	loadFRM(master_dat,"art/skilldex/slaver.frm")
	loadFRM(master_dat,"art/skilldex/tragic.frm")
	loadFRM(master_dat,"art/skilldex/villfied.frm")
	loadFRM(master_dat,"art/skilldex/virgin.frm")
	loadFRM(master_dat,"art/skilldex/wanderer.frm")
	loadFRM(master_dat,"art/skilldex/hated.frm")
	loadFRM(master_dat,"art/skilldex/generic.frm")
	loadFRM(master_dat,"art/skilldex/adrnrush.frm")
	loadFRM(master_dat,"art/skilldex/cautious.frm")
	loadFRM(master_dat,"art/skilldex/drmlarmr.frm")
	loadFRM(master_dat,"art/skilldex/geckoskn.frm")
	loadFRM(master_dat,"art/skilldex/h2hevade.frm")
	loadFRM(master_dat,"art/skilldex/harmless.frm")
	loadFRM(master_dat,"art/skilldex/here&now.frm")
	loadFRM(master_dat,"art/skilldex/karmabcn.frm")
	loadFRM(master_dat,"art/skilldex/kmasutra.frm")
	loadFRM(master_dat,"art/skilldex/litestep.frm")
	loadFRM(master_dat,"art/skilldex/lvnganat.frm")
	loadFRM(master_dat,"art/skilldex/magpers.frm")
	loadFRM(master_dat,"art/skilldex/packrat.frm")
	loadFRM(master_dat,"art/skilldex/phnxarmr.frm")
	loadFRM(master_dat,"art/skilldex/pyromnac.frm")
	loadFRM(master_dat,"art/skilldex/qwkrecov.frm")
	loadFRM(master_dat,"art/skilldex/stonwall.frm")
	loadFRM(master_dat,"art/skilldex/vcinnoc.frm")
	loadFRM(master_dat,"art/skilldex/wepnhand.frm")
	loadFRM(master_dat,"art/skilldex/divorced.frm")
	
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
		if o in ("--output"):
			output = a
	if(output == None):
		print("Insufficient arguments, no output file provided.\nUsage: --output <outfile>")
		sys.exit(2)
	
	outfile = open(output, 'w')
	
	loadData = loadMain()
	response = json.JSONEncoder().encode(loadData)
	#response = gzip.compress(response.encode())
	outfile.flush()
	#outfile.buffer.write(response)
	outfile.write(response)
	