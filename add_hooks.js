const fs = require('fs');

['Appointments', 'Patients', 'Settings'].forEach(file => {
    let fPath = 'src/pages/' + file + '.js';
    if(fs.existsSync(fPath)) {
        let text = fs.readFileSync(fPath, 'utf8');
        if (!text.includes('useState } from "react"')) {
            text = text.replace(/import React from "react";/, "import React, { useState } from \"react\";");
            fs.writeFileSync(fPath, text);
        }
    }
});
