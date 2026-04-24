import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, QrCode, BarChart3, MessageSquare, LogOut } from 'lucide-react';
import TeacherAttendancePage from './teacher/TeacherAttendancePage';
import TeacherSummaryPage from './teacher/TeacherSummaryPage';
import TeacherContactAdminPage from './teacher/TeacherContactAdminPage';

function TeacherDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { to: 'attendance', label: 'QR Attendance', icon: QrCode },
    { to: 'summary', label: 'Summary', icon: BarChart3 },
    { to: 'contact-admin', label: 'Contact Admin', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] text-white flex">

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-50
          top-0 left-0 h-screen
          w-64
          bg-[#0f172a]/95 backdrop-blur-xl
          border-r border-white/10
          p-5 flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard size={20} className="text-cyan-400" />
          <h2 className="text-lg font-semibold">Teacher Panel</h2>
        </div>

        {/* Nav */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col w-full">

        {/* Topbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-xl">

          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-300 text-xl"
            >
              ☰
            </button>

            <h1 className="text-lg font-semibold">Dashboard</h1>

            {/* LIVE badge */}
            <div className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Live
            </div>
          </div>

          {/* Right */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="
            bg-white/5
            border border-white/10
            rounded-2xl
            p-4 md:p-6
            backdrop-blur-xl
            min-h-[calc(100vh-100px)]
          ">
            <Routes>
              <Route path="attendance" element={<TeacherAttendancePage />} />
              <Route path="summary" element={<TeacherSummaryPage />} />
              <Route path="contact-admin" element={<TeacherContactAdminPage />} />
              <Route path="*" element={<Navigate to="attendance" replace />} />
            </Routes>
          </div>
        </main>

      </div>
    </div>
  );
}

export default TeacherDashboard;