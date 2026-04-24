import React, { useEffect, useState } from 'react';
import api from '../../api/client';

const EMPTY_FORM = {
  teacherId: '',
  subject: '',
  department: '',
  section: '',
  startTime: '',
  endTime: '',
};

function AdminSectionsPage() {
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [studentsForAllocation, setStudentsForAllocation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [teachersRes, sectionsRes] = await Promise.all([
        api.get('/admin/teachers'),
        api.get('/admin/sections'),
      ]);
      setTeachers(teachersRes.data || []);
      setSections(sectionsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/admin/sections/allocate', form);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create allocation');
    } finally {
      setLoading(false);
    }
  };

  const viewStudents = async (allocation) => {
    setSelectedAllocation(allocation);
    setStudentsForAllocation([]);
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/admin/sections/${allocation._id}/students`);
      setStudentsForAllocation(res.data?.students || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white">

      {/* Header */}
      <h2 className="text-2xl font-semibold">Section Allocation</h2>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="xl:col-span-2 space-y-6">

          {/* Allocations Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 font-medium">
              Allocations
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="p-3 text-left">Teacher</th>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Dept / Sec</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {sections.map((a) => (
                    <tr key={a._id} className="border-t border-white/10 hover:bg-white/5 transition">
                      <td className="p-3 font-medium">{a.teacher?.name}</td>
                      <td className="p-3">{a.subject}</td>

                      <td className="p-3 text-sm">
                        {a.department}
                        <div className="text-xs text-slate-400">
                          Sec {a.section}
                        </div>
                      </td>

                      <td className="p-3">
                        {a.startTime} - {a.endTime}
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => viewStudents(a)}
                          className="px-3 py-1 text-xs rounded-lg border border-white/10 hover:bg-white/10"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                  {sections.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400">
                        No allocations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Students Table */}
          {selectedAllocation && (
            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 font-medium">
                Students · {selectedAllocation.subject} · {selectedAllocation.department} / Sec {selectedAllocation.section}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-slate-400">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Admission</th>
                      <th className="p-3 text-left">Semester</th>
                    </tr>
                  </thead>

                  <tbody>
                    {studentsForAllocation.map((s) => (
                      <tr key={s._id} className="border-t border-white/10">
                        <td className="p-3">{s.name}</td>
                        <td className="p-3">{s.admissionNumber}</td>
                        <td className="p-3">{s.semester}</td>
                      </tr>
                    ))}

                    {studentsForAllocation.length === 0 && !loading && (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-slate-400">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT SIDE FORM */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur">
          <h3 className="mb-4 font-medium">Create Allocation</h3>

          <form onSubmit={handleSubmit} className="space-y-3">

            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-xl bg-white/5 border border-white/10"
            >
              <option value="">Select teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} - {t.department}
                </option>
              ))}
            </select>

            {['subject', 'department', 'section'].map((f) => (
              <input
                key={f}
                name={f}
                value={form[f]}
                onChange={handleChange}
                placeholder={f}
                className="w-full p-2 rounded-xl bg-white/5 border border-white/10"
              />
            ))}

            <div className="grid grid-cols-2 gap-2">
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="p-2 rounded-xl bg-white/5 border border-white/10" />
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="p-2 rounded-xl bg-white/5 border border-white/10" />
            </div>

            <button className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 py-2 rounded-xl">
              Create Allocation
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default AdminSectionsPage;