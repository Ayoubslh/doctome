const fs = require('fs');
let file = 'src/pages/Appointments.js';
let text = fs.readFileSync(file, 'utf8');
text = text.split('"{t(\\"modify\\")} Appointment"').join('${t("modify")} Appointment');
fs.writeFileSync(file, text);
