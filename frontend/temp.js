const fs = require('fs');

const apptFile = 'frontend/src/pages/Appointments.js';
if (fs.existsSync(apptFile)) {
  let content = fs.readFileSync(apptFile, 'utf-8');
  content = content.replace("import axios from 'axios';", "import { useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from '../hooks/useAppointments';\nimport axios from 'axios';");
  
  content = content.replace("const [appointmentsData, setAppointmentsData] = useState([", "const { data: serverAppts = [], isLoading: isFetching } = useAppointments();\n  const createMutation = useCreateAppointment();\n  const updateMutation = useUpdateAppointment();\n  const deleteMutation = useDeleteAppointment();\n  \n  /* const [appointmentsData, setAppointmentsData] = useState([");
  
  content = content.replace("]);\n\n  React.useEffect(() => {", "]);\n*/\n\n  // Map backend format to UI format\n  const appointmentsData = serverAppts.map(a => ({\n    id: a.appointment_id || a._id || Math.random(),\n    patient: a.patient_name || a.patient_id || \"Unknown Patient\",\n    time: a.appointment_hour != null ? `${String(a.appointment_hour).padStart(2, '0')}:00 - ${String(parseInt(a.appointment_hour)+1).padStart(2, '0')}:00` : \"09:00 AM - 10:00 AM\",\n    date: a.appointment_date || t(\"today\"),\n    type: a.specialty || \"Checkup\",\n    status: a.status || \"Pending\",\n    provider: a.doctor_id || \"Dr. Sarah Jenkins\"\n  }));\n\n  React.useEffect(() => {");

  // Modify loading state to include isFetching
  content = content.replace("if (isLoading) {", "if (isLoading || isFetching) {");
  
  fs.writeFileSync(apptFile, content);
}

const ptsFile = 'frontend/src/pages/Patients.js';
if (fs.existsSync(ptsFile)) {
  let content = fs.readFileSync(ptsFile, 'utf-8');
  content = content.replace("import { useTimeSaved } from \"../context/TimeSavedContext\";", "import { useTimeSaved } from \"../context/TimeSavedContext\";\nimport { useDoctors, useCreateDoctor, useUpdateDoctor, useDeleteDoctor } from \"../hooks/useDoctors\";");
  
  content = content.replace("const [patientsList, setPatientsList] = useState([", "const { data: serverPatients = [], isLoading: isFetching } = useDoctors();\n  const createMutation = useCreateDoctor();\n  const updateMutation = useUpdateDoctor();\n  const deleteMutation = useDeleteDoctor();\n\n  /* const [patientsList, setPatientsList] = useState([");
  
  content = content.replace("]);\n\n  const [isAddPatientOpen", "]);\n  */\n  \n  const patientsList = serverPatients.map(p => ({\n      id: p.patient_id || p.id || Math.random().toString(),\n      name: p.full_name || p.name || \"Unknown\",\n      dob: p.age ? `${p.age} years` : \"N/A\",\n      gender: p.gender || \"N/A\",\n      phone: p.phone || \"N/A\",\n      lastVisit: p.lastVisit || \"N/A\",\n      status: p.status || \"Active\",\n      demo: p.demo || \"\"\n  }));\n\n  const [isAddPatientOpen");
  
  content = content.replace("if (isLoading) {", "if (isLoading || isFetching) {");
  
  fs.writeFileSync(ptsFile, content);
}
