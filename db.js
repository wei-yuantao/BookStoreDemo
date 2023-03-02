const fs = require("fs");
const { promisify } = require("util");
const path = require("path");


// 读取异步文件
const readFile = promisify(fs.readFile);
// 写入异步文件
const writeFile = promisify(fs.writeFile);
// 路径
const dbPath = path.join(__dirname, "./db.json");

// 查询
exports.getDb = async () => {
  const data = await readFile(dbPath, "utf8");
  return JSON.parse(data);
};

// 添加数据
exports.saveDb = async (db) => {
  // null,""换行缩进
  const data = JSON.stringify(db, null, "  ")
  await writeFile(dbPath,data)
}










































// const fs = require("fs")
// // prmise 工具封装文件读取
// const { promisify } = require("util")
// const path = require("path")
// // 异步文件读取
// const readFile = promisify(fs.readFile)

// // const writeFile = promisify(fs.writeFile);
// // 获取文件路径
// const dbPath = path.join(__dirname, "./db.json")

// // 要引入的数据
// exports.getDb = async () => {
//   const data = await readFile(dbPath, "utf-8")
//   return JSON.parse(data)
// }
