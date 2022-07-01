var path = require("path");
var fs = require("fs");

const mode = process.env["MODE"];
const basePath = mode === "development" ? "./public" : "./resources/app/dist";
// const basePath = "./public";

const getUserConfig = () => {
  console.log("start load config file");
  const userConfig = fs
    .readdirSync(`${basePath}/user-config`, { withFileTypes: true }) //同期でファイル読み込み
    .filter((dirent) => dirent.isFile())
    .map(({ name }) => name) //フォルダ除外
    .filter(function (file) {
      return path.extname(file).toLowerCase() === ".json"; //拡張子svgだけ
    });

  const test = fs.readFileSync(`${basePath}/user-config/${userConfig[0]}`, "utf-8");
  return JSON.parse(test);
};

export const saveUserConfig = (newConfig) => {
  const userConfigFile = fs
    .readdirSync(`${basePath}/user-config`, { withFileTypes: true }) //同期でファイル読み込み
    .filter((dirent) => dirent.isFile())
    .map(({ name }) => name) //フォルダ除外
    .filter(function (file) {
      return path.extname(file).toLowerCase() === ".json";
    });

  fs.writeFileSync(`${basePath}/user-config/${userConfigFile[0]}`, JSON.stringify(newConfig));
};

export default getUserConfig;
