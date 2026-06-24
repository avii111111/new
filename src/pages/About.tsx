import { Globe, Shield, Lightbulb, TrendingUp } from 'lucide-react';

export function About() {
  const team = [
    { role: "CEO & Founder", name: "Elena Rostova", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400" },
    { role: "Head of AI Engineering", name: "Marcus Chen", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400" },
    { role: "Lead Software Developer", name: "Sarah Williams", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400" },
    { role: "Principal Consultant", name: "David Alaba", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400" }
  ];

  return (
    <div className="pt-12 pb-24 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story */}
        <div className="text-center max-w-3xl mx-auto mb-20 mt-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Our Story</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Founded in Sunderland, United Kingdom, AI-Solutions emerged from a simple observation: the digital employee experience was broken. We set out to fix it by bringing enterprise-grade artificial intelligence to organizations of all sizes.
          </p>
        </div>

        {/* Mission / Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="bg-white border border-slate-200/80 hover:border-orange-500/20 shadow-md text-slate-800 p-10 rounded-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 font-display text-slate-900">Our Mission</h2>
            <p className="text-lg text-slate-600 italic leading-relaxed">
              "To innovate, promote, and deliver the future of digital employee experience by supporting people at work through Artificial Intelligence."
            </p>
          </div>
          <div className="bg-white border border-slate-200/80 hover:border-orange-500/20 shadow-md text-slate-800 p-10 rounded-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 font-display text-slate-900">Our Vision</h2>
            <p className="text-lg text-slate-600 italic leading-relaxed">
              "To become a global AI solutions provider that transforms the way businesses operate, bringing automation and intelligence to every sector."
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-12">Core Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Innovation", icon: Lightbulb, desc: "Constantly pushing the boundaries of what is possible with AI." },
              { title: "Security", icon: Shield, desc: "Enterprise-grade protection for all organizational data." },
              { title: "Customer Success", icon: TrendingUp, desc: "We only succeed when our clients achieve their business goals." },
              { title: "Technology Excellence", icon: Globe, desc: "Maintaining the highest standards in software development." }
            ].map((v, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-200/80 hover:border-orange-500/20 hover:shadow-md transition-all duration-300">
                <div className="mx-auto h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <v.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-100 shadow-inner">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <p className="text-secondary font-medium text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
