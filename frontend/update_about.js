const fs = require('fs');

const file = 'src/translations.js';
let content = fs.readFileSync(file, 'utf8');

const enAbout = `
    aboutUsTitle: "Application Overview",
    aboutUsP1: "Doctome is a modern, responsive, and multilingual medical practice management dashboard built with React and Tailwind CSS. It is designed to help healthcare professionals and clinic administrators manage their daily operations, monitor patient appointments, and mitigate risks such as patient no-shows.",
    aboutUsH2_1: "Key Features & Modules",
    aboutUsL1: "Dashboard & Risk Assessment: A high-level overview of daily metrics, a predictive Risk Table, and Active Insights.",
    aboutUsL2: "Patient Management: A comprehensive patient directory to add, search, filter, and modify patient details.",
    aboutUsL3: "Appointment Scheduling: Manage appointments across distinct statuses with dual viewing modes.",
    aboutUsL4: "Analytics & Reporting: Weekly trend charts and data visualization for clinic performance.",
    aboutUsL5: "Internationalization & Accessibility: Full multilingual support (English, French, Arabic) with dynamic LTR/RTL UI mirroring.",
    aboutUsL6: "Theme & Customization: Integrated Theme Context supporting Light and Dark modes.",
    aboutUsH2_2: "Technical Stack",
    aboutUsStack: "React (Create React App), Tailwind CSS, Lucide React, React Router, React Context API.",
`;

const frAbout = `
    aboutUsTitle: "Description de l'application",
    aboutUsP1: "Doctome est un tableau de bord de gestion de cabinet médical moderne, réactif et multilingue, conçu avec React et Tailwind CSS. Il est conçu pour aider les professionnels de la santé et les administrateurs de cliniques à gérer leurs opérations quotidiennes, suivre les rendez-vous des patients et atténuer les risques tels que les absences.",
    aboutUsH2_1: "Fonctionnalités clés et modules",
    aboutUsL1: "Tableau de bord et évaluation des risques : Vue d'ensemble des indicateurs quotidiens, tableau de risques prédictif et alertes.",
    aboutUsL2: "Gestion des patients : Répertoire pour ajouter, rechercher, filtrer et modifier les patients.",
    aboutUsL3: "Gestion des rendez-vous : Suivi des statuts avec vues en liste et calendrier.",
    aboutUsL4: "Analytique : Graphiques de tendances hebdomadaires pour les performances de la clinique.",
    aboutUsL5: "Internationalisation (i18n) : Support multilingue complet (Anglais, Français, Arabe) avec basculement dynamique LTR/RTL.",
    aboutUsL6: "Thème et personnalisation : Mode clair/sombre et paramètres intégrés.",
    aboutUsH2_2: "Stack technique",
    aboutUsStack: "React, Tailwind CSS, Lucide React, React Router, Context API.",
`;

const arAbout = `
    aboutUsTitle: "نظرة عامة على التطبيق",
    aboutUsP1: "دوكتوم (Doctome) هي لوحة معلومات حديثة وسريعة الاستجابة ومتعددة اللغات لإدارة العيادات الطبية، مبنية باستخدام React و Tailwind CSS. تم تصميمها لمساعدة المتخصصين في الرعاية الصحية ومديري العيادات على إدارة عملياتهم اليومية ومراقبة مواعيد المرضى وتقليل المخاطر مثل عدم حضور المرضى.",
    aboutUsH2_1: "الميزات والوحدات الرئيسية",
    aboutUsL1: "لوحة القيادة وتقييم المخاطر: نظرة عامة على المقاييس اليومية، وجدول مخاطر تنبؤي، وتنبيهات نشطة.",
    aboutUsL2: "إدارة المرضى: دليل شامل لإضافة المرضى والبحث عنهم وتصفيتهم وتعديل بياناتهم.",
    aboutUsL3: "جدولة المواعيد: تتبع الحالات وطرق عرض القائمة والتقويم.",
    aboutUsL4: "التحليلات: مخططات الاتجاه الأسبوعية لأداء العيادة.",
    aboutUsL5: "التدويل واللغات (i18n): دعم كامل متعدد اللغات (الإنجليزية، الفرنسية، العربية) مع تبديل واجهة المستخدم (LTR/RTL) ديناميكيًا.",
    aboutUsL6: "السمة (Theme): وضع الإضاءة والظلام المدمج.",
    aboutUsH2_2: "التقنيات المستخدمة",
    aboutUsStack: "React، Tailwind CSS، Lucide React، React Router، Context API.",
`;

content = content.replace(/(en:\s*\{[\s\S]*?)(?=\s*\})/, '$1' + enAbout);
content = content.replace(/(fr:\s*\{[\s\S]*?)(?=\s*\})/, '$1' + frAbout);
content = content.replace(/(ar:\s*\{[\s\S]*?)(?=\s*\})/, '$1' + arAbout);

fs.writeFileSync(file, content);
