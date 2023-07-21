#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const package = require("../package.json");
const templates = require("./template.js");
const path = require("path");
const downloadGitRepo = require("download-git-repo");
const ora = require("ora"); // 引入ora
// 定义当前版本
program.version(`v${package.version}`);
program
  .command("create")
  .description("创建模版")
  .action(async () => {
    const { name } = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "请输入项目名称：",
    });

    const { template } = await inquirer.prompt({
      type: "list",
      name: "template",
      message: "请选择模版：",
      choices: templates,
    });

    // 定义loading
    const loading = ora("正在下载模版...");
    // 开始loading
    loading.start();
    const dest = path.join(process.cwd(), name);
    // 下载模版
    downloadGitRepo(template, dest, { clone: true }, (err) => {
      loading.stop();
      if (err) {
        loading.fail("创建模版失败：" + err.message); // 失败loading
      } else {
        loading.succeed("创建模版成功!"); // 成功loading
      }
    });
  });

program.parse(process.argv);
