'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const dir = path.resolve(__dirname, '../doc');

const txtPath = dir + '/testTxt.txt';

const subprocess = child_process.spawn(`cat ${txtPath}`, { stdio: [0, 'pipe', fs.openSync('err.out', 'w')] });
console.log(`subprcess.stdin: ${subprocess.stdio[0]}`);