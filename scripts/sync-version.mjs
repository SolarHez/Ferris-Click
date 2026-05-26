import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = pkg.version;

const cargoPath = "src-tauri/Cargo.toml";

let cargo = fs.readFileSync(cargoPath, "utf8");

cargo = cargo.replace(/^version = ".*"/m, `version = "${version}"`);

fs.writeFileSync(cargoPath, cargo);

console.log("synced version:", version);
