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
const { convertToPaperModel } = require('./parseWordContent');
// const { convertToPaperModel } = require('./shao');

// const dir = '/Users/zhima02/Desktop/demo/parse-markdown/doc';
const dir = '/Users/zhima02/Desktop/开发规范/2019-09-24：Word导入测试文件/';
const savePictureDir = './data/wordImg';
const docxPath = 'WORD_1568794416235.docx';
const SUIBE_dsy = 'SUIBE_dengshiyu.docx';
const SUIBE_yy = 'SUIBE_yeye.docx';
const bug_WordImportTemplate = 'WordImportTemplate.docx';
const testEnglish = 'test_english.docx';
const SUIBE_dsy_fix = 'SUIBE_dsy_fix.docx';
const simple11 = 'simpleFix.docx';
const simpleMarkdown = 'simpleMarkdown.docx';
const specialWord = 'special_产品功能培训.docx';
const officeWord = 'officeWord.docx';
const referenceWord = '参考文献的建立.docx';
const wordImportWord = 'Word导入测试文档.docx';
const abstractWord = '摘要致谢等相关内容处理.docx';
const pre = '参考文献的建立pre.docx';
const huiyiguanli = '会议运营管理补充资料.docx';

const pandocCommand = `pandoc --extract-media ${savePictureDir} -f docx -t markdown-simple_tables`;

const fileName = dir + huiyiguanli;
let readStream = fs.createReadStream(fileName);
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