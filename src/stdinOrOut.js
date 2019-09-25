/**
 * create by samantha on 2019-09-18
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const markdownIt = require('markdown-it')()
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'));

// const { convertToPaperModel } = require('./task_convert');
const { convertToPaperModel } = require('./task_optimizeCode');
// const { convertToPaperModel } = require('./shao');

const dir = path.resolve(__dirname, '../doc');
const docxPath = dir + '/WORD_1568794416235.docx';
const SUIBE_dsy = dir + '/SUIBE_dengshiyu.docx';
const SUIBE_yy = dir + '/SUIBE_yeye.docx';
const bug_WordImportTemplate = dir + '/WordImportTemplate.docx';
const testEnglish = dir + '/test_english.docx';
const SUIBE_dsy_fix = dir + '/SUIBE_dsy_fix.docx';
const simple11 = dir + '/simpleFix.docx';
const simpleMarkdown = dir + '/simpleMarkdown.docx';

let readStream = fs.createReadStream(simple11);
let subprocess = exec(`pandoc -f docx -t markdown`, (err, stdout) => {
  // console.log(`err: ${err}\n`);
  // console.log(`stdout:\n ${stdout}`);
  const mdResult = markdownIt.parse(stdout, {});
  // console.log(`${JSON.stringify(mdResult)}`);
  const convertResult = convertToPaperModel(mdResult);
  console.log(`${JSON.stringify(convertResult)}`);
});

readStream.pipe(subprocess.stdin);