const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const js = fs.readFileSync(path.join(root, "script.js"), "utf8");
const dockerfile = fs.readFileSync(path.join(root, "Dockerfile"), "utf8");

const issues = [];

if (/<script[^>]+src=["']https?:\/\//i.test(html)) {
    issues.push("External JavaScript sources are not permitted by this basic check.");
}

if (/eval\s*\(|new Function\s*\(/.test(js)) {
    issues.push("Unsafe dynamic code execution detected.");
}

if (/innerHTML\s*=/i.test(js)) {
    issues.push("Direct innerHTML assignment detected; use safe DOM methods.");
}

if (/^\s*USER\s+root\s*$/im.test(dockerfile)) {
    issues.push("Dockerfile explicitly sets the runtime user to root.");
}

if (issues.length > 0) {
    console.error("SECURITY CHECK FAILED:");
    issues.forEach(issue => console.error("- " + issue));
    process.exit(1);
}

console.log("SECURITY CHECK PASSED: No configured security patterns detected.");
