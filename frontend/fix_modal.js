const fs = require("fs");
let code = fs.readFileSync(
  "src/components/common/CompleteProfileModal.js",
  "utf8",
);
code = code.replace(
  /className="w-\[600px\] max-w-\[90vw\]"/,
  'maxWidthClassName="max-w-2xl"',
);
fs.writeFileSync("src/components/common/CompleteProfileModal.js", code);
