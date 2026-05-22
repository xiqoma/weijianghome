const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Get all tracked files with their hashes and modes
const output = execSync("git ls-tree HEAD", { encoding: "utf-8" });
const lines = output.trim().split("\n");

const trees = [];
const blobs = [];

for (const line of lines) {
  const parts = line.split(/\s+/);
  const mode = parts[0];
  const type = parts[1];
  const hash = parts[2];
  const filepath = parts.slice(3).join(" ");
  
  if (type === "blob") {
    blobs.push({ path: filepath, mode, hash });
  } else if (type === "tree") {
    trees.push({ path: filepath, mode, hash });
  }
}

// Read and base64 encode files
const treeItems = [];
for (const item of blobs) {
  const content = fs.readFileSync(item.path);
  const b64 = content.toString("base64");
  treeItems.push({
    path: item.path,
    mode: item.mode,
    type: "blob",
    content: b64
  });
}

// For tree entries we need to handle them separately
// Let's create a JSON payload for the tree
const treePayload = {
  base_tree: null,
  tree: treeItems
};

fs.writeFileSync("tree_payload.json", JSON.stringify(treePayload, null, 2));
console.log("Tree items:", treeItems.length);
console.log("Payload written to tree_payload.json");
