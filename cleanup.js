const fs = require('fs');

['Appointments', 'Patients', 'Settings', 'Analytics'].forEach(file => {
    const fPath = 'src/pages/' + file + '.js';
    if(fs.existsSync(fPath)) {
        let text = fs.readFileSync(fPath, 'utf8');
        text = text.replace(/import React\nimport { useLanguage } from "\.\.\/context\/LanguageContext";\n\/\/import React/g, 'import React');
        // Let's do it cleanly:
        if (!text.includes('useLanguage')) {
            text = text.replace(/import React/, 'import React, { useState } from "react";\nimport { useLanguage } from "../context/LanguageContext";\n//import React');
        }
        
        // Actually, just clean it up natively:
        text = text.replace('import React\nimport { useLanguage } from "../context/LanguageContext";\n//import React', 'import React');
        if (text.startsWith("import React\nimport { useLanguage }")) {
           text = text.replace("import React\n", "import React from \"react\";\n");
           text = text.replace("//import React from \"react\";\n", "");
        }
        
        fs.writeFileSync(fPath, text);
    }
});
