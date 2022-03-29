#! /usr/bin/env node

const inquirer = require("inquirer");
const colors = require("colors");
const { promises: fs } = require("fs");
const path = require("path");

const copyDir = async (src, dest) => {
  src = path.join(__dirname, "..", src);
  dest = path.join(process.cwd(), dest);
  console.log(dest);

  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });
  console.log(entries);
  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);
    await fs.copyFile(srcPath, destPath);
  }
};

inquirer
  .prompt([
    {
      type: "checkbox",
      message: "Select config files",
      name: "selection",
      choices: [
        {
          name: "React".cyan,
        },
        {
          name: "Node.js".green,
        },
      ],
      validate(answer) {
        if (answer.length < 1) {
          return "You must choose at least one.";
        }
        return true;
      },
    },
  ])
  .then((answers) => {
    answers.selection.map((ans) => {
      if (ans.includes("React")) {
        copyDir("config/react", "config_react");
        console.log("React config files copies in config_react");
      }
      if (ans.includes("Node")) {
        copyDir("config/node", "config_node");
        console.log("Node.js config files copies in config_node");
      }
    });
  });
