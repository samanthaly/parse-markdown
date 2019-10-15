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
const { convertToPaperModel, replaceTextByReplaceMapping } = require('./parseWordContent');
// const { convertToPaperModel } = require('./shao');

// const dir = '/Users/zhima02/Desktop/demo/parse-markdown/doc';
const dir = '/Users/zhima02/Desktop/开发规范/2019-09-24：Word导入测试文件/';
const savePictureDir = './data/wordImg';
const docxPath = 'WORD_1568794416235';
const SUIBE_dsy = 'SUIBE_dengshiyu';
const SUIBE_yy = 'SUIBE_yeye';
const bug_WordImportTemplate = 'WordImportTemplate';
const testEnglish = 'test_english';
const SUIBE_dsy_fix = 'SUIBE_dsy_fix';
const simple11 = 'simpleFix';
const simpleMarkdown = 'simpleMarkdown';
const specialWord = 'special_产品功能培训';
const officeWord = 'officeWord';
const referenceWord = '参考文献的建立';
const wordImportWord = 'Word导入测试文档';
const abstractWord = '摘要致谢等相关内容处理';
const pre = '参考文献的建立pre';
const huiyiguanli = '会议运营管理补充资料';
const backend = 'miaoWrite新人手册-后端架构图';

const pandocCommand = `pandoc --extract-media ${savePictureDir} -f docx -t markdown-simple_tables`;

const fileName = `${dir}${wordImportWord}.docx`;
let readStream = fs.createReadStream(fileName);
let subprocess = exec(pandocCommand, (err, stdout) => {
  // let subprocess = exec(`pandoc --extract-media ./wordImg -f docx -o markdown.md`, (err, stdout) => {
  // console.log(`err: ${err}\n`);
  stdout = replaceTextByReplaceMapping(stdout);
  console.log(`stdout:\n ${stdout}`);
  const mdResult = markdownIt.parse(stdout, {});
  // console.log(`${JSON.stringify(mdResult)}`);
  convertToPaperModel(mdResult).then(result => {
    // console.log(`${JSON.stringify(result)}`);
  });
});

readStream.pipe(subprocess.stdin);