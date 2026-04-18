const fs = require('fs');

let f1 = 'src/pages/Settings.js';
if (fs.existsSync(f1)) {
    let t1 = fs.readFileSync(f1, 'utf8');
    t1 = t1.replace('"{t(\\"notifications\\")}"', 't("notifications")');
    t1 = t1.replace('label: "General Settings"', 'label: t("general_settings")');
    fs.writeFileSync(f1, t1);
}
