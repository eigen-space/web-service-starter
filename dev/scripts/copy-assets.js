const { copy } = require('@eigenspace/helper-scripts');

const target = 'dist';

copy(['package.json', 'yarn.lock', 'src/assets'], target);