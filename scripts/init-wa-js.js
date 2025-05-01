import * as fs from 'node:fs';

const isExistsNodeModules = fs.existsSync('./node_modules/@wppconnect/wa-js/dist/wppconnect-wa.js');

if (!isExistsNodeModules) {
  throw new Error('File wppconnect-wa.js not found');
}

try {
  fs.copyFileSync('./node_modules/@wppconnect/wa-js/dist/wppconnect-wa.js', './public/wppconnect__wa.js');
} catch (error) {
  console.error(error);
}
