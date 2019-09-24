/**
 * create by liteng on 2019-09-19
 */
'use strict';

let resultArr = {
  preParagraph: [{ paragraph: '' }],
  chapter: [
    {
      name: 'H1 title', content: [],
      section: [{
        name: 'H2 title', content: [],
        subsection: [{
          name: 'H3 title', content: [],
          subsubsection: [{ name: 'H4 title', content: [] }]
        }]
      }]
    }
  ]
};
function addContent(originArr, tempObj) {
  if (tempObj.type === 'section') {
    originArr.chapter[originArr.chapter.length - 1].section.push({ name: tempObj.content, content: [] });
  }
  if (tempObj.type === 'chapter') {
    originArr.chapter.push({ name: tempObj.content, content: [] });
  }
  if (tempObj.type === 'paragraph') {
    let chapterObj =  originArr.chapter[originArr.chapter.length - 1];
  }
  return originArr;
}
let sectionObj = { type: 'section', content: 'section content' };
let paragraphObj = { type: 'paragraph', content: 'paragraph content' };
console.log(`result: ${JSON.stringify(addContent(resultArr, tempObj))}`);