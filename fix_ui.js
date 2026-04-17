const fs = require('fs');

const replaceInFile = (filePath, replacements) => {
    if (!fs.existsSync(filePath)) {
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    
    // First, some specific regex replacements for specific tag blocks
    content = content.replace(/"Upcoming"/g, 't("upcoming")');
    content = content.replace(/"Completed"/g, 't("completed")');
    content = content.replace(/"Canceled"/g, 't("cancelled")');
    content = content.replace(/>Appointments</g, '>{t("appointments")}<');
    content = content.replace(/>List</g, '>{t("list")}<');
    content = content.replace(/>Calendar</g, '>{t("calendar_view")}<');
    content = content.replace(/>Date & Time</g, '>{t("date_time")}<');
    content = content.replace(/>Type</g, '>{t("type")}<');
    content = content.replace(/>Status</g, '>{t("th_status")}<');
    content = content.replace(/>Actions</g, '>{t("th_action")}<');
    content = content.replace(/>New Appointment</g, '>{t("new_appointment")}<');
    content = content.replace(/placeholder="Search appointments..."/g, 'placeholder={t("search_appts")}');
    content = content.replace(/>Patient</g, '>{t("th_patient")}<');
    content = content.replace(/"Modify"/g, 't("modify")');
    content = content.replace(/>Cancel</g, '>{t("cancel")}<');
    
    const names = ['Eleanor Pena', 'Cody Fisher', 'Leslie Alexander', 'Ralph Edwards', 'Wade Warren', 'Jane Cooper', 'Cameron Williamson', 'Brooklyn Simmons'];
    names.forEach(name => {
        const key = name.toLowerCase().replace(' ', '_');
        content = content.replace(new RegExp('"' + name + '"', 'g'), 't("' + key + '")');
    });

    content = content.replace(/"Active"/g, 't("active")');
    content = content.replace(/>Patients</g, '>{t("patients")}<');
    content = content.replace(/placeholder="Search patients..."/g, 'placeholder={t("search_patients")}');
    content = content.replace(/>Add Patient</g, '>{t("add_patient")}<');
    content = content.replace(/>Contact</g, '>{t("contact")}<');
    content = content.replace(/>Last Visit</g, '>{t("last_visit")}<');
    content = content.replace(/>Filter</g, '>{t("filter")}<');
    content = content.replace(/>Export</g, '>{t("export")}<');
    
    content = content.replace(/>Settings</g, '>{t("settings")}<');
    content = content.replace(/>General Settings</g, '>{t("general_settings")}<');
    content = content.replace(/>Notifications</g, '>{t("notifications")}<');
    content = content.replace(/>Save Changes</g, '>{t("save_changes")}<');

    fs.writeFileSync(filePath, content);
};

console.log('Running robust string replacement mappings...');
replaceInFile('src/pages/Appointments.js');
replaceInFile('src/pages/Patients.js');
replaceInFile('src/pages/Settings.js');
replaceInFile('src/pages/Analytics.js');

console.log('Done');
