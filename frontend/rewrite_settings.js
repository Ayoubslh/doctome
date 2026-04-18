const fs = require("fs");
const path = require("path");

const content = `import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { User, Bell, Building, Shield, Save } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "../components/common/Skeleton";

const Settings = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");
  const { addToast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    doctor_name: "",
    email: "",
    phone: "",
    specialty: "",
    wilaya: "",
    clinic_name: "",
    gps_link: "",
    opening_time: "",
    closing_time: "",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    // { id: "notifications", label: t("notifications") || "Notifications", icon: Bell },
    { id: "clinic", label: "Clinic Details", icon: Building },
    // { id: "security", label: "Security", icon: Shield },
  ];

  // Fetch doctors and find ours
  const { data: dbDoctor, isLoading } = useQuery({
    queryKey: ["doctorProfile"],
    queryFn: async () => {
      const res = await axios.get(
        "https://tarfkhobz.app.n8n.cloud/webhook-test/doctors"
      );
      const doctors = res.data;
      if (Array.isArray(doctors)) {
        return doctors.find((d) => d.doctor_id === user?.doctor_id);
      }
      return null;
    },
    enabled: !!user?.doctor_id,
  });

  useEffect(() => {
    if (dbDoctor) {
      setFormData({
        doctor_name: dbDoctor.doctor_name || "",
        email: dbDoctor.email || "",
        phone: dbDoctor.phone || "",
        specialty: dbDoctor.specialty || "",
        wilaya: dbDoctor.wilaya || "",
        clinic_name: dbDoctor.clinic_name || "",
        gps_link: dbDoctor.gps_link || "",
        opening_time: dbDoctor.opening_time || "",
        closing_time: dbDoctor.closing_time || "",
      });
    }
  }, [dbDoctor]);

  const saveMutation = useMutation({
    mutationFn: async (updatedData) => {
      const payload = { ...updatedData, doctor_id: user?.doctor_id };
      if (dbDoctor?.id) {
        // Update existing using local n8n ID (assuming its 'id' returned)
        const res = await axios.put(
          \`https://tarfkhobz.app.n8n.cloud/webhook-test/doctors/\${dbDoctor.id}\`,
          payload
        );
        return res.data;
      } else {
        // Create new
        const res = await axios.post(
          "https://tarfkhobz.app.n8n.cloud/webhook-test/doctors",
          payload
        );
        return res.data;
      }
    },
    onSuccess: () => {
      addToast("Settings saved successfully.", "success");
      queryClient.invalidateQueries(["doctorProfile"]);
    },
    onError: (error) => {
      console.error("Failed to save settings:", error);
      addToast("Failed to save settings.", "error");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div>
         <h1 className="text-3xl font-bold text-text-dark mb-6">{t("settings")}</h1>
         <Skeleton className="h-64 rounded-xl w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark mb-6">
        {t("settings") || "Settings"}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <Card noPadding className="overflow-hidden">
            <nav className="flex flex-col py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={\`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left \${
                    activeTab === tab.id
                      ? "bg-primary-light text-primary border-r-2 border-primary"
                      : "text-text-muted hover:bg-border-subtle hover:text-text-dark border-r-2 border-transparent"
                  }\`}>
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content Area */}
        <div className="flex-grow">
          {activeTab === "profile" && (
            <Card>
              <h2 className="text-xl font-semibold text-text-dark mb-6">
                Personal Information
              </h2>
              <form onSubmit={handleSaveChanges}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      name="doctor_name"
                      value={formData.doctor_name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. dr.jenkins@doctome.com"
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. (555) 123-4567"
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Wilaya
                    </label>
                    <input
                      type="text"
                      name="wilaya"
                      value={formData.wilaya}
                      onChange={handleChange}
                      placeholder="e.g. Algiers"
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Specialty
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="e.g. Cardiologist"
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" icon={Save} disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : (t("save_changes") || "Save Changes")}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === "clinic" && (
            <Card>
              <h2 className="text-xl font-semibold text-text-dark mb-6">
                Clinic Information
              </h2>
              <form onSubmit={handleSaveChanges} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark block">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    name="clinic_name"
                    value={formData.clinic_name}
                    onChange={handleChange}
                    placeholder="e.g. Jenkins Cardiology Center"
                    className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark block">
                    GPS Link
                  </label>
                  <input
                    type="url"
                    name="gps_link"
                    value={formData.gps_link}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/..."
                    className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      name="opening_time"
                      value={formData.opening_time}
                      onChange={handleChange}
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      name="closing_time"
                      value={formData.closing_time}
                      onChange={handleChange}
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="primary" icon={Save} disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : "Save Clinic Details"}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
`;

fs.writeFileSync(path.join(__dirname, "src/pages/Settings.js"), content);
console.log("Settings updated");
