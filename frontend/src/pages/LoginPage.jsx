import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'TEACHER') navigate('/teacher');
      else setError('Access allowed only for Admin and Teacher accounts');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] relative overflow-hidden">

      {/* background glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] bottom-[-100px] right-[-100px]" />

      {/* card */}
      <div className="w-full max-w-md z-10 px-6">
        <div className="
          bg-white/5 backdrop-blur-2xl
          border border-white/10
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          rounded-3xl
          p-8
        ">

          {/* heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-white">
              Welcome Back
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Access restricted to{' '}
              <span className="text-indigo-400 font-medium">Admin</span> and{' '}
              <span className="text-cyan-400 font-medium">Teacher</span> accounts
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-400/20 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* email */}
            <div>
              <label className="text-xs text-slate-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="
                  w-full mt-1 px-4 py-2.5 rounded-xl
                  bg-white/5 border border-white/10
                  text-white text-sm
                  placeholder:text-slate-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                  transition
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* password */}
            <div>
              <label className="text-xs text-slate-400">Password</label>

              <div className="relative mt-1">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="
                    w-full px-4 py-2.5 rounded-xl
                    bg-white/5 border border-white/10
                    text-white text-sm
                    placeholder:text-slate-500
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                  "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </button>
            </div>

            {/* button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl
                bg-gradient-to-r from-indigo-500 to-cyan-500
                text-white text-sm font-medium
                transition-all duration-200
                hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50
              "
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* footer */}
          <p className="text-xs text-center text-slate-500 mt-6">
            QR Attendance System
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;