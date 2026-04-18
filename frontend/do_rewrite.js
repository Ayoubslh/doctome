const fs = require('fs');
const filepath = 'e:/coding/doctome/frontend/src/pages/Patients.js';
let code = fs.readFileSync(filepath, 'utf8');

if (!code.includes('useQuery')) {
    code = 'import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";\nimport axios from "axios";\n' + code;
}

code = code.replace(/const \[patientsList, setPatientsList\] = useState\(\[[\s\S]*?\]\);/, `const { data: serverPatients = [], isFetching } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      const res = await axios.get(\`http://localhost:3000/patients?search=\${searchTerm}\`);
      return res.data;
    }
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(\`http://localhost:3000/patients/\${id}\`),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      addToast("Patient removed.", "success");
      setPatientToDelete(null);
    }
  });

  const patientsList = serverPatients.map(p => ({
    id: p.patient_id,
    name: p.full_name,
    dob: p.age ? \`\${p.age} years\` : "N/A",
    phone: p.phone || "N/A",
    lastVisit: "N/A",
    status: p.active !== false ? t("active") || "Active" : "Inactive",
    email: p.email || "N/A",
    address: p.wilaya || "N/A",
    insurance: "N/A",
    allergies: p.allergies || "None",
    notes: p.notes || ""
  }));`);

// Update logic that previously set state
code = code.replace(/setPatientsList\(\[newPt, ...patientsList\]\);/, "queryClient.invalidateQueries(['patients']);");
code = code.replace(/setPatientsList\(patientsList.filter\(\(p\) => p\.id !== patientToDelete\.id\)\);/, "deleteMutation.mutate(patientToDelete.id);");

code = code.replace(/const filteredPatients = patientsList\.filter\([\s\S]*?\);/, 'const filteredPatients = patientsList;');

// Fix skeleton checks
code = code.replace(/if \(isLoading\) return \(.*?\);\s*\n/s, `if (isLoading) return (<div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6"><div className="flex justify-between items-center"><Skeleton width="200px" height="40px" /></div><Card><Skeleton width="100%" height="400px" /></Card></div>);\n`);


fs.writeFileSync(filepath, code);
console.log("Patients rewritten");
