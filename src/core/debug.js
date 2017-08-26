'use strict';

const DEBUG_FLAGS = {
	drawSpecialHexes: false,
};

const debugOutput = (...args) => {
  console.log.apply(this, args);
};
