import React, { useEffect, useState } from 'react';
import api from '../../api/client';

const EMPTY_FORM = {
  name: '',
  admissionNumber: '',
  mobileNumber: '',
  email: '',
  semester: '',
  section: '',
  department: '',
  status: 'ACTIVE',
};

function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    section: '',
    semester: '',
    status: '',
  });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/students', { params: filters });
      setStudents(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    loadStudents();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({ ...s });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editingId) {
        await api.put(`/admin/students/${editingId}`, form);
      } else {
        await api.post('/admin/students', form);
      }
      cancelEdit();
      await loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    setLoading(true);
    try {
      await api.delete(`/admin/students/${id}`);
      await loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  // ✅ QR DOWNLOAD FUNCTION
  const downloadQR = (qrData, name) => {
    const link = document.createElement('a');
    link.href = qrData; // backend should send base64 or image URL
    link.download = `${name}_QR.png`;
    link.click();
  };

  const statusBadge = (status) => {
    const map = {
      ACTIVE: 'bg-emerald-500/20 text-emerald-300',
      INACTIVE: 'bg-yellow-500/20 text-yellow-300',
      DEBARRED: 'bg-red-500/20 text-red-300',
    };
    return map[status] || 'bg-slate-500/20 text-slate-300';
  };

  return (
    <div className="space-y-6 text-white">

      <h2 className="text-2xl font-semibold">Student Management</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <form
        onSubmit={applyFilters}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur"
      >
        <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search" className="p-2 rounded-xl bg-white/5 border border-white/10" />
        <input name="department" value={filters.department} onChange={handleFilterChange} placeholder="Department" className="p-2 rounded-xl bg-white/5 border border-white/10" />
        <input name="section" value={filters.section} onChange={handleFilterChange} placeholder="Section" className="p-2 rounded-xl bg-white/5 border border-white/10" />
        <input name="semester" value={filters.semester} onChange={handleFilterChange} placeholder="Semester" className="p-2 rounded-xl bg-white/5 border border-white/10" />

        <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 rounded-xl bg-white/5 border border-white/10">
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DEBARRED">Debarred</option>
        </select>

        <button className="bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl text-sm">
          Apply
        </button>
      </form>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* TABLE */}
        <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 font-medium">
            Students
          </div>

          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Admission</th>
                  <th className="p-3 text-left">Details</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">QR</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-t border-white/10 hover:bg-white/5 transition">

                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">{s.admissionNumber}</td>

                    <td className="p-3 text-sm">
                      {s.department}
                      <div className="text-xs text-slate-400">
                        Sec {s.section} · Sem {s.semester}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>

                    {/* ✅ QR COLUMN */}
                    <td className="p-3">
                      {s.qrPayload ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-emerald-400 text-xs">Generated</span>
                          <button
                            onClick={() => downloadQR(s.qrPayload, s.name)}
                            className="text-xs text-cyan-400 hover:underline"
                          >
                            Download
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Pending</span>
                      )}
                    </td>

                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => startEdit(s)} className="px-3 py-1 text-xs rounded-lg border border-white/10 hover:bg-white/10">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="px-3 py-1 text-xs rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10">
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur">
          <h3 className="mb-4 font-medium">
            {editingId ? 'Edit Student' : 'Add Student'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">

            {['name', 'admissionNumber', 'mobileNumber', 'email'].map((f) => (
              <input
                key={f}
                name={f}
                value={form[f]}
                onChange={handleChange}
                placeholder={f}
                className="w-full p-2 rounded-xl bg-white/5 border border-white/10"
              />
            ))}

            <div className="grid grid-cols-3 gap-2">
              {['semester', 'section', 'department'].map((f) => (
                <input
                  key={f}
                  name={f}
                  value={form[f]}
                  onChange={handleChange}
                  placeholder={f}
                  className="p-2 rounded-xl bg-white/5 border border-white/10"
                />
              ))}
            </div>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 rounded-xl bg-white/5 border border-white/10"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DEBARRED">Debarred</option>
            </select>

            <button className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 py-2 rounded-xl">
              {editingId ? 'Update' : 'Create'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default AdminStudentsPage;