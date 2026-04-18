const fs = require("fs");
[
  "src/pages/Analytics.js",
  "src/pages/Appointments.js",
  "src/pages/Patients.js",
  "src/pages/Settings.js",
  "src/pages/Dashboard.js",
].forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(
    /import Skeleton from ['"].*Skeleton['"]/g,
    'import { Skeleton } from "../components/common/Skeleton"',
  );
  fs.writeFileSync(file, content);
  console.log("Fixed " + file);
});
