const ref = name => ({ $ref: `#/definitions/${name}` });

const resolveType = ([first, ...rest]) => ({
  if: { properties: { type: { const: first } } },
  then: { $ref: `#/definitions/${first}` },
  else: rest.length ? resolveType(rest) : false
});

const childrenRefs = names => ({
  type: "array",
  items: resolveType(names)
});
const object = requiredProperties => ({
  type: "object",
  required: Object.keys(requiredProperties),
  properties: requiredProperties
});
const exactStringMatch = string => ({ type: "string", pattern: `^${string}$` });

const textChildren = childrenRefs(["text", "strong", "emphasis", "inlineCode"]);

const documentSchema = {
  $id: "http://whoisjust.in/algorithms-flashcards/schema.json",
  required: ["children"],
  type: "object",
  properties: {
    children: childrenRefs(["heading", "paragraph", "code", "list"])
  },
  definitions: {
    heading: object({
      type: exactStringMatch("heading"),
      children: childrenRefs(["text"])
    }),
    text: object({
      type: exactStringMatch("text"),
      value: {
        type: "string"
      }
    }),
    paragraph: object({
      type: exactStringMatch("paragraph"),
      children: textChildren
    }),
    strong: object({
      type: exactStringMatch("strong"),
      children: textChildren
    }),
    emphasis: object({
      type: exactStringMatch("emphasis"),
      children: textChildren
    }),
    inlineCode: object({
      type: exactStringMatch("inlineCode"),
      value: { type: "string" }
    }),
    code: object({
      type: exactStringMatch("code"),
      previousParagraph: ref("paragraph"),
      value: {
        type: "string"
      }
    }),
    list: object({
      type: exactStringMatch("list"),
      children: childrenRefs(["listItem"])
    }),
    listItem: object({
      type: exactStringMatch("listItem"),
      children: childrenRefs(["paragraph", "code"])
    })
  }
};

const Ajv = require("ajv");
const ajv = new Ajv({ schemas: [documentSchema], verbose: true });
const validate = ajv.getSchema(documentSchema.$id);

const getErrors = ast => {
  validate(ast);
  return validate.errors;
};

module.exports = getErrors;
