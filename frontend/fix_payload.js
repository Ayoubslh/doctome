const fs = require("fs");

let code = fs.readFileSync(
  "src/components/common/CompleteProfileModal.js",
  "utf8",
);

code = code.replace(
  /const payload = \{ \.\.\.updatedData, doctor_id: user\?\.doctor_id \};/,
  `const payload = {
        doctor_name: updatedData.doctor_name,
        specialty: updatedData.specialty,
        wilaya: updatedData.wilaya,
        phone: updatedData.phone,
        email: updatedData.email,
        clinic_name: updatedData.clinic_name,
        available_days: updatedData.available_days,
        slot_duration_min: Number(updatedData.slot_duration_min),
        max_daily_patients: Number(updatedData.max_daily_patients),
        overbooking_allowed: updatedData.overbooking_allowed,
      };`,
);

fs.writeFileSync("src/components/common/CompleteProfileModal.js", code);
console.log("Fixed payload");
