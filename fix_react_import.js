const fs = require('fs');

['Appointments', 'Patients', 'Settings', 'Analytics'].forEach(file => {
    let fPath = 'src/pages/' + file + '.js';
    if(fs.existsSync(fPath)) {
        let text = fs.readFileSync(fPath, 'utf8');
        text = text.replace(/^import React\n/, 'import React from "react";\n');
        text = text.replace(/^import React\r\n/, 'import React from "react";\r\n');
        fs.writeFileSync(fPath, text);
    }
});
