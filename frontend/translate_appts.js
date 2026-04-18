const fs = require('fs');

let content = fs.readFileSync('src/pages/Appointments.js', 'utf8');

// Replace standard names
const names = ['Eleanor Pena', 'Cody Fisher', 'Leslie Alexander', 'Ralph Edwards', 'Wade Warren', 'Jane Cooper', 'Cameron Williamson', 'Brooklyn Simmons'];
names.forEach(name => {
    const key = name.toLowerCase().replace(' ', '_');
    content = content.replace(new RegExp('"' + name + '"', 'g'), 't("' + key + '")');
});

// Update basic strings that repeat
content = content.replace(/"Today"/g, 't("today")');
content = content.replace(/"Tomorrow"/g, 't("tomorrow")');
content = content.replace(/"Checkup"/g, 't("checkup")');
content = content.replace(/"Consultation"/g, 't("consultation")');
content = content.replace(/"Follow-up"/g, 't("follow_up")');
content = content.replace(/"Therapy"/g, 't("therapy")');

content = content.replace(/"Confirmed"/g, 't("confirmed")');
content = content.replace(/"Pending"/g, 't("pending")');
content = content.replace(/"In Progress"/g, 't("in_progress")');
content = content.replace(/"Checked Out"/g, 't("checked_out")');
content = content.replace(/"Canceled"/g, 't("cancelled")');
content = content.replace(/"Upcoming"/g, 't("upcoming")');

fs.writeFileSync('src/pages/Appointments.js', content);
console.log('Appts Strings Replaced.');
