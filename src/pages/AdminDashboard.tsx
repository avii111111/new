import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';
import { Users, FileText, Calendar, MessageSquare, Database, LogOut, Lock, Key, ShieldAlert, Eye, EyeOff, ChevronLeft } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export function AdminDashboard() {
  const { user, login, loginAsDemoAdmin, logout, token, appUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Password validation states for Demo Admin
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setError('');
      } else {
        let errMessage = 'Forbidden: Admin access required';
        try {
          const errData = await res.json();
          if (errData && errData.error) errMessage = errData.error;
        } catch(err) {}
        setError(errMessage);
      }
    } catch (e) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [token]);

  const setupAdmin = async () => {
    if (!token) return;
    setLoading(true);
    await fetch('/api/admin/setup', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    await fetchStats();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    // Set matching password - "admin123" is standard developer default/bypass
    if (password === 'admin123') {
      setVerifying(true);
      try {
        await loginAsDemoAdmin();
        setPassword('');
      } catch (err) {
        setPasswordError('Authentication failed. Please try again.');
        setPassword('');
      } finally {
        setVerifying(false);
      }
    } else {
      setPasswordError('Invalid credentials. Please verify your administrator password.');
      setPassword('');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-transparent px-4">
        <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-xl rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 blur-xl rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 animate-fade-in font-sans">
            <form onSubmit={handlePasswordSubmit} className="text-left">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary to-accent flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4 animate-bounce-slow">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">Admin Gateway</h1>
                <p className="text-slate-600 text-sm max-w-xs mx-auto leading-relaxed text-center">
                  Enter the secure system access code below to unseal the reporting dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2 font-display">
                    Security Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoFocus
                      className="w-full bg-slate-50 border border-slate-200 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-xl px-4 py-3.5 pr-12 text-slate-800 placeholder-slate-400 font-sans focus:outline-none transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl">
                    <span className="text-sm text-red-600 font-sans">{passwordError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full py-3.5 px-4 bg-secondary hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-300 flex items-center justify-center space-x-2 border border-secondary/30 cursor-pointer"
                  >
                    <Key className="h-5 w-5 text-white" />
                    <span>{verifying ? "Authenticating..." : "Enter as Admin"}</span>
                  </button>
                </div>

                <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="px-3 text-xs text-slate-400 font-medium uppercase tracking-widest bg-transparent">or</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button 
                  type="button"
                  onClick={login} 
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl font-medium transition-all duration-200 border border-slate-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Database className="h-5 w-5 text-orange-500" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen pt-24 text-center text-slate-600">Loading dashboard...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-transparent">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200 font-sans">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="space-y-3">
             <button onClick={setupAdmin} className="w-full py-2 bg-secondary text-white rounded-lg text-sm hover:bg-secondary/90 border border-secondary/30 shadow-lg shadow-secondary/20 cursor-pointer">
               Click here to setup Admin privileges (Demo)
             </button>
             <button onClick={logout} className="w-full py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 cursor-pointer">
               Sign out
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Analytics derivation
  const serviceCount: Record<string, number> = {};
  data.demos.forEach((d: any) => { serviceCount[d.service] = (serviceCount[d.service] || 0) + 1; });
  
  const countryCount: Record<string, number> = {};
  data.inquiries.forEach((i: any) => { if(i.country) countryCount[i.country] = (countryCount[i.country] || 0) + 1; });
  
  const barData = {
    labels: Object.keys(serviceCount),
    datasets: [{
      label: 'Requested Services',
      data: Object.values(serviceCount),
      backgroundColor: '#f97316',
    }]
  };

  const pieData = {
    labels: Object.keys(countryCount),
    datasets: [{
      data: Object.values(countryCount),
      backgroundColor: ['#f97316', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
    }]
  };

  return (
    <div className="min-h-screen pt-20 bg-transparent pb-20 font-sans">
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 text-slate-900 px-6 py-6 flex justify-between items-center sticky top-20 z-40 shadow-sm">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, {user.displayName}</p>
        </div>
        <button onClick={logout} className="flex items-center space-x-2 text-sm bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg transition cursor-pointer shadow-sm">
          <LogOut className="h-4 w-4" /> <span>Logout</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Inquiries', value: data.inquiries.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50/50' },
            { label: 'Demo Reqs', value: data.demos.length, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50/50' },
            { label: 'Event Regs', value: data.eventRegistrations.length, icon: Users, color: 'text-green-500', bg: 'bg-green-50/50' },
            { label: 'AI Sessions', value: data.chatSessions.length, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50/50' },
            { label: 'Customers', value: data.users.length, icon: Database, color: 'text-slate-500', bg: 'bg-slate-50/50' }
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80 flex flex-col justify-center items-center text-center hover:scale-[1.01] transition-all">
              <div className={`p-3 rounded-full ${kpi.bg} mb-2`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase font-display tracking-wide">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
            <h3 className="font-bold text-slate-900 mb-4 font-display text-lg">Most Requested Services</h3>
            <div className="h-64"><Bar data={barData} options={{ maintainAspectRatio: false }} /></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
            <h3 className="font-bold text-slate-900 mb-4 font-display text-lg">Customer Countries</h3>
            <div className="h-64 flex justify-center"><Pie data={pieData} options={{ maintainAspectRatio: false }} /></div>
          </div>
        </div>

        {/* Tables */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-md border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-150 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 font-display text-lg">Recent Demo Bookings</h3>
              <button className="text-xs font-semibold text-secondary hover:underline cursor-pointer">Export CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Name</th>
                    <th className="px-6 py-3 font-semibold">Company</th>
                    <th className="px-6 py-3 font-semibold">Service</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.demos.slice(0,5).map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">{d.name}</td>
                      <td className="px-6 py-4 text-slate-600">{d.company}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                          {d.service}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{d.date}</td>
                      <td className="px-6 py-4"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-xs uppercase tracking-wider">{d.status}</span></td>
                    </tr>
                  ))}
                  {data.demos.length === 0 && <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">No data available</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-150 flex justify-between items-center bg-transparent">
              <h3 className="font-bold text-slate-900 font-display text-lg">Recent Inquiries</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Name</th>
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.inquiries.slice(0,5).map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">{d.name}</td>
                      <td className="px-6 py-4 text-slate-600">{d.email}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                          {d.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{new Date(d.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {data.inquiries.length === 0 && <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-500">No data available</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
