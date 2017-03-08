BABEL=./node_modules/.bin/babel
BABEL_PRESET=--presets latest

JSFO=./dist/jsfo.js

JSFO_CORE_DIR=./src/core/
JSFO_CORE_FILES=assets.js browser.js GameState.js geometry.js global.js interface.js main.js mapObjects.js newGame.js renderer.js vm.js
JSFO_CORE_SRC=$(foreach d, $(JSFO_CORE_FILES), $(JSFO_CORE_DIR)$d)

GAMESTATE_DIR=./src/gamestate/
GAMESTATE_FILES=CharacterScreenState.js ContextMenuState.js IngameMenuState.js InventoryState.js LoadState.js MainLoadState.js MainMenuState.js MainState.js MapscreenState.js PipboyState.js SkilldexState.js
GAMESTATE_SRC=$(foreach d, $(GAMESTATE_FILES), $(GAMESTATE_DIR)$d)

.PHONY: all clean

all: $(JSFO)

$(JSFO): $(JSFO_CORE_SRC) $(GAMESTATE_DIR)
	$(BABEL) $(JSFO_CORE_SRC) $(GAMESTATE_SRC) $(BABEL_PRESET) --out-file $(JSFO)

clean:
	rm -rf ./dist/*.js;

watch:
	while inotifywait -e close_write ${JSFO_CORE_DIR}* ${GAMESTATE_DIR}; do make; done
