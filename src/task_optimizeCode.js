/**
 * create by samantha on 2019-09-24
 */
'use strict';

const paragraphTypeMapping = {
  'bullet_list_open-ul': 'bullet_open',
  'bullet_list_close-ul': 'bullet_end',
  'ordered_list_open-ol': 'ordered_open',
  'ordered_list_close-ol': 'ordered_end',
};
const tagMapping = {
  'heading_open-h1': '1',
  'heading_open-h2': '2',
  'heading_open-h3': '3',
  'heading_open-h4': '4',
  'paragraph_open-p': 'p',
};
const decoratesMapping = {
  '**': 'bold',
  '*': 'italic',
  '~~': 'strikethrough',
  '^': 'superscript',
  '~': 'subscript'
};
function processUnderlineInStr(content) {
  let underlineStr = ']{.underline}';
  let paraObj = {};
  if (!content.includes(underlineStr)) {
    paraObj = { content: content, decorates: [] };
  } else {
    let tempContent = '', pos, length;
    for (let i = 0; i < content.length; i++) {
      if (content[i] === '[') {
        pos = i;
      } else if (content[i] + content.substr(i + 1, 12) === underlineStr) {
        length = i - pos - 1;
        i = i + underlineStr.length - 1;
      } else {
        tempContent += content[i];
      }
    }
    paraObj = { content: tempContent, decorates: [{ pos: pos, length: length, type: ['underline'] }] };
  }
  return paraObj;
}
function convertDecoratesInChildren(childrenArr, contentType) {
  let contentObj = { content: '', decorates: [] };
  if (!childrenArr || !childrenArr[0]) {
    return contentObj;
  }
  for (let i = 0; i < childrenArr.length; i++) {
    let type = childrenArr[i].type;
    let markup = childrenArr[i].markup;
    if (type === 'text') {
      let processContent = contentType === 'p' ? childrenArr[i].content : childrenArr[i].content.replace(/(.+)\s* \s*(\{#.+\})/g, '$1');
      contentObj.content += processContent;
    } else if (type === 'softbreak' && childrenArr[i].tag === 'br') {
      contentObj.content += ' ';
    } else if (type.endsWith('_open')) {
      contentObj.decorates.push({ pos: contentObj.content.length, type: [decoratesMapping[markup]] });
    } else if (type.endsWith('_close')) {
      contentObj.decorates.find(value => {
        if (value.type[0] === decoratesMapping[markup]) {
          value.length = contentObj.content.length - value.pos;
        }
      });
    }
  }
  let tempContentObj = processUnderlineInStr(contentObj.content);
  contentObj.content = tempContentObj.content;
  contentObj.decorates = contentObj.decorates.concat(tempContentObj.decorates);
  return contentObj;
}

function getSectionPosition(resultObj, level) {
  if (!level) return;
  level = parseInt(level);
  let sPosition = resultObj.chapters;
  for (let i = 2; i <= level; i++) {
    if (!sPosition[0]) {
      sPosition.push({ name: '', preParagraphs: [], sections: [] });
    }
    sPosition = sPosition[sPosition.length - 1].sections;
  }
  return sPosition;
}
function processParagraph(paragraphType, contentObj) {
  let paraObj = { paragraph: contentObj.content, decorates: contentObj.decorates, refs: [], footnotes: [], comment: null };
  if (paragraphType.endsWith('_open')) {
    let type = paragraphType.split('_')[0];
    paraObj = { list: { text: contentObj.content, type: type, decorates: contentObj.decorates, refs: [], footnotes: [] }, comment: null }
  }
  return paraObj;
}
exports.convertToPaperModel = function (originArr) {
  if (!originArr[0]) return;
  let resultObj = { preParagraphs: [{ preParagraphs: [] }], chapters: [] };
  let pPosition = resultObj.preParagraphs[0];
  let sPosition = resultObj.chapters;
  let sObj, paraObj, paragraphType;
  for (let i = 0; i < originArr.length - 1; i++) {
    let key = `${originArr[i].type}-${originArr[i].tag}`;
    paragraphTypeMapping[key] ? paragraphType = paragraphTypeMapping[key] : '';
    let contentType = tagMapping[key];
    if (originArr[i + 1].children === null) continue;
    let contentObj = convertDecoratesInChildren(originArr[i + 1].children, contentType);

    if (contentType === 'p') {
      paraObj = processParagraph(paragraphType, contentObj);
      pPosition.preParagraphs.push(paraObj);
    } else if (['1', '2', '3', '4'].indexOf(contentType) >= 0) {
      sObj = { name: contentObj.content, decorates: contentObj.decorates, preParagraphs: [], sections: [], comment: null };
      sPosition = getSectionPosition(resultObj, contentType) || sPosition;
      sPosition.push(sObj);
      pPosition = sPosition[sPosition.length - 1];
    }
  }
  return resultObj;
};
