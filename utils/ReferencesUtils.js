/**
 * create by samantha on 2019-10-09
 * 未完成
 */
'use strict';


function processBook(contentArr) {
  let reference = {}, title, publishPlace, publisher, startPage, year, pResult;
  if (parseInt(contentArr[1]).toString() !== 'NaN') {
    year = contentArr[1];
    title = contentArr[2];
    pResult = contentArr[3].split(',')[0];
    pResult = pResult.split(' : ');
    startPage = contentArr[4] ? contentArr[4].slice(2, -1) : null;
    // startPage = contentArr[contentArr.length - 1].split(' ')[1];
  } else {
    title = contentArr[1];
    pResult = contentArr[2].split(',')[0];
    pResult = pResult.split(' : ');
    startPage = contentArr[3] ? contentArr[3].slice(2, -1) : null;
  }
  publishPlace = pResult[0];
  publisher = pResult[1];
  reference = { year, title, publisher, publishPlace, startPage };
  return reference;
}
function processJournal(contentArr) {
  let reference, year, title, journal, volume, issue, startPage;
  const resultArr = contentArr[contentArr.length - 1].split(', ');
  if (parseInt(contentArr[1]).toString() !== 'NaN') {
    year = contentArr[1];
    title = contentArr[2];
    journal = contentArr[3];
    volume = resultArr[1].slice(2);
    issue = resultArr[2];
    startPage = resultArr[3] ? resultArr[3].slice(2, -1) : null;
  } else {
    title = contentArr[1];
    journal = contentArr[2];
    volume = resultArr[0].slice(2);
    issue = resultArr[1];
    startPage = resultArr[2] ? resultArr[2].slice(2, -1) : null;
  }
  reference = { year, title, journal, volume, issue, startPage }
  return reference;
}

// 输入：一段字符串
// 输出：{authors:[], title: '', refType: 'J_Journal',journal: '', year: '', volume: '', issue: '', }
function convertReference(content) {
  if (!content) {
    return;
  }
  let reference = {}, authors, refType;
  const contentArr = content.split('. ');
  refType = content.includes('出版社') ? 'M_Book' : 'J_Journal';
  authors = contentArr[0].split(', ').map(author => { return { name: author } }); //确定
  reference = refType === 'M_Book' ? processBook(contentArr) : processJournal(contentArr);
  reference.authors = authors;
  reference.refType = refType;
  return reference;
}