import { motion } from 'motion/react';
import { ArrowRight, Bot, Cpu, Zap, LayoutDashboard, CheckCircle2, Building2, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { BubblyHeading } from '../components/BubblyHeading';
import heroImage from '../assets/images/ai_solutions_hero_1782300659670_1782301340308.jpg';

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 hidden"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-orange-500/10 text-secondary mb-6 border border-orange-500/20">
                <span className="flex h-2 w-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
                Next-Gen Enterprise AI
              </div>
              <div className="mb-6">
                <BubblyHeading />
              </div>
              <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                Transform your workplace with intelligent virtual assistants, automation, and custom AI solutions designed for modern enterprises.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/schedule-demo" className="px-8 py-4 bg-secondary text-white font-medium rounded-full hover:bg-secondary/90 transition border border-secondary/30 shadow-lg shadow-secondary/20 flex items-center justify-center hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Schedule A Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/services" className="px-8 py-4 bg-white text-slate-800 font-medium rounded-full border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm">
                  Explore Solutions
                </Link>
              </div>
              
              <div className="mt-12 flex items-center space-x-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2" /> No credit card required</div>
                <div className="flex items-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2" /> 14-day free trial</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative lg:h-[480px] hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-accent/10 rounded-[2.5rem] transform rotate-2 scale-105 opacity-40"></div>
              <div className="absolute inset-0 bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200/80 flex flex-col p-2">
                <img 
                  src={heroImage} 
                  alt="Enterprise AI Solutions Illustration" 
                  className="w-full h-full object-cover rounded-[1.5rem]" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infinite Moving Text Marquee */}
      <div className="w-full bg-orange-500/[0.03] border-y border-slate-200/50 py-6 overflow-hidden select-none whitespace-nowrap relative z-10 flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#fbfbfa] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#fbfbfa] to-transparent z-20 pointer-events-none"></div>
        <div className="inline-flex animate-marquee whitespace-nowrap text-lg sm:text-2xl font-display font-bold tracking-widest text-orange-600/80 uppercase">
          <span>WORKFLOW AUTOMATION • INTELLIGENT CHATBOTS • SECURE ENTERPRISE DATA • CUSTOM COGNITIVE SYSTEMS • 24/7 DIGITAL COMPANIONS • SUNDERLAND CONSULTING • AGILE PROTOTYPES •&nbsp;</span>
          <span>WORKFLOW AUTOMATION • INTELLIGENT CHATBOTS • SECURE ENTERPRISE DATA • CUSTOM COGNITIVE SYSTEMS • 24/7 DIGITAL COMPANIONS • SUNDERLAND CONSULTING • AGILE PROTOTYPES •&nbsp;</span>
          <span>WORKFLOW AUTOMATION • INTELLIGENT CHATBOTS • SECURE ENTERPRISE DATA • CUSTOM COGNITIVE SYSTEMS • 24/7 DIGITAL COMPANIONS • SUNDERLAND CONSULTING • AGILE PROTOTYPES •&nbsp;</span>
          <span>WORKFLOW AUTOMATION • INTELLIGENT CHATBOTS • SECURE ENTERPRISE DATA • CUSTOM COGNITIVE SYSTEMS • 24/7 DIGITAL COMPANIONS • SUNDERLAND CONSULTING • AGILE PROTOTYPES •&nbsp;</span>
        </div>
      </div>

      {/* Trust Section */}
      <section className="py-10 border-b border-slate-200/60 bg-transparent flex flex-col justify-center text-center">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Trusted by innovative businesses worldwide</p>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200">
             <div className="flex flex-col items-center justify-center px-4">
               <div className="text-4xl font-display font-bold text-slate-900 mb-2">500+</div>
               <div className="text-sm text-slate-500 font-medium">Businesses Supported</div>
             </div>
             <div className="flex flex-col items-center justify-center px-4">
               <div className="text-4xl font-display font-bold text-slate-900 mb-2">1000+</div>
               <div className="text-sm text-slate-500 font-medium">AI Solutions Delivered</div>
             </div>
             <div className="flex flex-col items-center justify-center px-4">
               <div className="text-4xl font-display font-bold text-slate-900 mb-2">98%</div>
               <div className="text-sm text-slate-500 font-medium">Customer Satisfaction</div>
             </div>
             <div className="flex flex-col items-center justify-center px-4">
               <div className="text-4xl font-display font-bold text-slate-900 mb-2">24/7</div>
               <div className="text-sm text-slate-500 font-medium">AI Support</div>
             </div>
           </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-50/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Business Problems We Solve</h2>
            <p className="text-lg text-slate-600">We analyze your bottlenecks and deploy targeted AI solutions to accelerate your operations.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Slow Processes", desc: "Manual workflows reduce productivity and cause delays.", icon: Zap },
              { title: "Employee Support Issues", desc: "Employees need faster digital assistance.", icon: Users },
              { title: "Customer Service Challenges", desc: "Businesses need intelligent, scalable support.", icon: Bot },
              { title: "Innovation Barriers", desc: "Companies struggle to adopt and integrate AI.", icon: Cpu }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-orange-500/30 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                  <item.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
        <div className="absolute inset-0 bg-gradient-ai opacity-[0.03] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Ready To Transform Your Business With AI?</h2>
          <p className="text-xl text-slate-600 mb-10">Join hundreds of innovative companies already leveraging AI-Solutions.</p>
          <Link to="/schedule-demo" className="inline-flex items-center px-8 py-4 bg-secondary text-white font-bold rounded-full hover:bg-secondary/90 transition-all border border-secondary/30 shadow-lg shadow-secondary/20">
            Book Your Free AI Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
