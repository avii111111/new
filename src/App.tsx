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
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-secondary to-accent text-white p-2 rounded-lg">
              <Bot className="h-6 w-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">AI-Solutions</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-secondary",
                  location.pathname === link.path ? "text-secondary font-bold" : "text-slate-600"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-3 ml-4">
              <Link
                to="/admin"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-full transition-all border border-slate-200 shadow-sm flex items-center justify-center group"
                title="Admin Portal"
              >
                <Lock className="h-4 w-4 text-slate-500 group-hover:text-slate-800 group-hover:scale-110 transition-all" />
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
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900">
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
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {links.map(link => (
                <Link
                   key={link.path}
                   to={link.path}
                   onClick={() => setIsOpen(false)}
                   className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-secondary hover:bg-slate-50 rounded-md"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-5 py-3 bg-slate-100 border border-slate-200 text-slate-700 text-base font-semibold rounded-lg hover:bg-slate-200 transition"
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
    <footer className="bg-slate-50/80 backdrop-blur-sm border-t border-slate-200 text-slate-800 pt-16 pb-8 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-tr from-secondary to-accent text-white p-2 rounded-lg">
                <Bot className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">AI-Solutions</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6">
              To innovate, promote, and deliver the future of digital employee experience by supporting people at work through Artificial Intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm">
                <Twitter className="h-5 w-5 text-slate-500 hover:text-secondary" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm">
                <Linkedin className="h-5 w-5 text-slate-500 hover:text-secondary" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm">
                <Github className="h-5 w-5 text-slate-500 hover:text-secondary" />
              </a>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-lg text-slate-900 mb-6">Solutions</h4>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-slate-600 hover:text-secondary transition-colors">Virtual Assistants</Link></li>
              <li><Link to="/services" className="text-slate-600 hover:text-secondary transition-colors">Custom AI Software</Link></li>
              <li><Link to="/services" className="text-slate-600 hover:text-secondary transition-colors">Rapid Prototyping</Link></li>
              <li><Link to="/services" className="text-slate-600 hover:text-secondary transition-colors">Digital Automation</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-lg text-slate-900 mb-6">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-slate-600 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/case-studies" className="text-slate-600 hover:text-secondary transition-colors">Case Studies</Link></li>
              <li><Link to="/events" className="text-slate-600 hover:text-secondary transition-colors">Events</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-4">
            <h4 className="font-semibold text-lg text-slate-900 mb-6">Stay Updated</h4>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
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
                  className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-4 pr-24 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder-slate-400 transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="absolute right-1 px-4 py-1.5 bg-secondary text-white text-xs font-semibold rounded-full hover:bg-secondary/90 transition border border-secondary/30 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? '...' : 'Subscribe'}
                </button>
              </div>
              {status && (
                <div className="text-xs transition-opacity duration-300 mt-2 pl-2">
                  <span className={cn(
                    status.type === 'success' ? "text-emerald-600 font-medium" : "text-rose-600"
                  )}>
                    {status.text}
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AI-Solutions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
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
        <div className="min-h-screen flex flex-col w-full relative overflow-hidden bg-[#fbfbfa] text-slate-800 selection:bg-secondary selection:text-white">
          {/* Global Mesh Gradients for Frosted Glass Theme */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-400/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-400/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
          
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
