const fs = require('fs');
['Appointments', 'Patients', 'Settings', 'Analytics'].forEach(file => {
    let fPath = 'src/pages/' + file + '.js';
    if(fs.existsSync(fPath)) {
        let text = fs.readFileSync(fPath, 'utf8');
        // If it doesn't have useLanguage, add it right after React import
        if (!text.includes('useLanguage')) {
            text = text.replace(/import React(.*?)\n/, "import React\nimport { useLanguage } from \"../context/LanguageContext\";\n");
        }
        // If there's missing { t } = useLanguage(), add it in the component declaration.
        if (!text.includes('const { t } = useLanguage()')) {
            const compStart = "const " + file + " = () => {\n";
            if (text.includes(compStart)) {
                text = text.replace(compStart, compStart + "  const { t } = useLanguage();\n");
            } else {
               // Try matching const Comp = ...
               text = text.replace(new RegExp("const " + file + " = \\(.*?\\s*=>.*\\{(?:\\s*)"), "const " + file + " = () => {\n  const { t } = useLanguage();\n");
            }
        }
        fs.writeFileSync(fPath, text);
    }
});
