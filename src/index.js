const { argv } = require("yargs");
const fs = require("fs");
const eachFile = require("./eachFile");
const compile = require("./compile");

const { _: paths, out } = argv;

const compiled = [];

paths.forEach(path => {
  eachFile(path, filePath => {
    const text = fs.readFileSync(filePath, "utf8");
    compiled.push(compile(text));
  });
});

const output = compiled.join("\n");

if (out) {
  fs.writeFileSync(out, output);
} else {
  console.log(output);
}
