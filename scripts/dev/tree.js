// scripts/dev/tree.js
const fs = require('fs');
const path = require('path');

const EXCLUDE = ['node_modules', '.git', 'dist', '.turbo', '.cache'];

function printTree(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !EXCLUDE.includes(e.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isLast = i === entries.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    console.log(prefix + connector + entry.name);
    if (entry.isDirectory()) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      printTree(path.join(dir, entry.name), nextPrefix);
    }
  }
}

const root = process.cwd();
console.log(path.basename(root));
printTree(root);