const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

function lint() {
  const indexPath = path.join(__dirname, 'stories', 'index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  if (!Array.isArray(index)) {
    fail('stories/index.json must be an array');
    return;
  }

  for (const name of index) {
    const file = path.join(__dirname, 'stories', `${name}.json`);
    if (!fs.existsSync(file)) {
      fail(`Missing story file: ${file}`);
      continue;
    }
    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      fail(`Invalid JSON in ${file}: ${err.message}`);
      continue;
    }
    Object.entries(data).forEach(([id, node]) => {
      if (typeof node.text !== 'string') {
        fail(`${file} -> ${id} missing 'text'`);
      }
      if (!Array.isArray(node.options)) {
        fail(`${file} -> ${id} missing 'options' array`);
      } else {
        node.options.forEach((opt, i) => {
          if (typeof opt.text !== 'string') {
            fail(`${file} -> ${id}.options[${i}] missing text`);
          }
          if (opt.next && typeof opt.next !== 'string') {
            fail(`${file} -> ${id}.options[${i}] invalid next`);
          }
        });
      }
    });
  }
}

lint();
