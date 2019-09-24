/**
 * create by samantha on 2019-09-17
 */
'use strict';
const fs = require('fs');

const mdPath = './doc/test.md';

fs.readFile(mdPath, 'utf8', (err, data) => {
  if (err) {
    console.log(`err: ${JSON.stringify(err)}`);
  }
  const totalData = data.split('\n\n');
  console.log(`yijuhua: ${JSON.stringify(totalData)}`);

  // const content = [];
  // for(let i = 0; i< totalData.length; i ++){
  //   if(i.endWith('===') || i.startWith('# ')){

  //     content.push({});
  //   }
  // }

});

let content = fs.readFileSync(mdPath, 'utf8');
content = content.split('\n\n');
console.log('content: ', content);