/**
 * create by samantha on 2019-09-18
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const dir = path.resolve(__dirname, '../doc');
const testMdPath = dir + 'testMD.md';
const fileName = dir + '/testFileMD.md';
const txtPath = dir + '/testTxt.txt';
console.log(`dir: ${dir}`);
let pandoc = ' | pandoc -f docx -t ${fileName}';

let readStream = fs.createReadStream(txtPath);
// console.log(`readStream: ${JSON.stringify(readStream)}`);
// process.stdin.pipe(readStream)
let cp = exec(`echo`, (err, stdout) => {
  console.log(`err: ${err}\n`);
  console.log(`stdout: ${stdout}`);
});

readStream.pipe(cp.stdin);