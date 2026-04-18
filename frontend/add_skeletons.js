const fs = require("fs");

const files = [
  "src/pages/Patients.js",
  "src/pages/Appointments.js",
  "src/pages/Analytics.js",
];

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  let updated = false;

  if (!content.includes("import Skeleton")) {
    content = content.replace(
      /import React(, \{.*?\})? from .react.;/,
      "import React$1 from 'react';\nimport Skeleton from '../components/common/Skeleton';",
    );
    updated = true;
  }

  if (!content.includes("const [isLoading, setIsLoading] = React.useState")) {
    const pageName = file.match(/pages\/([A-Za-z]+)\.js/)[1];
    const targetString = `const ${pageName} = () => {`;
    if (content.includes(targetString)) {
      content = content.replace(
        targetString,
        `${targetString}\n  const [isLoading, setIsLoading] = React.useState(true);\n  React.useEffect(() => {\n    const timer = setTimeout(() => setIsLoading(false), 800);\n    return () => clearTimeout(timer);\n  }, []);\n`,
      );
      updated = true;
    }
  }

  if (
    content.includes("const [isLoading, setIsLoading]") &&
    !content.includes("if (isLoading) {")
  ) {
    content = content.replace(
      "  return (",
      '  if (isLoading) {\n    return (\n      <div className="p-6 space-y-6">\n        <Skeleton className="h-8 w-1/4 rounded-lg" />\n        <Skeleton className="h-[500px] w-full rounded-2xl" />\n      </div>\n    );\n  }\n\n  return (',
    );
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(file, content);
    console.log("Updated " + file);
  }
});
