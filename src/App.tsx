import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Bot, Menu, X, ChevronRight, Github, Twitter, Linkedin, Lock } from 'lucide-react';
import { cn } from './lib/utils';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { CaseStudies } from './pages/CaseStudies';
import { Events } from './pages/Events';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Contact } from './pages/Contact';
import { ScheduleDemo } from './pages/ScheduleDemo';
import { AdminDashboard } from './pages/AdminDashboard';
import { AIChatAssistant } from './components/AIChatAssistant';
import { AuthProvider } from './components/AuthProvider';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Case Studies', path: '/case-studies' },
    { label: 'Events', path: '/events' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-secondary to-accent text-white p-2 rounded-lg">
              <Bot className="h-6 w-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">AI-Solutions</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  location.pathname === link.path ? "text-white font-bold" : "text-slate-400"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-3 ml-4">
              <Link
                to="/admin"
                className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full transition-all border border-white/10 shadow-sm flex items-center justify-center group"
                title="Admin Portal"
              >
                <Lock className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:scale-110 transition-all" />
              </Link>
              <Link
                to="/schedule-demo"
                className="px-5 py-2.5 bg-secondary text-white text-sm font-semibold rounded-full hover:bg-secondary/90 transition-all border border-secondary/30 shadow-lg shadow-secondary/20 flex items-center group"
              >
                Schedule Demo
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {links.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-5 py-3 bg-white/5 border border-white/10 text-slate-200 text-base font-semibold rounded-lg hover:bg-white/10 transition"
                >
                  Admin Portal
                </Link>
                <Link
                  to="/schedule-demo"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-5 py-3 bg-secondary text-white text-base font-semibold rounded-lg hover:bg-secondary/90 shadow-lg shadow-secondary/20 border border-secondary/30"
                >
                  Schedule Demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ type: 'success', text: data.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', text: data.error || 'Subscription failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 text-white pt-16 pb-8 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-tr from-secondary to-accent text-white p-2 rounded-lg">
                <Bot className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">AI-Solutions</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6">
              To innovate, promote, and deliver the future of digital employee experience by supporting people at work through Artificial Intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="h-5 w-5 text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="h-5 w-5 text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Github className="h-5 w-5 text-slate-400 hover:text-white" />
              </a>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-lg mb-6">Solutions</h4>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-slate-500 hover:text-white transition-colors">Virtual Assistants</Link></li>
              <li><Link to="/services" className="text-slate-500 hover:text-white transition-colors">Custom AI Software</Link></li>
              <li><Link to="/services" className="text-slate-500 hover:text-white transition-colors">Rapid Prototyping</Link></li>
              <li><Link to="/services" className="text-slate-500 hover:text-white transition-colors">Digital Automation</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-slate-500 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/case-studies" className="text-slate-500 hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link to="/events" className="text-slate-500 hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/admin" className="text-slate-500 hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-4">
            <h4 className="font-semibold text-lg mb-6">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter for the latest insights in enterprise agentic AI systems, releases, and company updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-24 text-sm text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder-slate-500 transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="absolute right-1 px-4 py-1.5 bg-secondary text-white text-xs font-semibold rounded-full hover:bg-secondary/90 transition border border-secondary/30 disabled:opacity-50"
                >
                  {submitting ? '...' : 'Subscribe'}
                </button>
              </div>
              {status && (
                <div className="text-xs transition-opacity duration-300 mt-2 pl-2">
                  <span className={cn(
                    status.type === 'success' ? "text-green-400 font-medium" : "text-red-400"
                  )}>
                    {status.text}
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AI-Solutions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col w-full relative overflow-hidden bg-[#020617] text-slate-100 selection:bg-secondary selection:text-white">
          {/* Global Mesh Gradients for Frosted Glass Theme */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
          
          <Navigation />
          <main className="flex-grow pt-20 relative z-10 w-full overflow-y-auto">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/events" element={<Events />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/schedule-demo" element={<ScheduleDemo />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <AIChatAssistant />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
