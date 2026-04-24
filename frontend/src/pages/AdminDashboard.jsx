import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { Users, UserCheck, Layers, BarChart3, AlertCircle, LogOut } from 'lucide-react';
import AdminStudentsPage from './admin/AdminStudentsPage';
import AdminTeachersPage from './admin/AdminTeachersPage';
import AdminSectionsPage from './admin/AdminSectionsPage';
import AdminReportsPage from './admin/AdminReportsPage';
import AdminIssuesPage from './admin/AdminIssuesPage';

function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { to: 'students', label: 'Students', icon: Users },
    { to: 'teachers', label: 'Teachers', icon: UserCheck },
    { to: 'sections', label: 'Sections', icon: Layers },
    { to: 'reports', label: 'Reports', icon: BarChart3 },
    { to: 'issues', label: 'Requests', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex">

      {/* Sidebar */}
      <aside className={`
        fixed lg:static z-50
        top-0 left-0 h-screen flex flex-col
        w-64
        bg-[#0f172a]
        border-r border-white/10
        p-5
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        {/* Top */}
        <div>
          <h2 className="text-xl font-semibold mb-8">Admin Panel</h2>

          <nav className="space-y-2">
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
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
      </aside>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">

        {/* Topbar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-300"
          >
            ☰
          </button>

          <h1 className="text-lg font-semibold">Dashboard</h1>

          <div className="w-6" />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full h-full">
            <div className="
              bg-white/5
              border border-white/10
              rounded-2xl
              p-4 md:p-6
              backdrop-blur-xl
              min-h-[calc(100vh-80px)]
            ">
              <Routes>
                <Route path="students" element={<AdminStudentsPage />} />
                <Route path="teachers" element={<AdminTeachersPage />} />
                <Route path="sections" element={<AdminSectionsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="issues" element={<AdminIssuesPage />} />
                <Route path="*" element={<Navigate to="students" replace />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
