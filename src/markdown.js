var unified = require("unified");
var parse = require("remark-parse");
var html = require("remark-html");

const remark = unified()
  .use(parse)
  .use(html);

const markdownToHtml = text => {
  console.log(JSON.stringify(remark.parse(text)));
  return remark.processSync(text).contents;
};

const astToMarkdown = ast => remark.stringify(ast);

const parseMarkdown = text => remark.parse(text);

module.exports = { markdownToHtml, astToMarkdown, parseMarkdown };
