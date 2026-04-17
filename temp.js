import React, { useState } from "react";
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
  const { addToast } = useToast();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.newAppointment) {
      setModalMode("create");
      setSelectedAppointment({ patient: location.state.patientName });
      setIsModalOpen(true);
      // clean state not to reopen on reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const appointmentsData = [
    {
      id: 1,
      patient: t("eleanor_pena"),
      time: "09:00 AM - 09:30 AM",
      date: t("today"),
      type: t("checkup"),
      status: t("confirmed"),
      provider: "Dr. Sarah Jenkins",
    },
    {
      id: 2,
      patient: t("cody_fisher"),
      time: "09:30 AM - 10:15 AM",
      date: t("today"),
      type: t("consultation"),
      status: t("pending"),
      provider: "Dr. Sarah Jenkins",
    },
    {
      id: 3,
      patient: t("leslie_alexander"),
      time: "10:30 AM - 11:00 AM",
      date: t("today"),
      type: t("follow_up"),
      status: t("confirmed"),
      provider: "Dr. Michael Chen",
    },
    {
      id: 4,
      patient: t("ralph_edwards"),
      time: "11:15 AM - 12:00 PM",
      date: t("tomorrow"),
      type: t("checkup"),
      status: t("confirmed"),
      provider: "Dr. Sarah Jenkins",
    },
    {
      id: 5,
      patient: t("jane_cooper"),
      time: "02:00 PM - 02:45 PM",
      date: t("tomorrow"),
      type: t("consultation"),
      status: "Cancelled",
      provider: "Dr. Michael Chen",
    },
  ];

  const filteredAppointments = appointmentsData.filter((app) => {
    if (activeTab === "upcoming")
      return (
        app.status !== "Cancelled" &&
        (app.date === t("today") || app.date === t("tomorrow"))
      );
    if (activeTab === "past") return false; // mock empty past
    if (activeTab === "cancelled") return app.status === "Cancelled";
    return true;
  });

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    addToast(
      modalMode === "create"
        ? "Appointment created successfully!"
        : `Appointment updated for ${selectedAppointment?.patient || "the selected patient"}.`,
    );
  };

  const openModifyModal = (appointment = null) => {
    setModalMode("modify");
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const requestCancelAppointment = () => {
    setIsCancelConfirmOpen(true);
  };

  const confirmCancelAppointment = () => {
    setIsCancelConfirmOpen(false);
    setIsModalOpen(false);
    addToast(
      `Appointment for ${selectedAppointment?.patient || "the selected patient"} cancelled.`,
      "warning",
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
            {["upcoming", "past", "cancelled"].map((tab) => (
              <button
                key={tab}
                className={`pb-4 border-b-2 font-semibold text-sm capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text-dark"
                }`}
                onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                icon={CalendarIcon}
                onClick={() =>
                  document.getElementById("filter-date-picker").showPicker?.()
                }>
                Select Date
              </Button>
              <input
                id="filter-date-picker"
                type="date"
                className="absolute opacity-0 w-full h-full inset-0 pointer-events-none cursor-pointer"
                onChange={(e) =>
                  addToast(`Filtered for ${e.target.value}`, "success")
                }
              />
            </div>
            <Dropdown
              trigger={
                <Button variant="outline" size="sm" icon={Filter}>
                  Filters
                </Button>
              }>
              <DropdownItem>Show All Providers</DropdownItem>
              <DropdownItem>Dr. Sarah Jenkins</DropdownItem>
              <DropdownItem>Dr. Michael Chen</DropdownItem>
              <div className="h-px bg-border-light my-1" />
              <DropdownItem>Pending Only</DropdownItem>
            </Dropdown>
          </div>
        </div>

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
                      app.status === t("confirmed")
                        ? "success"
                        : app.status === t("pending")
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
      </Card>

      {/* Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === "create"
            ? "Schedule Appointment"
            : `${t("modify")} Appointment`
        }
        maxWidthClassName="max-w-2xl"
        footer={
          <>
            {modalMode === "modify" && (
              <Button
                variant="ghost"
                className="text-danger mr-auto"
                onClick={requestCancelAppointment}>
                Cancel Appointment
              </Button>
            )}
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveAppointment}>
              {modalMode === "create" ? "Schedule" : "Save Changes"}
            </Button>
          </>
        }>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">
              Patient Name
            </label>
            <input
              type="text"
              defaultValue={
                modalMode === "modify"
                  ? selectedAppointment?.patient || t("eleanor_pena")
                  : selectedAppointment?.patient || ""
              }
              placeholder="Search existing patients..."
              className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">
                Provider
              </label>
              <select className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-dark">
                <option>Dr. Sarah Jenkins</option>
                <option>Dr. Michael Chen</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">
                Appointment Type
              </label>
              <select className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-dark">
                <option>Checkup</option>
                <option>Consultation</option>
                <option>Follow-up</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">Date</label>
              <input
                type="date"
                className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-muted"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">Time</label>
              <input
                type="time"
                className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">
              Notes (Optional)
            </label>
            <textarea
              rows="3"
              className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary custom-scrollbar resize-none"></textarea>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        title="Cancel Appointment"
        message={
          selectedAppointment
            ? `Are you sure you want to cancel the appointment for ${selectedAppointment.patient}?`
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

