const newGame_createPlayer = () => {
	const newGame_player = new Actor();
	newGame_player.PID = 0;
	newGame_player.objectTypeID = 1;
	newGame_player.objectID = 0;

	newGame_player.name = "Anthony";
	newGame_player.age = 28;
	newGame_player.sex = "male";

	newGame_player.FID = 16777227;    // hmjmpsaa
	newGame_player.frmTypeID = 0;
	newGame_player.frmID = 0;

	return newGame_player;
};

const newGame = {
	map: "geckpwpl.map",
	//map: "mbclose.map",
	playerStartPos: "default",
	playerStartOrientation: "default",
	playerStartElevation: "default",

	player: newGame_createPlayer(),    // populate this on game init

};
