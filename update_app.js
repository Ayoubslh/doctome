const fs = require('fs');

const file = 'src/App.js';
let content = fs.readFileSync(file, 'utf8');

// Add import
const importTarget = "import Settings from './pages/Settings';";
const importReplace = "import Settings from './pages/Settings';\nimport About from './pages/About';";
if (!content.includes("import About")) {
    content = content.replace(importTarget, importReplace);
}

// Add route
const routeTarget = '<Route path="settings" element={<Settings />} />';
const routeReplace = '<Route path="settings" element={<Settings />} />\n          <Route path="about" element={<About />} />';
if (!content.includes('<Route path="about"')) {
    content = content.replace(routeTarget, routeReplace);
}

fs.writeFileSync(file, content);