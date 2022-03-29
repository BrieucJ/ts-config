#!/usr/bin/node

const inquirer = require("inquirer");
const colors = require("colors");
const { promises: fs } = require("fs");
const path = require("path");

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });
  console.log("entries", entries);
  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath);
  }
}

inquirer
  .prompt([
    {
      type: "checkbox",
      message: "Select one or more config files",
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
          return "You must choose at least one config";
        }
        return true;
      },
    },
  ])
  .then((answers) => {
    answers.selection.map((ans) => {
      if (ans.includes("React")) {
        copyDir("config/react", "./config_react");
        console.log("React config files copied in config_react");
      }
      if (ans.includes("Node")) {
        copyDir("config/node", "./config_node");
        console.log("Node.js config files copied in config_node");
      }
    });
  });
