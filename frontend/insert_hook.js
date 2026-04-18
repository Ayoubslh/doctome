const fs = require('fs');

['Appointments', 'Patients', 'Settings', 'Analytics'].forEach(file => {
    let fPath = 'src/pages/' + file + '.js';
    if(fs.existsSync(fPath)) {
        let text = fs.readFileSync(fPath, 'utf8');
        if (!text.includes('useLanguage } from')) {
            text = text.replace(/import React(.*?)\n/, "import React\nimport { useLanguage } from \"../context/LanguageContext\";\n");
            fs.writeFileSync(fPath, text);
        }
    }
});
