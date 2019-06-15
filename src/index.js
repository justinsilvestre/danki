const { argv } = require("yargs");
const fs = require("fs");
const getErrors = require("./schema");
const eachFile = require("./eachFile");
const { parseMarkdown, astToMarkdown, markdownToHtml } = require("./markdown");
const { unparse } = require("papaparse");

const { _: paths, out } = argv;

const getLastHeader = headers => headers[headers.length - 1];

const getHeaders = (oldHeaders, newHeader) => {
  if (oldHeaders.length === 0) return [newHeader];

  const lastHeader = oldHeaders[oldHeaders.length - 1];

  return [
    ...oldHeaders.filter(header => header.depth < newHeader.depth),
    newHeader
  ];
};

const getPrevParagraph = nodesSoFar => {
  for (let i = nodesSoFar.length - 1; i >= 0; i -= 1) {
    const child = nodesSoFar[i].node;
    if (child.type === "header") return null;
    if (child.type === "paragraph") return child;
  }
  return null;
};

const getCardParagraphs = (inputNodes, nodesWithHeaders = []) => {
  let headers = [];

  inputNodes.forEach((child, index) => {
    const { type, depth } = child;
    switch (type) {
      case "header":
        headers = getHeaders(headers, child);
        break;

      case "paragraph":
        nodesWithHeaders.push({
          node: child,
          headers: headers
        });
        break;

      case "list": {
        const listItems = child.children;
        listItems.forEach(li => {
          getCardParagraphs(li.children, nodesWithHeaders);
        });
        break;
      }

      case "code": {
        child.previousParagraph = getPrevParagraph(nodesWithHeaders);
        const paragraphBlocks = (child.previousParagraph.codeBlocks =
          child.previousParagraph.codeBlocks || []);
        paragraphBlocks.push(child); // creates circular structure
        break;
      }
    }
  });

  return nodesWithHeaders;
};

const stringify = paragraphChildNode => {
  const { type, raw } = paragraphChildNode;
  if (type === "text") return raw;

  const { children } = paragraphChildNode;
  if (type === "strong") return `{{c1:${children.map(stringify).join("")}}}`;
  if (type === "emphasis") return children.map(stringify).join("");
};

const clozifyTextyNode = (node, strongDepth = 0) => {
  if (node.children) {
    const newStrongDepth =
      node.type === "strong" ? strongDepth + 1 : strongDepth;
    return {
      ...node,
      children: node.children.map(child =>
        clozifyTextyNode(child, newStrongDepth)
      )
    };
  } else if (strongDepth === 1 && node.type === "text") {
    // so we don't have cloze deletions within cloze deletions
    return {
      ...node,
      value: `{{c1:${node.value}}}`
    };
  } else {
    return node;
  }
};

const clozify = paragraphNode => {
  const transformedParagraph = {
    ...paragraphNode,
    children: paragraphNode.children.map(child => clozifyTextyNode(child))
  };

  return astToMarkdown(transformedParagraph);
};

paths.forEach(path => {
  eachFile(path, filePath => {
    const ast = parseMarkdown(fs.readFileSync(filePath, "utf8"));
    const cards = getCardParagraphs(ast.children); // must be done after parse always, for code blocks
    const errors = getErrors(ast);
    if (errors) {
      console.error(getErrors(ast), null, "  ");
      throw new Error("Problem parsing markdown " + filePath);
    }

    const output = unparse(cards.map(card => [clozify(card.node)]));
    if (out) {
      fs.writeFileSync(out, output);
    } else {
      console.log(output);
    }
  });
});
