const fs = require('fs');

const missingKeys = {
    cameron_williamson: { en: "Cameron Williamson", fr: "Cameron Williamson", ar: "كاميرون ويليامسون" },
    brooklyn_simmons: { en: "Brooklyn Simmons", fr: "Brooklyn Simmons", ar: "بروكلين سيمونز" },
    today: { en: "Today", fr: "Aujourd'hui", ar: "اليوم" },
    tomorrow: { en: "Tomorrow", fr: "Demain", ar: "غداً" },
    checkup: { en: "Checkup", fr: "Bilan", ar: "فحص" },
    consultation: { en: "Consultation", fr: "Consultation", ar: "استشارة" },
    follow_up: { en: "Follow-up", fr: "Suivi", ar: "متابعة" },
    therapy: { en: "Therapy", fr: "Thérapie", ar: "علاج" },
    confirmed: { en: "Confirmed", fr: "Confirmé", ar: "مؤكد" },
    pending: { en: "Pending", fr: "En attente", ar: "قيد الانتظار" },
    in_progress: { en: "In Progress", fr: "En cours", ar: "جاري" },
    checked_out: { en: "Checked Out", fr: "Terminé", ar: "مسجل الخروج" },
    cancelled: { en: "Canceled", fr: "Annulé", ar: "ملغى" },
    upcoming: { en: "Upcoming", fr: "À venir", ar: "القادمة" },
    completed: { en: "Completed", fr: "Terminé", ar: "مكتمل" },
    list: { en: "List", fr: "Liste", ar: "قائمة" },
    calendar_view: { en: "Calendar", fr: "Calendrier", ar: "التقويم" },
    date_time: { en: "Date & Time", fr: "Date et heure", ar: "التاريخ والوقت" },
    type: { en: "Type", fr: "Type", ar: "النوع" },
    new_appointment: { en: "New Appointment", fr: "Nouveau RDV", ar: "موعد جديد" },
    search_appts: { en: "Search appointments...", fr: "Rechercher un RDV...", ar: "البحث عن موعد..." },
    modify: { en: "Modify", fr: "Modifier", ar: "تعديل" },
    cancel: { en: "Cancel", fr: "Annuler", ar: "إلغاء" },
    active: { en: "Active", fr: "Actif", ar: "نشط" },
    search_patients: { en: "Search patients...", fr: "Rechercher...", ar: "البحث عن المرضى..." },
    add_patient: { en: "Add Patient", fr: "Ajouter Patient", ar: "إضافة مريض" },
    contact: { en: "Contact", fr: "Contact", ar: "جهة الاتصال" },
    last_visit: { en: "Last Visit", fr: "Dernière visite", ar: "الزيارة الأخيرة" },
    filter: { en: "Filter", fr: "Filtrer", ar: "تصفية" },
    export: { en: "Export", fr: "Exporter", ar: "تصدير" },
    general_settings: { en: "General Settings", fr: "Paramètres généraux", ar: "إعدادات عامة" },
    save_changes: { en: "Save Changes", fr: "Enregistrer", ar: "حفظ التغييرات" },
};

let content = fs.readFileSync('src/translations.js', 'utf8');

['en', 'fr', 'ar'].forEach(lang => {
    const langStr = lang + ': {';
    if (content.includes(langStr)) {
        let replacement = langStr + '\n';
        for (const k in missingKeys) {
            replacement += '    "' + k + '": "' + missingKeys[k][lang] + '",\n';
        }
        content = content.replace(langStr, replacement);
    }
});

fs.writeFileSync('src/translations.js', content);
console.log('Translations Updated.');
