const fs = require("fs");

const fixImports = (file) => {
  let content = fs.readFileSync(file, "utf8");

  // remove existing const api
  content = content.replace(
    /const api = "https:\/\/tarfkhobz\.app\.n8n\.cloud";\n?/g,
    "",
  );

  const lines = content.split("\n");
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) {
      lastImportIndex = i;
    }
  }

  lines.splice(
    lastImportIndex + 1,
    0,
    '\nconst api = "https://tarfkhobz.app.n8n.cloud";',
  );
  content = lines.join("\n");

  fs.writeFileSync(file, content);
  console.log("Fixed imports in " + file);
};

[
  "src/context/AuthContext.js",
  "src/pages/auth/Login.js",
  "src/pages/auth/SignUp.js",
  "src/pages/Settings.js",
].forEach(fixImports);
