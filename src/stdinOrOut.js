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

// const dir = '/Users/zhima02/Desktop/demo/parse-markdown/doc';
const dir = '/Users/zhima02/Desktop/开发规范/2019-09-24：Word导入测试文件';
const savePictureDir = './data/wordImg';
const docxPath = dir + '/WORD_1568794416235.docx';
const SUIBE_dsy = dir + '/SUIBE_dengshiyu.docx';
const SUIBE_yy = dir + '/SUIBE_yeye.docx';
const bug_WordImportTemplate = dir + '/WordImportTemplate.docx';
const testEnglish = dir + '/test_english.docx';
const SUIBE_dsy_fix = dir + '/SUIBE_dsy_fix.docx';
const simple11 = dir + '/simpleFix.docx';
const simpleMarkdown = dir + '/simpleMarkdown.docx';
const specialWord = dir + '/special_产品功能培训.docx';
const officeWord = dir + '/officeWord.docx';
const referenceWord = dir + '/参考文献的建立.docx';

const pandocCommand = `pandoc --extract-media ${savePictureDir} -f docx -t markdown-simple_tables`;

let readStream = fs.createReadStream(referenceWord);
let subprocess = exec(pandocCommand, (err, stdout) => {
  // let subprocess = exec(`pandoc --extract-media ./wordImg -f docx -o markdown.md`, (err, stdout) => {
  // console.log(`err: ${err}\n`);
  // console.log(`stdout:\n ${stdout}`);
  const mdResult = markdownIt.parse(stdout, {});
  // console.log(`${JSON.stringify(mdResult)}`);
  convertToPaperModel(mdResult).then(result => {
    console.log(`${JSON.stringify(result)}`);
  });
});

readStream.pipe(subprocess.stdin);