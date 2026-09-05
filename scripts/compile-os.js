#!/usr/bin/env node
// Compile public/screens/bricks.js (JSX) → public/screens/bricks.compiled.js
// Classic runtime: os.html / book.html / disp.html load React via <script>, not jsx-runtime.
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '..');
const srcPath = path.join(root, 'public/screens/bricks.js');
const outPath = path.join(root, 'public/screens/bricks.compiled.js');

const src = fs.readFileSync(srcPath, 'utf8');
const result = babel.transformSync(src, {
  filename: srcPath,
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  babelrc: false,
  configFile: false,
  sourceType: 'script',
  compact: false,
  comments: true,
});

if (!result || !result.code) {
  console.error('compile-os: babel produced no output');
  process.exit(1);
}

fs.writeFileSync(outPath, result.code.endsWith('\n') ? result.code : result.code + '\n');
console.log('wrote', path.relative(root, outPath));
