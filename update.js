const fs = require('fs');

const filesToProcess = ['src/pages/Appointments.js', 'src/pages/Patients.js', 'src/pages/Settings.js', 'src/pages/Analytics.js'];

filesToProcess.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('useLanguage')) {
      content = content.replace('import React', 'import React\nimport { useLanguage } from "../context/LanguageContext";\n//import React');
      const startCompIdx = content.indexOf('const ' + file.split('/').pop().replace('.js', ''));
      const blockStart = content.indexOf('{', startCompIdx) + 1;
      content = content.slice(0, blockStart) + '\n  const { t } = useLanguage();' + content.slice(blockStart);
      fs.writeFileSync(file, content);
      console.log('Updated ' + file);
    }
  }
});
