const fs = require('fs');

let f1 = 'src/translations.js';
if (fs.existsSync(f1)) {
    let t1 = fs.readFileSync(f1, 'utf8');
    t1 = t1.replace('"settings": "Settings",', '"settings": "Settings",\n    "about": "About Us",');
    t1 = t1.replace('"settings": "Paramètres",', '"settings": "Paramètres",\n    "about": "À propos",');
    t1 = t1.replace('"settings": "الإعدادات",', '"settings": "الإعدادات",\n    "about": "حول التطبيق",');
    fs.writeFileSync(f1, t1);
}
