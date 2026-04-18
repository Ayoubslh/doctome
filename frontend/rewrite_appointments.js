const fs = require('fs');
const filepath = 'e:/coding/doctome/frontend/src/pages/Appointments.js';
let code = fs.readFileSync(filepath, 'utf8');

// Add react-query and axios imports if not present
if (!code.includes('useQuery')) {
    code = 'import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";\nimport axios from "axios";\n' + code;
}

// Replace useState with useQuery logic
code = code.replace(/const \[appointmentsData, setAppointmentsData\] = useState\(\[[\s\S]*?\]\);/, `const queryClient = useQueryClient();
  const api = "https://tarfkhobz.app.n8n.cloud/webhook";

  const { data: serverAppts = [], isLoading: isFetching } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      try {
        const res = await axios.get(\`\${api}/appointments\`);
        return res.data?.appointments || res.data || [];
      } catch (err) {
        console.error("Failed fetching appointments", err);
        return [];
      }
    }
  });

  const createAptMutation = useMutation({
    mutationFn: (newApt) => axios.post(\`\${api}/doctome-appointment\`, newApt),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      addToast("Appointment created successfully!", "success");
      setIsModalOpen(false);
    }
  });

  const updateAptMutation = useMutation({
    mutationFn: ({ id, updates }) => axios.put(\`\${api}/appointments/\${id}\`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      addToast("Appointment updated", "success");
      setIsModalOpen(false);
    }
  });

  const deleteAptMutation = useMutation({
    mutationFn: (id) => axios.delete(\`\${api}/appointments/\${id}\`),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      addToast("Appointment cancelled", "warning");
      setIsCancelConfirmOpen(false);
      setSelectedAppointment(null);
    }
  });

  // Map backend format to UI format
  const appointmentsData = serverAppts.map(a => ({
    id: a.appointment_id || a._id || Math.random(),
    patient: a.patient_name || a.patient_id || "Unknown Patient",
    time: a.appointment_hour != null ? \`\${String(a.appointment_hour).padStart(2, '0')}:00 - \${String(parseInt(a.appointment_hour)+1).padStart(2, '0')}:00\` : "09:00 AM - 10:00 AM",
    date: a.appointment_date || t("today"),
    type: a.specialty || "Checkup",
    status: a.status || "Pending",
    provider: a.doctor_id || "Dr. Sarah Jenkins"
  }));`);

// Update logic that previously filtered state
code = code.replace(/const filteredAppointments = appointmentsData\.filter\([\s\S]*?\}\);/m, `const filteredAppointments = appointmentsData.filter((app) => {
    if (activeTab === "upcoming")
      return (
        app.status?.toLowerCase() !== "cancelled" &&
        (app.date === t("today") || app.date === t("tomorrow") || ['confirmed', 'pending', 'scheduled'].includes(app.status?.toLowerCase()))
      );
    if (activeTab === "past") return false;
    if (activeTab === "cancelled") return app.status?.toLowerCase() === "cancelled";
    return true;
  });`);

// Update handleSaveAppointment logic
code = code.replace(/const handleSaveAppointment = \(e\) => \{[\s\S]*?setIsModalOpen\(false\);\n  \};/, `const handleSaveAppointment = (e) => {
    e.preventDefault();
    if(!formData.patient || !formData.date || !formData.time) {
       addToast("Please fill all required fields", "warning");
       return;
    }

    if (modalMode === "create") {
      const newAppt = {
        appointment_id: "APT-" + Date.now(),
        patient_name: formData.patient,
        appointment_date: formData.date,
        appointment_hour: parseInt(formData.time.split(':')[0]) || 9,
        specialty: formData.type,
        status: "scheduled",
        doctor_id: formData.provider
      };
      createAptMutation.mutate(newAppt);
    } else {
      const updates = {
        appointment_date: formData.date,
        appointment_hour: parseInt(formData.time.split(':')[0]) || 9,
        specialty: formData.type,
        doctor_id: formData.provider
      };
      updateAptMutation.mutate({ id: selectedAppointment.id, updates });
    }
  };`);

// Update cancel appointment logic
code = code.replace(/const confirmCancelAppointment = \(\) => \{[\s\S]*?\}\);/m, `const confirmCancelAppointment = () => {
    if (selectedAppointment?.id) {
       deleteAptMutation.mutate(selectedAppointment.id);
    }
  };`);

// Append or update skeleton check
code = code.replace(/if \(isLoading\) \{[\s\S]*?\}\n/s, `if (isLoading || isFetching) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-lg" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }
`);

fs.writeFileSync(filepath, code);
console.log('Appointments.js updated successfully');
