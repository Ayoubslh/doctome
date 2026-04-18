import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import {
  Calendar,
  AlertCircle,
  UserCheck,
  TrendingUp,
  CloudRain,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import RiskTable from "../components/dashboard/RiskTable";
import InsightCard from "../components/dashboard/InsightCard";
import TrendChart from "../components/dashboard/TrendChart";
import Card from "../components/common/Card";
import { Skeleton } from "../components/common/Skeleton";

const api = "https://tarfkhobz.app.n8n.cloud";

const Dashboard = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  const [apptsData, setApptsData] = useState(null);
  const [patientsData, setPatientsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [apptsRes, patientsRes] = await Promise.all([
          axios.get(`${api}/webhook/dashboard/appointments`, config),
          axios.get(`${api}/webhook/dashboard/patients`, config)
        ]);

        if (apptsRes.data && apptsRes.data.success) {
          setApptsData(apptsRes.data.dashboard);
        }
        if (patientsRes.data && patientsRes.data.success) {
          setPatientsData(patientsRes.data.dashboard);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  const chartData = [
    { name: t("mon"), completed: 42, noShow: 12 },
    { name: t("tue"), completed: 48, noShow: 8 },
    { name: t("wed"), completed: 35, noShow: 15 },
    { name: t("thu"), completed: 50, noShow: 9 },
    { name: t("fri"), completed: 55, noShow: 5 },
  ];

  const patients = [
    {
      id: 1,
      name: t("eleanor_pena"),
      demo: t("demo_f34"),
      time: t("time_0900"),
      factors: [t("fac_raining"), t("fac_hist_high")],
      notes: t("note_eleanor"),
      prob: 85,
      status: "high",
    },
    {
      id: 2,
      name: t("cody_fisher"),
      demo: t("demo_m42"),
      time: t("time_0930"),
      factors: [t("fac_traffic"), t("fac_new")],
      notes: t("note_cody"),
      prob: 62,
      status: "medium",
    },
    {
      id: 3,
      name: t("leslie_alexander"),
      demo: t("demo_f28"),
      time: t("time_1000"),
      factors: [t("fac_reminded"), t("fac_local")],
      notes: t("note_leslie"),
      prob: 12,
      status: "low",
    },
    {
      id: 4,
      name: t("ralph_edwards"),
      demo: t("demo_m55"),
      time: t("time_1045"),
      factors: [t("fac_snow"), t("fac_hist_avg")],
      notes: t("note_ralph"),
      prob: 78,
      status: "high",
    },
    {
      id: 5,
      name: t("wade_warren"),
      demo: t("demo_m61"),
      time: t("time_1115"),
      factors: [t("fac_sms")],
      notes: t("note_wade"),
      prob: 5,
      status: "low",
    },
    {
      id: 6,
      name: t("jane_cooper"),
      demo: t("demo_f45"),
      time: t("time_1200"),
      factors: [t("fac_hist_low"), t("fac_local")],
      notes: t("note_jane"),
      prob: 18,
      status: "low",
    },
  ];

  const calcTrend = (today, yesterday) => {
    if (today == null || yesterday == null) return "0";
    const diff = today - yesterday;
    return diff > 0 ? `+${diff}` : diff.toString();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark mb-6">
        {t("overview")}
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title={t("total_appointments")}
              value={apptsData?.today?.total?.toString() || "0"}
              icon={Calendar}
              trend={calcTrend(apptsData?.today?.total, apptsData?.yesterday?.total)}
              trendLabel={t("from_yesterday")}
              colorClass="primary"
            />
            <StatCard
              title={t("predicted_no_shows")}
              value={apptsData?.today?.no_shows?.toString() || "0"}
              icon={AlertCircle}
              trend={calcTrend(apptsData?.today?.no_shows, apptsData?.yesterday?.no_shows)}
              trendLabel={t("from_yesterday")}
              colorClass="danger"
            />
            <StatCard
              title={t("confirmed_visits")}
              value={apptsData?.today?.confirmed?.toString() || "0"}
              icon={UserCheck}
              trend={calcTrend(apptsData?.today?.confirmed, apptsData?.yesterday?.confirmed)}
              trendLabel={t("from_yesterday")}
              colorClass="success"
            />
            <StatCard
              title="Active Patients"
              value={patientsData?.total_active?.toString() || "0"}
              icon={TrendingUp}
              trend={"+" + (patientsData?.new_this_week || "0")}
              trendLabel="this week"
              colorClass="info"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Assessment Table */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-dark">
              {t("todays_risk_assessment")}
            </h2>
            <Link
              to="/appointments"
              className="text-primary text-sm font-medium hover:underline transition-colors hover:text-[#0284c7]">
              {t("view_full_schedule")}
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <RiskTable patients={patients} />
          )}
        </Card>

        {/* Right Sidebar: Insights & Analytics */}
        <div className="space-y-6">
          {/* Insights Panel */}
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text-dark">
                {t("active_insights")}
              </h2>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <>
                <InsightCard
                  title={t("history_alert")}
                  description="3 patients have missed &ge;2 appointments. Consider overbooking double slots."
                  icon={HistoryIcon}
                  type="history"
                />
                <InsightCard
                  title={t("weather_impact")}
                  description={t("weather_desc")}
                  icon={CloudRain}
                  type="weather"
                />
              </>
            )}
          </Card>

          {/* Chart Panel */}
          <Card className="flex flex-col min-h-[300px]">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-text-dark">
                {t("weekly_trend")}
              </h2>
            </div>
            {isLoading ? (
              <Skeleton className="h-48 w-full mt-4" />
            ) : (
              <TrendChart data={chartData} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const HistoryIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

export default Dashboard;
