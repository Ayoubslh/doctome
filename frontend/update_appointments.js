const fs = require('fs');

const content = `import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Calendar as CalendarIcon, Clock, Plus, Filter } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Dropdown, { DropdownItem } from "../components/common/Dropdown";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import { useLocation } from "react-router-dom";

const Appointments = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'modify'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    patient: "",
    provider: "Dr. Sarah Jenkins",
    type: "Checkup",
    date: "",
    time: "09:00",
    status: "Pending",
  });

  const { addToast } = useToast();
  const location = useLocation();

  const [appointmentsData, setAppointmentsData] = useState([
    { id: 1, patient: t("eleanor_pena"), time: "09:00 AM - 09:30 AM", date: t("today"), type: t("checkup"), status: t("confirmed"), provider: "Dr. Sarah Jenkins" },
    { id: 2, patient: t("cody_fisher"), time: "09:30 AM - 10:15 AM", date: t("today"), type: t("consultation"), status: t("pending"), provider: "Dr. Sarah Jenkins" },
    { id: 3, patient: t("leslie_alexander"), time: "10:30 AM - 11:00 AM", date: t("today"), type: t("follow_up"), status: t("confirmed"), provider: "Dr. Michael Chen" },
    { id: 4, patient: t("ralph_edwards"), time: "11:15 AM - 12:00 PM", date: t("tomorrow"), type: t("checkup"), status: t("confirmed"), provider: "Dr. Sarah Jenkins" },
    { id: 5, patient: t("jane_cooper"), time: "02:00 PM - 02:45 PM", date: t("tomorrow"), type: t("consultation"), status: "Cancelled", provider: "Dr. Michael Chen" },
  ]);

  React.useEffect(() => {
    if (location.state?.newAppointment) {
      setModalMode("create");
      setFormData(prev => ({...prev, patient: location.state.patientName}));
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredAppointments = appointmentsData.filter((app) => {
    if (activeTab === "upcoming")
      return (
        app.status !== "Cancelled" && app.status !== "cancelled" &&
        (app.date === t("today") || app.date === t("tomorrow") || app.status === t("confirmed") || app.status === t("pending") || app.status === "Pending" || app.status === "Confirmed")
      );
    if (activeTab === "past") return false;
    if (activeTab === "cancelled") return app.status === "Cancelled" || app.status === "cancelled";
    return true;
  });

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    if(!formData.patient || !formData.date || !formData.time) {
       addToast("Please fill all required fields", "warning");
       return;
    }

    if (modalMode === "create") {
      const newAppt = {
        id: Date.now(),
        patient: formData.patient,
        time: formData.time,
        date: formData.date,
        type: formData.type,
        status: "Pending",
        provider: formData.provider
      };
      setAppointmentsData([...appointmentsData, newAppt]);
      addToast("Appointment created successfully!");
    } else {
      setAppointmentsData(appointmentsData.map(a => a.id === selectedAppointment.id ? { ...a, ...formData } : a));
      addToast(\`Appointment updated for \${formData.patient}.\`);
    }
    setIsModalOpen(false);
  };

  const openModifyModal = (appointment = null) => {
    setModalMode("modify");
    setSelectedAppointment(appointment);
    setFormData({
      patient: appointment.patient,
      provider: appointment.provider,
      type: appointment.type,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedAppointment(null);
    setFormData({ patient: "", provider: "Dr. Sarah Jenkins", type: "Checkup", date: "", time: "09:00", status: "Pending" });
    setIsModalOpen(true);
  };

  const requestCancelAppointment = () => {
    setIsCancelConfirmOpen(true);
  };

  const confirmCancelAppointment = () => {
    setIsCancelConfirmOpen(false);
    setIsModalOpen(false);
    setAppointmentsData(appointmentsData.map(a => a.id === selectedAppointment?.id ? { ...a, status: "Cancelled" } : a));
    addToast(\`Appointment for \${selectedAppointment?.patient || "the selected patient"} cancelled.\`, "warning");
  };

  const renderCalendarView = () => {
    const days = [];
    for(let i = 1; i <= 31; i++) {
       const isBooked = i % 8 === 0;
       const isFull = i % 5 === 0;
       let statusColor = "bg-success/20 text-success border-success/30"; // Free
       if (isFull) {
           statusColor = "bg-danger/20 text-danger border-danger/30"; // Full
       } else if (isBooked) {
           statusColor = "bg-warning/20 text-warning border-warning/30"; // Partially booked
       }
       days.push(
         <div key={i} className={\`p-4 rounded-lg border flex flex-col items-center justify-center font-bold shadow-sm \${statusColor}\`}>
            <span>{i}</span>
         </div>
       );
    }
    return (
       <div className="grid grid-cols-7 gap-4">
           {days}
       </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-text-dark">
          {t("appointments")}
        </h1>
        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          New Appointment
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-border-light pb-4">
          <div className="flex gap-6 w-full overflow-x-auto">
            {["upcoming", "past", "cancelled", "calendar view"].map((tab) => (
              <button
                key={tab}
                className={\`pb-4 border-b-2 font-semibold text-sm capitalize transition-all whitespace-nowrap \${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text-dark"
                }\`}
                onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "calendar view" ? (
           <div className="p-4 bg-bg-main rounded-xl border border-border-light">
             <div className="flex items-center gap-4 mb-4 text-sm font-medium text-text-muted justify-end">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-success"></span> Available</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-warning"></span> Partially Booked</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-danger"></span> Fully Booked</span>
             </div>
             {renderCalendarView()}
           </div>
        ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-border-light hover:bg-border-subtle transition-all">
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-dark text-lg">
                    {app.patient}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {app.time}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border-light"></span>
                    <span>{app.date}</span>
                    <span className="w-1 h-1 rounded-full bg-border-light"></span>
                    <span>{app.provider}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-4">
                <div className="flex gap-2 shrink-0">
                  <Badge variant="neutral">{app.type}</Badge>
                  <Badge
                    variant={
                      app.status === t("confirmed") || app.status === "Confirmed"
                        ? "success"
                        : app.status === t("pending") || app.status === "Pending"
                          ? "warning"
                          : "danger"
                    }>
                    {app.status}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModifyModal(app)}>
                  {t("modify")}
                </Button>
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-border-subtle rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                <CalendarIcon size={32} />
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-1">
                No {activeTab} appointments
              </h3>
              <p className="text-text-muted text-sm">
                There are no appointments to show in this view.
              </p>
            </div>
          )}
        </div>
        )}
      </Card>

      {/* Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === "create"
            ? "Schedule Appointment"
            : \`\${t("modify")} Appointment\`
        }
        maxWidthClassName="max-w-2xl"
        footer={
          <div className="flex items-center w-full">
            {modalMode === "modify" && (
              <Button
                variant="ghost"
                className="text-danger mr-auto"
                onClick={requestCancelAppointment}>
                Cancel Appointment
              </Button>
            )}
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveAppointment}>
                {modalMode === "create" ? "Schedule" : "Save Changes"}
              </Button>
            </div>
          </div>
        }>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">
              Patient Name
            </label>
            <input
              type="text"
              value={formData.patient}
              onChange={(e) => setFormData({...formData, patient: e.target.value})}
              placeholder="Search existing patients..."
              className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-dark"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">
                Provider
              </label>
              <select 
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
                className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-dark">
                <option>Dr. Sarah Jenkins</option>
                <option>Dr. Michael Chen</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">
                Appointment Type
              </label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-dark">
                <option>Checkup</option>
                <option>Consultation</option>
                <option>Follow-up</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-dark">
                <CalendarIcon size={16} /> Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                onClick={(e) => e.target.showPicker?.()}
                className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-dark cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-dark">
                <Clock size={16} /> Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                onClick={(e) => e.target.showPicker?.()}
                className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-dark cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">
              Notes (Optional)
            </label>
            <textarea
              rows="3"
              className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary custom-scrollbar resize-none text-text-dark"></textarea>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        title="Cancel Appointment"
        message={
          selectedAppointment
            ? \`Are you sure you want to cancel the appointment for \${selectedAppointment.patient}?\`
            : "Are you sure you want to cancel this appointment?"
        }
        confirmLabel="Cancel Appointment"
        cancelLabel="Keep Appointment"
        tone="danger"
        onConfirm={confirmCancelAppointment}
        onCancel={() => setIsCancelConfirmOpen(false)}
      />
    </div>
  );
};

export default Appointments;
`

fs.writeFileSync('src/pages/Appointments.js', content, 'utf8');