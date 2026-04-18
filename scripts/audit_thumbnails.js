const fs = require('fs');
const path = require('path');

const data = fs.readFileSync('src/data/collectionsData.js', 'utf8');
const publicDir = path.join(__dirname, '../public');

// Extract all thumbnail paths with their product name for context
const re = /name: '([^']+)'[\s\S]{0,200}?thumbnail: '([^']*)'/g;
let m;

const broken = [];
const ok = [];
const empty = [];

while ((m = re.exec(data)) !== null) {
  const productName = m[1];
  const thumbPath = m[2];
  if (!thumbPath) { empty.push(productName); continue; }
  const fullPath = path.join(publicDir, thumbPath);
  if (fs.existsSync(fullPath)) {
    ok.push(thumbPath);
  } else {
    broken.push({ product: productName, thumb: thumbPath });
  }
}

console.log('=== BROKEN THUMBNAILS (' + broken.length + ') ===');
broken.forEach(b => console.log('  "' + b.product + '"\n    -> ' + b.thumb));
console.log('\n=== EMPTY THUMBNAILS (' + empty.length + ') ===');
empty.forEach(n => console.log('  "' + n + '"'));
console.log('\n=== OK: ' + ok.length + ' thumbnails valid ===');
