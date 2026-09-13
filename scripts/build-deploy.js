"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");

const publicDir = path.join(root, "public");
const documentationDir = path.join(root, "documentation");
const documentationBuild = path.join(documentationDir, "build");
const deployDir = path.join(root, "deploy");
const deployDocsDir = path.join(deployDir, "docs");

if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, {
        recursive: true,
        force: true
    });
}

fs.mkdirSync(deployDir, {
    recursive: true
});

console.log("==============================================");
console.log(" NEXA DEPLOYMENT BUILD");
console.log("==============================================");
console.log("");

console.log("Installing Docusaurus dependencies...");

execSync("npm install", {
    cwd: documentationDir,
    stdio: "inherit"
});

console.log("");
console.log("Building Docusaurus...");

execSync("npm run build", {
    cwd: documentationDir,
    stdio: "inherit"
});

if (!fs.existsSync(documentationBuild)) {
    console.error("ERROR: Docusaurus build directory was not created.");
    process.exit(1);
}

console.log("");
console.log("Copying NEXA website...");

fs.cpSync(publicDir, deployDir, {
    recursive: true
});

console.log("Copying Docusaurus into /docs...");

fs.mkdirSync(deployDocsDir, {
    recursive: true
});

fs.cpSync(documentationBuild, deployDocsDir, {
    recursive: true
});

const websiteIndex = path.join(deployDir, "index.html");
const docsIndex = path.join(deployDocsDir, "index.html");

if (!fs.existsSync(websiteIndex)) {
    console.error("ERROR: NEXA website index.html is missing.");
    process.exit(1);
}

if (!fs.existsSync(docsIndex)) {
    console.error("ERROR: Docusaurus docs index.html is missing.");
    process.exit(1);
}

console.log("");
console.log("==============================================");
console.log(" DEPLOYMENT BUILD COMPLETE");
console.log("==============================================");
console.log("");
console.log(`Website: ${deployDir}`);
console.log(`Docs:    ${deployDocsDir}`);
console.log("");
console.log("✓ NEXA website");
console.log("✓ Docusaurus documentation");
