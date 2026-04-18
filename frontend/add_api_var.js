const fs = require("fs");

const replaceInFile = (file) => {
  let content = fs.readFileSync(file, "utf8");

  if (!content.includes("const api =")) {
    content = content.replace(
      /import axios from ['"]axios['"];/,
      'import axios from "axios";\n\nconst api = "https://tarfkhobz.app.n8n.cloud";',
    );
  }

  content = content.replace(
    /"https:\/\/tarfkhobz\.app\.n8n\.cloud\/webhook-test\/([^"]+)"/g,
    "`${api}/webhook-test/$1`",
  );
  content = content.replace(
    /`https:\/\/tarfkhobz\.app\.n8n\.cloud\/webhook-test\/([^`]+)`/g,
    "`${api}/webhook-test/$1`",
  );

  fs.writeFileSync(file, content);
  console.log("Fixed " + file);
};

[
  "src/context/AuthContext.js",
  "src/pages/auth/Login.js",
  "src/pages/auth/SignUp.js",
  "src/pages/Settings.js",
].forEach(replaceInFile);
