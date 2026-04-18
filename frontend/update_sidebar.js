const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Sidebar.js', 'utf8');

const targetStr = '{ name: t("settings"), icon: Settings, path: "/settings" },';
const replaceStr = targetStr + '\n    { name: t("about"), icon: Activity, path: "/about" },';

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/components/layout/Sidebar.js', content);
