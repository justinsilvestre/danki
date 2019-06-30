const fs = require("fs");
const getErrors = require("./schema");
const { parseMarkdown, astToMarkdown, markdownToHtml } = require("./markdown");
const { unparse } = require("papaparse");

const getLastHeader = headings => headings[headings.length - 1];

const getHeadings = (oldHeadings, newHeader) => {
  if (oldHeadings.length === 0) return [newHeader];

  const lastHeader = oldHeadings[oldHeadings.length - 1];

  return [
    ...oldHeadings.filter(heading => heading.depth < newHeader.depth),
    newHeader
  ];
};

const getPrevParagraph = nodesSoFar => {
  for (let i = nodesSoFar.length - 1; i >= 0; i -= 1) {
    const child = nodesSoFar[i].node;
    if (child.type === "heading") return null;
    if (child.type === "paragraph") return child;
  }
  return null;
};

const getCardParagraphs = (
  inputNodes,
  nodesWithHeadings = [],
  headings = []
) => {
  inputNodes.forEach((child, index) => {
    switch (child.type) {
      case "heading":
        headings = getHeadings(headings, child);
        break;

      case "paragraph":
        nodesWithHeadings.push({
          node: child,
          headings: headings
            .map(heading => markdownToHtml(astToMarkdown(heading)))
            .join("")
        });
        break;

      case "list":
        if (child.ordered) {
          child.previousParagraph = getPrevParagraph(nodesWithHeadings);
          const paragraphBlocks = (child.previousParagraph.attachments =
            child.previousParagraph.attachments || []);
          paragraphBlocks.push(child); // creates circular structure
          break;
        } else {
          const listItems = child.children;
          listItems.forEach(li => {
            getCardParagraphs(li.children, nodesWithHeadings, headings);
          });
          break;
        }

      case "code": {
        child.previousParagraph = getPrevParagraph(nodesWithHeadings);
        const paragraphBlocks = (child.previousParagraph.attachments =
          child.previousParagraph.attachments || []);
        paragraphBlocks.push(child); // creates circular structure
        break;
      }
    }
  });

  return nodesWithHeadings;
};

const clozifyTextyNode = (node, strongDepth = 0) => {
  if (node.type === "strong" && strongDepth === 0) {
    return {
      ...node,
      children: [
        { type: "text", value: "{{c1::" },
        ...node.children.map(child => clozifyTextyNode(child, strongDepth + 1)),
        { type: "text", value: "}}" }
      ]
    };
    // } else if (node.type === "list" && node.ordered) {
  } else if (node.children && node.children.length) {
    return {
      ...node,
      children: node.children.map(child => clozifyTextyNode(child, strongDepth))
    };
  } else return node;
};

const removeWrappingP = html =>
  /^\<p\>.+\<\/p\>$/.test(html) ? html.replace(/(^\<p\>|\<\/p\>$)/g, "") : html;

// TODO: clozify bold text inside ordered lists
const clozify = paragraphNode => {
  const transformedParagraph = {
    ...paragraphNode,
    children: paragraphNode.children.map(child => clozifyTextyNode(child))
  };

  return paragraphNode.attachments
    ? astToMarkdown(transformedParagraph) +
        paragraphNode.attachments
          .map(code => astToMarkdown(clozifyTextyNode(code)))
          .join("")
    : removeWrappingP(astToMarkdown(transformedParagraph));
};

const compile = text => {
  const ast = parseMarkdown(text);
  const cards = getCardParagraphs(ast.children); // must be done after parse always, for code blocks
  const errors = getErrors(ast);
  if (errors) {
    console.error(getErrors(ast), null, "  ");
    throw new Error("Problem parsing markdown " + filePath);
  }

  return unparse(cards.map(card => [clozify(card.node), card.headings]), {
    newline: "\n"
  });
};

module.exports = compile;
