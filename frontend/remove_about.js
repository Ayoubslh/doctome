const fs = require('fs');
fs.unlinkSync('src/pages/About.js');

let appContent = fs.readFileSync('src/App.js', 'utf8');
appContent = appContent.replace("import About from './pages/About';\n", "");
appContent = appContent.replace('<Route path="about" element={<About />} />\n', "");
fs.writeFileSync('src/App.js', appContent);

let sidebarContent = fs.readFileSync('src/components/layout/Sidebar.js', 'utf8');
sidebarContent = sidebarContent.replace('    { name: t("about"), icon: Activity, path: "/about" },\n', "");
fs.writeFileSync('src/components/layout/Sidebar.js', sidebarContent);
