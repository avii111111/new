import { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
}

const regSchema = z.object({
  eventId: z.string().min(1, "Select an event"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().optional(),
  country: z.string().min(2, "Country is required"),
});

const DEFAULT_EVENTS: Event[] = [
  {
    id: 1,
    title: "AI Transforming the Workplace 2026",
    description: "Discover how top companies harness agentic AI systems to transform daily work and scale operations.",
    location: "London, UK & Virtual",
    date: "2026-09-15"
  },
  {
    id: 2,
    title: "Prototyping with AI Masterclass",
    description: "A comprehensive hands-on workshop focused on leveraging LLMs to build rapid MVPs and software tools.",
    location: "Online",
    date: "2026-10-02"
  },
  {
    id: 3,
    title: "Enterprise AI Summit 2026",
    description: "Our flagship annual summit focusing on agentic workflows, custom automation, and local digital evolution.",
    location: "Sunderland, UK",
    date: "2026-03-10"
  },
  {
    id: 4,
    title: "Generative AI in Retail Roundtable",
    description: "A private executive roundtable discussing personalization engines, dynamic inventory control, and autonomous checkout.",
    location: "Online",
    date: "2026-01-22"
  },
  {
    id: 5,
    title: "Custom LLM Fine-Tuning Workshop",
    description: "A technical deep-dive into self-hosting, fine-tuning, and setting up vector databases securely in high-privacy sectors.",
    location: "Newcastle, UK",
    date: "2025-11-14"
  },
  {
    id: 6,
    title: "Sunderland Business Tech Expo",
    description: "Showcasing automation strategies for SME businesses looking to transition their support queues and bookkeeping to AI-led platforms.",
    location: "Sunderland, UK",
    date: "2025-09-28"
  }
];

export function Events() {
  const [events, setEvents] = useState<Event[]>(DEFAULT_EVENTS);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof regSchema>>({
    resolver: zodResolver(regSchema)
  });

  useEffect(() => {
    fetch('/api/events')
      .then(r => {
        if (!r.ok) {
          throw new Error('Failed to fetch events from backend');
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        } else {
          console.warn("API returned invalid data or empty list, falling back to static mock data");
        }
      })
      .catch(err => {
        console.error("Failed to load backend events:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSubmit = async (data: z.infer<typeof regSchema>) => {
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, eventId: parseInt(data.eventId) })
      });
      if (res.ok) {
        setSuccess(true);
        reset();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const today = '2026-06-24';
  const upcomingEvents = events.filter(ev => ev.date >= today);
  const pastEvents = events.filter(ev => ev.date < today);
  const visibleEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="pt-12 pb-24 top-0">
      <div className="bg-transparent text-slate-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900">Enterprise AI Events</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Explore our masterclasses, workshops, and conferences to discover the future of enterprise AI.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-2 gap-16">
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-display font-bold text-slate-900">Event Calendar</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-secondary shadow-sm'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                Upcoming ({upcomingEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('past')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'past'
                    ? 'bg-white text-secondary shadow-sm'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                Past ({pastEvents.length})
              </button>
            </div>
          </div>

          {loading ? (
             <div className="animate-pulse space-y-4">
               {[1,2].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>)}
             </div>
          ) : (
            <div className="space-y-6">
              {visibleEvents.length > 0 ? (
                visibleEvents.map(ev => (
                  <div key={ev.id} className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition relative overflow-hidden group">
                    {activeTab === 'past' && (
                      <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        Completed
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 mb-2 pr-16">{ev.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{ev.description}</p>
                    <div className="flex items-center space-x-6 text-sm font-medium text-slate-500">
                      <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-secondary" /> {ev.date}</div>
                      <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-secondary" /> {ev.location}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-slate-500 text-sm">No events found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 sticky top-28">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Join Our Events</h2>
            {success ? (
               <div className="bg-emerald-50 text-slate-800 p-6 rounded-xl border border-emerald-200 text-center">
                 <h3 className="text-xl font-bold text-emerald-800 mb-2">Registration Successful!</h3>
                 <p className="text-slate-600">We've received your registration and will send details shortly.</p>
                 <button onClick={() => setSuccess(false)} className="mt-4 text-sm font-semibold text-secondary hover:text-orange-700 underline cursor-pointer">Register for another event</button>
               </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Event</label>
                  <select {...register('eventId')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm">
                    <option value="">-- Choose an Event --</option>
                    {upcomingEvents.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title} - {ev.date}</option>
                    ))}
                  </select>
                  {errors.eventId && <p className="text-red-500 text-xs mt-1">{errors.eventId.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input {...register('name')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input {...register('email')} type="email" className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                    <input {...register('company')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                    <input {...register('country')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                  </div>
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-4 bg-secondary text-white font-medium rounded-lg hover:bg-secondary/90 border border-secondary/30 shadow-lg shadow-secondary/20 transition-all flex items-center justify-center cursor-pointer">
                  {isSubmitting ? 'Registering...' : 'Complete Registration'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
