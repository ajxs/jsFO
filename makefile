.POSIX:
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

node_modules_dir := ./node_modules

dist_dir  := ./dist
jsfo_dist := ${dist_dir}/jsfo.js

src_dir   := ./src
src_files :=                                      \
	${src_dir}/core/assets.js                       \
	${src_dir}/core/browser.js                      \
	${src_dir}/core/debug.js                        \
	${src_dir}/core/GameState.js                    \
	${src_dir}/core/geometry.js                     \
	${src_dir}/core/global.js                       \
	${src_dir}/core/interface.js                    \
	${src_dir}/core/map_objects.js                  \
	${src_dir}/core/new_game.js                     \
	${src_dir}/gamestate/MainState.js               \
	${src_dir}/core/rendering.js                    \
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
	${src_dir}/gamestate/SkilldexState.js           \
	${src_dir}/core/main.js

babel       := ${node_modules_dir}/.bin/babel
babel_flags := --configFile ${src_dir}/babel.config.js

.PHONY: clean server

all: ${jsfo_dist}

${jsfo_dist}: ${node_modules_dir} ${src_files}
	${babel} ${src_files} ${babel_flags} --out-file ${jsfo_dist}

clean:
	rm -f ${jsfo_dist}

watch:
	while inotifywait -e close_write ${src_dir}/*; do make; done

server: ${jsfo_dist}
	python -m SimpleHTTPServer

${node_modules_dir}:
	npm install
