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

// ------------------------------------------------------------
// CLEAN DEPLOY DIRECTORY
// ------------------------------------------------------------

if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, {
        recursive: true,
        force: true
    });
}

fs.mkdirSync(deployDir, {
    recursive: true
});

// ------------------------------------------------------------
// BUILD DOCUSAURUS
// ------------------------------------------------------------

console.log("==============================================");
console.log(" NEXA DEPLOYMENT BUILD");
console.log("==============================================");
console.log("");

console.log("Building Docusaurus...");

execSync("npm run build", {
    cwd: documentationDir,
    stdio: "inherit",
    shell: true
});

// ------------------------------------------------------------
// VERIFY DOCUSAURUS BUILD
// ------------------------------------------------------------

if (!fs.existsSync(documentationBuild)) {
    console.error("");
    console.error("ERROR: Docusaurus build directory was not created.");
    process.exit(1);
}

// ------------------------------------------------------------
// COPY MAIN NEXA WEBSITE
// ------------------------------------------------------------

console.log("");
console.log("Copying NEXA website...");

fs.cpSync(
    publicDir,
    deployDir,
    {
        recursive: true
    }
);

// ------------------------------------------------------------
// COPY DOCUSAURUS INTO /docs
// ------------------------------------------------------------

console.log("Copying Docusaurus into /docs...");

fs.mkdirSync(deployDocsDir, {
    recursive: true
});

fs.cpSync(
    documentationBuild,
    deployDocsDir,
    {
        recursive: true
    }
);

// ------------------------------------------------------------
// VERIFY DEPLOYMENT
// ------------------------------------------------------------

const websiteIndex = path.join(deployDir, "index.html");
const docsIndex = path.join(deployDocsDir, "index.html");

if (!fs.existsSync(websiteIndex)) {
    console.error("");
    console.error("ERROR: NEXA website index.html is missing.");
    process.exit(1);
}

if (!fs.existsSync(docsIndex)) {
    console.error("");
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
console.log("Verified:");
console.log("  ✓ NEXA website");
console.log("  ✓ Docusaurus documentation");
console.log("");