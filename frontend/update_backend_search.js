const fs = require('fs');
const path = require('path');
const file = path.join('E:/coding/doctome/backend/src/routes/users.js');
let code = fs.readFileSync(file, 'utf8');

const oldCode = "if (q.name) filter.full_name = { $regex: q.name, $options: 'i' };";
const newCode = "if (q.name) filter.full_name = { $regex: q.name, $options: 'i' };
    if (q.search) {
      filter.$or = [
        { full_name: { $regex: q.search, $options: 'i' } },
        { patient_id: { $regex: q.search, $options: 'i' } },
        { user_id: { $regex: q.search, $options: 'i' } }
      ];
    }";

code = code.replace(oldCode, newCode);
fs.writeFileSync(file, code);
console.log("Updated users.js");
