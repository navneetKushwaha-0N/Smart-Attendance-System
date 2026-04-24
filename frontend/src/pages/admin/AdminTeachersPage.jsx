import React, { useEffect, useState } from 'react';
import api from '../../api/client';

const EMPTY_FORM = {
  name: '',
  email: '',
  subject: '',
  qualification: '',
  mobileNumber: '',
  department: '',
  dateOfBirth: '',
};

function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const loadTeachers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/teachers');
      setTeachers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedPassword('');

    try {
      const res = await api.post('/admin/teachers', form);
      setForm(EMPTY_FORM);

      if (res.data?.generatedPassword) {
        setGeneratedPassword(res.data.generatedPassword);
      }

      await loadTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-semibold">Teacher Management</h2>
        {loading && <span className="text-xs text-slate-400">Loading...</span>}
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* TABLE */}
        <div className="xl:col-span-2">
          <div className="
            rounded-2xl
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            shadow-lg
            overflow-hidden
          ">

            <div className="px-5 py-4 border-b border-white/10">
              <h3 className="text-sm font-medium">All Teachers</h3>
            </div>

            {/* ✅ SCROLL ADDED HERE */}
            <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Dept</th>
                    <th className="px-4 py-3 text-left">Mobile</th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((t) => (
                    <tr
                      key={t._id}
                      className="border-t border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3 font-medium">{t.name}</td>
                      <td className="px-4 py-3 text-slate-300">{t.email}</td>
                      <td className="px-4 py-3">{t.subject}</td>
                      <td className="px-4 py-3">{t.department}</td>
                      <td className="px-4 py-3">{t.mobileNumber}</td>
                    </tr>
                  ))}

                  {teachers.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400">
                        No teachers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* FORM */}
        <div>
          <div className="
            rounded-2xl
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            shadow-lg
            p-5
          ">
            <h3 className="text-sm font-medium mb-4">Add Teacher</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {[
                { label: 'Name', name: 'name', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Subject', name: 'subject', type: 'text' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-xs text-slate-400">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    required
                    className="
                      mt-1 w-full rounded-xl
                      bg-white/5
                      border border-white/10
                      px-3 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                    "
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="department"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5"
                />
                <input
                  name="mobileNumber"
                  placeholder="Mobile"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5"
                />
              </div>

              <input
                name="qualification"
                placeholder="Qualification"
                value={form.qualification}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5"
              />

              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5"
              />

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-3 rounded-xl
                  bg-gradient-to-r from-indigo-500 to-cyan-500
                  text-white text-sm font-medium
                  transition hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50
                "
              >
                {loading ? 'Creating...' : 'Create Teacher'}
              </button>
            </form>

            {generatedPassword && (
              <div className="mt-4 text-xs bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 text-green-300">
                Temporary Password: <strong>{generatedPassword}</strong>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminTeachersPage;