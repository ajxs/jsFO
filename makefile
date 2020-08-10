.POSIX:
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

babel       := ./node_modules/.bin/babel
babel_flags := --configFile ./src/babel.config.js

dist_dir  := ./dist
jsfo_dist := ${dist_dir}/jsfo.js

src_dir   := ./src
src_files :=                                      \
	${src_dir}/core/assets.js                       \
	${src_dir}/core/browser.js                      \
	${src_dir}/core/debug.js                      \
	${src_dir}/core/GameState.js                    \
	${src_dir}/core/geometry.js                     \
	${src_dir}/core/global.js                       \
	${src_dir}/core/interface.js                    \
	${src_dir}/core/map-objects.js                   \
	${src_dir}/core/new-game.js                      \
	${src_dir}/gamestate/MainState.js               \
	${src_dir}/core/renderer.js                     \
	${src_dir}/core/vm.js                           \
	${src_dir}/gamestate/CharacterScreenState.js    \
	${src_dir}/gamestate/ContextMenuState.js        \
	${src_dir}/gamestate/IngameMenuState.js         \
	${src_dir}/gamestate/InventoryState.js          \
	${src_dir}/gamestate/LoadState.js               \
	${src_dir}/gamestate/MainLoadState.js           \
	${src_dir}/gamestate/MainMenuState.js           \
	${src_dir}/gamestate/MapscreenState.js          \
	${src_dir}/gamestate/PipboyState.js             \
	${src_dir}/gamestate/SkilldexState.js \
	${src_dir}/core/main.js

.PHONY: clean emu

all: ${jsfo_dist}

${jsfo_dist}: ${src_files}
	${babel} ${src_files} ${babel_flags} --out-file ${jsfo_dist}

clean:
	rm -f ${jsfo_dist}

watch:
	while inotifywait -e close_write ${src_dir}/*; do make; done

emu:
	Python -m SimpleHttpServer
