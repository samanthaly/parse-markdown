/**
 * create by samantha on 2019-09-21
 */
'use strict';

const tagMapping = {
  'heading_open-h1': 'chapters',
  'heading_open-h2': 'sections',
  'heading_open-h3': 'subsections',
  'heading_open-h4': 'subsubsections',
  'paragraph_open-p': 'preParagraphs',
};
const decoratesMapping = {
  '**': 'bold',
  '*': 'italic',
  '~~': 'strikethrough'
};
function convertDecoratesInChildren(childrenArr, contentType) {
  let contentObj = { content: '', decorates: [] };
  if (!childrenArr || !childrenArr[0]) {
    return contentObj;
  }
  for (let i = 0; i < childrenArr.length; i++) {
    let type = childrenArr[i].type;
    let markup = childrenArr[i].markup;
    if (type === 'text') {
      let processContent = contentType === 'preParagraphs' ? childrenArr[i].content : childrenArr[i].content.replace(/(.+)\s* \s*(\{#.+\})/g, '$1');
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
  return contentObj;
}

exports.convertToPaperModel = function (originArr) {
  if (!originArr[0]) return;
  let resultObj = { preParagraphs: [], chapters: [] };
  let chaptersPos = resultObj.chapters;
  let sectionsPos;
  let subsectionsPos;
  let subsubsectionsPos;
  let paragraphPosition = resultObj.preParagraphs;
  paragraphPosition.push({ preParagraphs: [], sections: [] });
  paragraphPosition = paragraphPosition[paragraphPosition.length - 1].preParagraphs;
  for (let i = 0; i < originArr.length - 1; i++) {
    let key = `${originArr[i].type}-${originArr[i].tag}`;
    let contentType = tagMapping[key];
    if (originArr[i + 1].children === null) continue;
    let contentObj = convertDecoratesInChildren(originArr[i + 1].children, contentType);
    switch (contentType) {
      case 'chapters':
        chaptersPos.push({ name: contentObj.content, sections: [], preParagraphs: [], decorates: contentObj.decorates, comment: null });
        paragraphPosition = chaptersPos[chaptersPos.length - 1].preParagraphs;
        break;
      case 'sections':
        if (!chaptersPos[0]) chaptersPos[0] = { name: '', sections: [], preParagraphs: [], decorates: [], comment: null };
        sectionsPos = chaptersPos[chaptersPos.length - 1].sections;
        if (!sectionsPos) sectionsPos = [];
        sectionsPos.push({ name: contentObj.content, sections: [], preParagraphs: [], decorates: contentObj.decorates, comment: null });
        paragraphPosition = sectionsPos[sectionsPos.length - 1].preParagraphs;
        break;
      case 'subsections':
        if (!chaptersPos[0]) chaptersPos[0] = { name: '', sections: [{ name: '', sections: [], preParagraphs: [], decorates: [], comment: null }], preParagraphs: [] };
        subsectionsPos = sectionsPos[sectionsPos.length - 1].sections;
        if (!subsectionsPos) subsectionsPos = [];
        subsectionsPos.push({ name: contentObj.content, sections: [], preParagraphs: [], decorates: contentObj.decorates, comment: null });
        paragraphPosition = subsectionsPos[subsectionsPos.length - 1].preParagraphs;
        break;
      case 'subsubsections':
        if (!chaptersPos[0]) chaptersPos[0] = { name: '', sections: [{ name: '', sections: [], preParagraphs: [{ name: '', sections: [], preParagraphs: [], decorates: [], comment: null }], decorates: [], comment: null }], preParagraphs: [], decorates: [], comment: null };
        subsubsectionsPos = subsectionsPos[subsectionsPos.length - 1].sections;
        if (!subsubsectionsPos) subsubsectionsPos = [];
        subsubsectionsPos.push({ name: contentObj.content, preParagraphs: [], sections: [], decorates: contentObj.decorates, comment: null });
        paragraphPosition = subsubsectionsPos[subsubsectionsPos.length - 1].preParagraphs;
        break;
      case 'preParagraphs':
        paragraphPosition.push({ paragraph: contentObj.content, refs: [], decorates: contentObj.decorates, footnotes: [], comment: null });
        break;
      default:
        break;
    }
  }
  return resultObj;
};