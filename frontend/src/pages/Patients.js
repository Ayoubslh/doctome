import React, { useState } from 'react';
import { Skeleton } from "../components/common/Skeleton";
import { useLanguage } from "../context/LanguageContext";
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  FileText,
  MoreVertical,
  SlidersHorizontal,
  Trash2,
  CalendarPlus,
} from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../components/common/Table";
import Dropdown, { DropdownItem } from "../components/common/Dropdown";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTimeSaved } from "../context/TimeSavedContext";

const Patients = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const { t } = useLanguage();
  const { addTimeSaved } = useTimeSaved();
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: serverPatients = [], isFetching } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/patients?search=${searchTerm}`);
      return res.data;
    }
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`http://localhost:3000/patients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      addToast("Patient removed.", "success");
      setPatientToDelete(null);
    }
  });

  const patientsList = serverPatients.map(p => ({
    id: p.patient_id,
    name: p.full_name,
    dob: p.age ? `${p.age} years` : "N/A",
    phone: p.phone || "N/A",
    lastVisit: "N/A",
    status: p.active !== false ? t("active") || "Active" : "Inactive",
    email: p.email || "N/A",
    address: p.wilaya || "N/A",
    insurance: "N/A",
    allergies: p.allergies || "None",
    notes: p.notes || ""
  }));
  


  React.useEffect(() => {
    if (location.state?.editPatient) {
      const ptId = location.state.editPatient;
      const pt = patientsList.find((p) => p.id === ptId) || patientsList[0];
      setSelectedPatient(pt);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, patientsList]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-lg" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  const filteredPatients = patientsList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );



  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Age",
      "Gender",
      "Phone",
      t("last_visit"),
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...patientsList.map(
        (p) => `${p.id},"${p.name}",${p.age || ""},${p.gender || ""},${p.phone},${p.lastVisit},${p.status}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `patients_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    addToast("Patient list exported as CSV.", "success");
  };

  const openPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const openDeleteConfirm = (patient) => {
    setPatientToDelete(patient);
  };

  const confirmDelete = () => {
    if (!patientToDelete) return;
    deleteMutation.mutate(patientToDelete.id);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-text-dark">{t("patients")}</h1>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2 bg-border-subtle px-4 py-2 rounded-md w-full sm:w-80 transition-all focus-within:bg-bg-card focus-within:ring-2 focus-within:ring-primary-light border border-transparent focus-within:border-primary">
            <Search size={18} className="text-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length > 2 && !hasSearched) {
                  addTimeSaved(1);
                  setHasSearched(true);
                }
              }}
              className="bg-transparent border-none outline-none w-full text-sm text-text-dark placeholder:text-text-muted"
              placeholder="Search by name or ID..."
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              {t("export")}
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader
            columns={[
              "Patient Info",
              "ID",
              t("contact"),
              t("last_visit"),
              "Status",
              "",
            ]}
          />
          <TableBody>
            {filteredPatients.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-semibold text-primary text-sm shrink-0">
                      {p.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-dark">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        DOB: {p.dob}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-text-main">
                    {p.id}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-text-muted">{p.phone}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-text-muted">{p.lastVisit}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={p.status === t("active") || p.status === "Active" ? "success" : "neutral"}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={FileText}
                      className="px-2"
                      onClick={() => openPatientDetails(p)}
                      title="View Details"
                    />
                    
                    {/* Desktop specific buttons */}
                    <div className="hidden md:flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={CalendarPlus}
                        className="px-2 text-primary"
                        onClick={() => navigate("/appointments", { state: { newAppointment: true, patientName: p.name } })}
                        title="Schedule Appointment"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        className="px-2 text-danger"
                        onClick={() => openDeleteConfirm(p)}
                        title="Delete Record"
                      />
                    </div>

                    {/* Mobile specific dropdown */}
                    <div className="md:hidden">
                       <Dropdown align="right" trigger={<Button variant="ghost" size="sm" icon={MoreVertical} className="px-2" />}>
                         <DropdownItem onClick={() => navigate("/appointments", { state: { newAppointment: true, patientName: p.name } })}>
                           Schedule Appointment
                         </DropdownItem>
                         <DropdownItem danger icon={Trash2} onClick={() => openDeleteConfirm(p)}>
                           Delete Record
                         </DropdownItem>
                       </Dropdown>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-text-muted">
            No patients found matching "{searchTerm}"
          </div>
        )}
      </Card>



      <Modal
        isOpen={Boolean(selectedPatient)}
        onClose={() => setSelectedPatient(null)}
        title={
          selectedPatient ? `${selectedPatient.name} Record` : "Patient Record"
        }
        maxWidthClassName="max-w-2xl"
        footer={
          <Button variant="ghost" onClick={() => setSelectedPatient(null)}>
            Close
          </Button>
        }>
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-text-dark">
                  {selectedPatient.name}
                </h3>
                <p className="text-sm text-text-muted mt-1">
                  Patient ID {selectedPatient.id}
                </p>
              </div>
              <Badge variant={selectedPatient.status === t("active") || selectedPatient.status === "Active" ? "success" : "neutral"}>
                {selectedPatient.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-border-light bg-bg-main/40 p-4">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Date of Birth</p>
                <p className="font-semibold text-text-dark">{selectedPatient.dob}</p>
              </div>
              <div className="rounded-lg border border-border-light bg-bg-main/40 p-4">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t("last_visit")}</p>
                <p className="font-semibold text-text-dark">{selectedPatient.lastVisit}</p>
              </div>
              <div className="rounded-lg border border-border-light bg-bg-main/40 p-4">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Phone</p>
                <p className="font-semibold text-text-dark">{selectedPatient.phone}</p>
              </div>
              <div className="rounded-lg border border-border-light bg-bg-main/40 p-4">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Email</p>
                <p className="font-semibold text-text-dark">{selectedPatient.email}</p>
              </div>
            </div>
            
            <div className="space-y-3">
               <p className="text-sm font-semibold text-text-dark">Address</p>
               <p className="text-sm text-text-muted bg-bg-main/50 border border-border-light rounded-lg p-4">
                 {selectedPatient.address}
               </p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(patientToDelete)}
        title="Delete Patient Record"
        message={
          patientToDelete
            ? `Are you sure you want to delete ${patientToDelete.name}'s record? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Record"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setPatientToDelete(null)}
      />
    </div>
  );
};

export default Patients;

