const fs = require('fs');

const replaceInFile = (filePath, replacements) => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [key, value] of Object.entries(replacements)) {
        if (typeof value === 'string') {
            content = content.replace(new RegExp(key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), value);
        }
    }
    fs.writeFileSync(filePath, content);
};

// Appointments
replaceInFile('src/pages/Appointments.js', {
    '>Appointments<': '>{t("appointments")}<',
    'Upcoming': '{t("upcoming")}',
    'Completed': '{t("completed")}',
    'Canceled': '{t("cancelled")}',
    '>List<': '>{t("list")}<',
    '>Calendar<': '>{t("calendar_view")}<',
    'Date & Time': '{t("date_time")}',
    '>Type<': '>{t("type")}<',
    '>Actions<': '>{t("th_action")}<',
    '>New Appointment<': '>{t("new_appointment")}<',
    'Search appointments...': '{t("search_appts")}',
    'Modify': '{t("modify")}',
    '>Cancel<': '>{t("cancel")}<'
});

// Patients
replaceInFile('src/pages/Patients.js', {
    '>Patients<': '>{t("patients")}<',
    '>Active<': '>{t("active")}<',
    'Search patients...': '{t("search_patients")}',
    'Add Patient': '{t("add_patient")}',
    'Contact': '{t("contact")}',
    'Last Visit': '{t("last_visit")}',
    'Filter': '{t("filter")}',
    'Export': '{t("export")}'
});

// Settings
replaceInFile('src/pages/Settings.js', {
    '>Settings<': '>{t("settings")}<',
    'General Settings': '{t("general_settings")}',
    'Notifications': '{t("notifications")}',
    'Save Changes': '{t("save_changes")}'
});

console.log('Strings Replaced.');
