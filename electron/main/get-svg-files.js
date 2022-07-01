var http = require("http");
var path = require("path");
var fs = require("fs");

const mode = process.env["MODE"];
const basePath = mode === "development" ? "./public" : "./resources/app/dist";
// const basePath = "./public";

const getSvgFiles = () => {
  const svgList = fs
    // .readdirSync("./public/fonts", { withFileTypes: true }) //同期でファイル読み込み
    .readdirSync(`${basePath}/svgs`, { withFileTypes: true }) //同期でファイル読み込み
    .filter((dirent) => dirent.isFile())
    .map(({ name }) => name) //フォルダ除外
    .filter(function (file) {
      return path.extname(file).toLowerCase() === ".svg"; //拡張子svgだけ
    });

  let svgDataArray = [];

  svgList.forEach((item) => {
    const test = fs.readFileSync(`${basePath}/svgs/${item}`, "utf-8");
    const path = test.match(/<path(?: .+?)?\/>/g);
    svgDataArray.push(path);
  });

  return svgDataArray;
};

export default getSvgFiles;
