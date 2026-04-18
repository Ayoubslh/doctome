const fs = require("fs");

let file = "src/components/common/CompleteProfileModal.js";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /useEffect\(\(\) => \{\n    if \(isSuccess\) \{\n      if \(\!dbDoctor \|\| \!dbDoctor\.doctor_name\) \{\n        setIsOpen\(true\);\n      \}\n    \}\n  \}, \[isSuccess, dbDoctor\]\);/,
  `useEffect(() => {
    if (user && !user.doctor_id) {
      setIsOpen(true);
    } else if (isSuccess) {
      if (!dbDoctor || !dbDoctor.doctor_name) {
        setIsOpen(true);
      }
    }
  }, [user, isSuccess, dbDoctor]);`,
);

fs.writeFileSync(file, code);
console.log("Fixed useEffect in Modal");
