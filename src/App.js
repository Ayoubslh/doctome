import React, { useState } from 'react';
import './App.css';
import { 
  Activity, 
  Calendar, 
  Users, 
  TrendingUp, 
  Search, 
  Bell, 
  Settings, 
  ChevronDown,
  LayoutDashboard,
  UserCheck,
  BarChart3,
  CloudRain,
  Clock,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const chartData = [
    { name: 'Mon', completed: 42, noShow: 12 },
    { name: 'Tue', completed: 48, noShow: 8 },
    { name: 'Wed', completed: 35, noShow: 15 },
    { name: 'Thu', completed: 50, noShow: 9 },
    { name: 'Fri', completed: 55, noShow: 5 },
  ];

  const patients = [
    { id: 1, name: 'Eleanor Pena', demo: 'F • 34', time: '09:00 AM', factors: ['Raining', 'History: High'], prob: 85, status: 'high' },
    { id: 2, name: 'Cody Fisher', demo: 'M • 42', time: '09:30 AM', factors: ['Traffic', 'New Patient'], prob: 62, status: 'medium' },
    { id: 3, name: 'Leslie Alexander', demo: 'F • 28', time: '10:00 AM', factors: ['Reminded', 'Local'], prob: 12, status: 'low' },
    { id: 4, name: 'Ralph Edwards', demo: 'M • 55', time: '10:45 AM', factors: ['Snow Alert', 'History: Avg'], prob: 78, status: 'high' },
    { id: 5, name: 'Wade Warren', demo: 'M • 61', time: '11:15 AM', factors: ['Confirmed by SMS'], prob: 5, status: 'low' },
    { id: 6, name: 'Jane Cooper', demo: 'F • 45', time: '12:00 PM', factors: ['History: Low', 'Local'], prob: 18, status: 'low' },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={20} />
          </div>
          <div className="brand-text">
            Doct<span>ome</span>
          </div>
        </div>

        <nav className="nav-menu">
          <div className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveMenu('dashboard')}>
            <LayoutDashboard className="nav-icon" />
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeMenu === 'appointments' ? 'active' : ''}`} onClick={() => setActiveMenu('appointments')}>
            <Calendar className="nav-icon" />
            <span>Appointments</span>
          </div>
          <div className={`nav-item ${activeMenu === 'patients' ? 'active' : ''}`} onClick={() => setActiveMenu('patients')}>
            <Users className="nav-icon" />
            <span>Patients</span>
          </div>
          <div className={`nav-item ${activeMenu === 'analytics' ? 'active' : ''}`} onClick={() => setActiveMenu('analytics')}>
            <BarChart3 className="nav-icon" />
            <span>Analytics</span>
          </div>
          <div className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`} onClick={() => setActiveMenu('settings')}>
            <Settings className="nav-icon" />
            <span>Settings</span>
          </div>
        </nav>

        <div className="user-profile">
          <div className="avatar">Dr</div>
          <div className="user-info">
            <span className="user-name">Dr. Sarah Jenkins</span>
            <span className="user-role">Cardiologist</span>
          </div>
          <LogOut size={16} className="nav-icon" style={{marginLeft: 'auto', color: 'var(--text-muted)'}} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input type="text" className="search-input" placeholder="Search patients or appointments..." />
          </div>
          <div className="header-actions">
            <button className="action-btn">
              <Bell size={20} />
              <span className="badge"></span>
            </button>
            <div className="user-profile" style={{ border: 'none', padding: 0 }}>
              <div className="avatar" style={{width: 32, height: 32}}>SJ</div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="content-scroll">
          <h1 className="dashboard-title">Overview</h1>
          
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span>Total Appointments</span>
                <div className="stat-icon primary"><Calendar size={20} /></div>
              </div>
              <div className="stat-value">124</div>
              <div className="stat-footer">
                <span className="trend-up good">+12%</span> from yesterday
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span>Predicted No-Shows</span>
                <div className="stat-icon danger"><AlertCircle size={20} /></div>
              </div>
              <div className="stat-value">18</div>
              <div className="stat-footer">
                <span className="trend-up">+4%</span> alerts increase
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span>Confirmed Visits</span>
                <div className="stat-icon success"><UserCheck size={20} /></div>
              </div>
              <div className="stat-value">92</div>
              <div className="stat-footer">
                <span className="trend-up good">+8%</span> since morning
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span>Clinic Efficiency</span>
                <div className="stat-icon warning"><TrendingUp size={20} /></div>
              </div>
              <div className="stat-value">86%</div>
              <div className="stat-footer">
                <span className="trend-up good">+2%</span> after overbooking
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="dashboard-main-grid">
            {/* Left Panel: High Risk Patients Table */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Today's Risk Assessment</h2>
                <span className="panel-action">View Full Schedule</span>
              </div>
              <div className="risk-table-container">
                <table className="risk-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Time</th>
                      <th>Risk Factors</th>
                      <th>No-Show Prob.</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="patient-cell">
                            <div className="patient-avatar">
                              {p.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="patient-details">
                              <span className="patient-name">{p.name}</span>
                              <span className="patient-demo">{p.demo}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="time-cell">{p.time}</span>
                        </td>
                        <td>
                          <div className="factors-cell">
                            {p.factors.map(f => <span className="factor-tag" key={f}>{f}</span>)}
                          </div>
                        </td>
                        <td>
                          <span className={`prob-badge ${p.status}`}>
                            {p.prob}%
                          </span>
                        </td>
                        <td>
                          {p.status === 'high' ? (
                            <button className="action-btn-sm primary">Send Alert</button>
                          ) : (
                            <button className="action-btn-sm">Details</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel: Analytics Sidebar within main grid */}
            <div className="right-panels" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              
              {/* Insight Panel */}
              <div className="panel" style={{flexShrink: 0}}>
                <div className="panel-header" style={{marginBottom: '16px'}}>
                  <h2 className="panel-title">Active Insights</h2>
                </div>
                
                <div className="insight-item">
                  <div className="insight-icon history">
                    <HistoryIcon size={18} />
                  </div>
                  <div className="insight-content">
                    <span className="insight-title">History Alert</span>
                    <span className="insight-desc">3 patients have missed =2 appointments. Consider overbooking double slots.</span>
                  </div>
                </div>

                <div className="insight-item">
                  <div className="insight-icon weather">
                    <CloudRain size={18} />
                  </div>
                  <div className="insight-content">
                    <span className="insight-title">Weather Impact</span>
                    <span className="insight-desc">Heavy rain forecast at 2:00 PM. Expect 15% increase in cancellations.</span>
                  </div>
                </div>
              </div>

              {/* Chart Panel */}
              <div className="panel" style={{flexGrow: 1}}>
                <div className="panel-header" style={{margin: 0}}>
                  <h2 className="panel-title">Weekly Trend</h2>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorNoShow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                        itemStyle={{ fontSize: '13px' }}
                        labelStyle={{ color: 'var(--text-dark)', fontWeight: 'bold', marginBottom: '8px' }}
                      />
                      <Area type="monotone" dataKey="noShow" stroke="var(--danger)" fillOpacity={1} fill="url(#colorNoShow)" />
                      <Area type="monotone" dataKey="completed" stroke="var(--success)" fillOpacity={1} fill="url(#colorComp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function HistoryIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

export default App;
