const fs = require('fs');

const file = 'src/pages/Analytics.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add useState import
content = content.replace('import React from "react";', 'import React, { useState } from "react";');

// 2. Add state
const stateInjection = `  const { addToast } = useToast();
  const [timeFilter, setTimeFilter] = useState("This Week");

  const chartDataWeek = [
    { name: "Mon", completed: 42, noShow: 12 },
    { name: "Tue", completed: 48, noShow: 8 },
    { name: "Wed", completed: 35, noShow: 15 },
    { name: "Thu", completed: 50, noShow: 9 },
    { name: "Fri", completed: 55, noShow: 5 },
  ];

  const chartDataMonth = [
    { name: "Wk1", completed: 150, noShow: 30 },
    { name: "Wk2", completed: 180, noShow: 25 },
    { name: "Wk3", completed: 165, noShow: 40 },
    { name: "Wk4", completed: 190, noShow: 20 },
  ];

  const chartDataYear = [
    { name: "Q1", completed: 600, noShow: 120 },
    { name: "Q2", completed: 750, noShow: 90 },
    { name: "Q3", completed: 800, noShow: 150 },
    { name: "Q4", completed: 950, noShow: 80 },
  ];

  const chartData = timeFilter === "This Year" ? chartDataYear : timeFilter === "This Month" ? chartDataMonth : chartDataWeek;`;

content = content.replace(/const chartData = \[\s*\{[\s\S]*?\];/m, stateInjection.substring(stateInjection.indexOf("  const chartDataWeek")));
content = content.replace('  const { addToast } = useToast();', `  const { addToast } = useToast();\n  const [timeFilter, setTimeFilter] = useState("This Week");\n`);

// 3. Update select to use state
content = content.replace(
  '<select className="bg-bg-main border border-border-light rounded-md text-sm px-3 py-1.5 outline-none text-text-dark">',
  '<select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="bg-bg-main border border-border-light rounded-md text-sm px-3 py-1.5 outline-none text-text-dark">'
);

fs.writeFileSync(file, content);
