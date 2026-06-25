import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { motion } from 'motion/react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';
import { Users, FileText, Calendar, MessageSquare, Database, LogOut, Lock, Key, ShieldAlert, Eye, EyeOff, ChevronLeft, Download, Star, Trash2 } from 'lucide-react';

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

  const handleDeleteReview = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchStats();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete review.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred. Please try again.");
    }
  };

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

  const handleExportCSV = () => {
    if (!data || !data.demos || data.demos.length === 0) {
      alert("No demo requests available to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Company", "Country", "Requested Service", "Requirements", "Date", "Status", "Created At"];

    const escapeCSVValue = (val: any) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = data.demos.map((d: any) => [
      d.id,
      d.name,
      d.email,
      d.phone || "",
      d.company || "",
      d.country || "",
      d.service,
      d.requirements || "",
      d.date,
      d.status,
      d.createdAt ? new Date(d.createdAt).toLocaleString() : ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map(escapeCSVValue).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `scheduled_demo_requests_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.06),transparent_50%)] bg-slate-50/50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] max-w-md w-full relative overflow-hidden font-sans"
        >
          {/* Ambient light glow spots */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/10 to-accent/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-accent/5 to-secondary/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <form onSubmit={handlePasswordSubmit} className="text-left">
              {/* Security Lock Badge */}
              <div className="text-center mb-8">
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center mb-5">
                  {/* Rotating Concentric Outer Ring 1 */}
                  <div className="absolute inset-0 border-2 border-dashed border-secondary/20 rounded-full animate-[spin_40s_linear_infinite]"></div>
                  {/* Rotating Concentric Outer Ring 2 */}
                  <div className="absolute inset-2 border border-slate-200 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                  {/* Pulsing ring */}
                  <div className="absolute inset-4 bg-secondary/5 rounded-full animate-ping opacity-75"></div>
                  {/* Solid premium circle */}
                  <div className="absolute inset-4 bg-gradient-to-tr from-secondary to-orange-500 rounded-full shadow-lg shadow-secondary/30 flex items-center justify-center">
                    <Lock className="h-7 w-7 text-white" />
                  </div>
                </div>

                <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
                  System Gatekeeper
                </h1>
                <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                  Enter the secure administrator access key to decrypt and unseal the analytical dashboard.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                      Security Password
                    </label>
                    <span className="text-[10px] font-medium text-slate-400 font-mono uppercase">
                      Required
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoFocus
                      className="w-full bg-slate-50/50 border border-slate-200 group-hover:border-slate-300 focus:border-secondary focus:ring-4 focus:ring-secondary/10 rounded-2xl px-4 py-3.5 pr-12 text-slate-800 placeholder-slate-400 font-mono tracking-widest text-lg focus:outline-none transition-all duration-300 shadow-inner"
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
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-2.5"
                  >
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-red-700 font-medium leading-relaxed">{passwordError}</span>
                  </motion.div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-600 hover:to-orange-500 disabled:from-orange-300 disabled:to-orange-200 text-white rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:shadow-secondary/35 transition-all duration-300 flex items-center justify-center space-x-2 border border-secondary/10 cursor-pointer text-sm"
                  >
                    <Key className="h-4.5 w-4.5 text-white" />
                    <span>{verifying ? "Authorizing Security..." : "Unlock Dashboard"}</span>
                  </button>
                </div>

                <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-slate-150"></div>
                  <span className="px-3.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-transparent">
                    Identity Provider
                  </span>
                  <div className="flex-grow border-t border-slate-150"></div>
                </div>

                <button 
                  type="button"
                  onClick={login} 
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-2xl font-semibold transition-all duration-300 border border-slate-200 hover:border-slate-300 flex items-center justify-center space-x-2.5 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.61 -0.06,-1.2 -0.16,-1.78Z" fill="#4285f4" />
                      <path d="M12,20.62c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.92,0.61 -2.1,0.98 -3.51,0.98c-2.35,0 -4.33,-1.59 -5.04,-3.72H2.69v2.66c1.49,2.96 4.54,4.83 8.16,4.83Z" fill="#34a853" />
                      <path d="M6.96,13.13c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7c0,-0.59 0.1,-1.16 0.28,-1.7V7.07H2.69c-0.61,1.21 -0.96,2.58 -0.96,4.03c0,1.45 0.35,2.82 0.96,4.03l4.27,-3.13Z" fill="#fbbc05" />
                      <path d="M12,6.38c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,3.68 14.43,3 12,3C8.38,3 5.33,4.87 3.84,7.83l4.27,3.13c0.71,-2.13 2.69,-3.72 5.04,-3.72Z" fill="#ea4335" />
                    </g>
                  </svg>
                  <span>Google single sign-on</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
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

  const totalReviews = data.testimonials ? data.testimonials.length : 0;
  const avgRating = totalReviews > 0 
    ? (data.testimonials.reduce((sum: number, t: any) => sum + t.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
  
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: 'Inquiries', value: data.inquiries.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50/50' },
            { label: 'Demo Reqs', value: data.demos.length, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50/50' },
            { label: 'Event Regs', value: data.eventRegistrations.length, icon: Users, color: 'text-green-500', bg: 'bg-green-50/50' },
            { label: 'AI Sessions', value: data.chatSessions.length, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50/50' },
            { label: 'Avg Rating', value: `${avgRating} ★`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50/50' },
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
              <button 
                onClick={handleExportCSV}
                className="text-xs font-semibold text-secondary hover:text-orange-600 transition flex items-center space-x-1.5 cursor-pointer bg-orange-50 hover:bg-orange-100/80 px-3 py-1.5 rounded-lg border border-orange-100/60"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
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
              <div>
                <h3 className="font-bold text-slate-900 font-display text-lg">Recent Inquiries</h3>
              </div>
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

          {/* Website Reviews & Ratings Section */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-150 flex justify-between items-center bg-transparent">
              <div>
                <h3 className="font-bold text-slate-900 font-display text-lg">Website Reviews & Ratings</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage user ratings and feedback testimonials displayed on the contact page</p>
              </div>
            </div>

            {/* Reviews Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-6 py-3 font-semibold">Company / Role</th>
                    <th className="px-6 py-3 font-semibold">Rating</th>
                    <th className="px-6 py-3 font-semibold">Comment</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.testimonials && data.testimonials.map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">{t.name}</td>
                      <td className="px-6 py-4 text-slate-600">{t.company || <span className="text-slate-400 italic">None</span>}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-3.5 w-3.5 ${
                                idx < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={t.comment}>
                        {t.comment}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Static Seed"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteReview(t.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!data.testimonials || data.testimonials.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                        No reviews submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
