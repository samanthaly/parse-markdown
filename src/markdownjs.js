/**
 * create by samantha on 2019-09-18
 */
'use strict';

const fs = require('fs')
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

const { exec } = require('child_process');
const path = require('path');
const dir = path.resolve(__dirname, '../doc');
const docxPath = dir + '/test.docx';
const TAG_MAPPING = {
  'h1': 1,
  'h2': 2,
  'h3': 3,
  'h4': 4
};

function processMdResult(mdResult) {
  let processResult = [];
  let headerLevel = 0;
  let everyResult = {};
  for (let i = 0; i < mdResult.length; i++) {
    if (mdResult[i].type === 'heading_open') {
      headerLevel = TAG_MAPPING[mdResult[i].tag];
      processResult.push();
      // console.log(`header: ${headerLevel}: ${mdResult[i + 1].content}`);
    }
    processResult = processResult.concat(everyResult);
    if (mdResult[i].type === 'paragraph_open') {
      processResult[processResult.length - 1].content = mdResult[i + 1].content;
      // console.log(`headerLevel: ${headerLevel}, paragraph: ${mdResult[i + 1].content}`);
    }
  }
  console.log(`processResult: ${JSON.stringify(processResult)}`);
  return processResult;
}

let readStream = fs.createReadStream(docxPath);
let subprocess = exec(`pandoc -f docx -t markdown`, (err, stdout) => {
  console.log(`err: ${err}\n`);
  const mdResult = md.parse(stdout, {}); // 此为输入
  // console.log(`result: ${JSON.stringify(mdResult)}`);
  // 输出： content: { preParagraphs: [], chapters: [{name: '', preParagraphs: [{paragraph: '', refs: [], decorates: [], footnotes: []}]]}
  // console.log(`content: ${JSON.stringify(mdResult[1].content)}`);
  processMdResult(mdResult);
});

readStream.pipe(subprocess.stdin);