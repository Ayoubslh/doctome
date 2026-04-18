const fs = require('fs');

let file = 'src/components/layout/Sidebar.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Import ConfirmDialog
content = content.replace(
  'import { useLanguage } from "../../context/LanguageContext";',
  'import { useLanguage } from "../../context/LanguageContext";\nimport ConfirmDialog from "../common/ConfirmDialog";'
);

// 2. Add state
content = content.replace(
  '  const [isCollapsed, setIsCollapsed] = useState(true);',
  '  const [isCollapsed, setIsCollapsed] = useState(true);\n  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);'
);

// 3. Update button
content = content.replace(
  'onClick={logout}',
  'onClick={() => setIsLogoutModalOpen(true)}'
);

// 4. Add ConfirmDialog before </aside>
content = content.replace(
  '    </aside>',
  `      <ConfirmDialog
        isOpen={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out of Doctome?"
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        tone="warning"
        onConfirm={logout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </aside>`
);

fs.writeFileSync(file, content);