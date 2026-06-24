import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { CheckCircle2 } from 'lucide-react';

const demoSchema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Required"),
  company: z.string().min(2, "Required"),
  country: z.string().min(2, "Required"),
  service: z.string().min(1, "Select a service"),
  date: z.string().min(1, "Select a date"),
  requirements: z.string().optional()
});

export function ScheduleDemo() {
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';
  const { token, appUser } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof demoSchema>>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      service: preselectedService,
      name: appUser?.name || '',
      email: appUser?.email || ''
    }
  });

  const onSubmit = async (data: z.infer<typeof demoSchema>) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/demo-requests', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 bg-transparent flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-slate-200">
          <div className="mx-auto h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Demo Scheduled!</h1>
          <p className="text-slate-600 mb-8">
            Thank you for requesting a demo. We have saved your preferences and sent a confirmation email. One of our AI specialists will be in touch shortly to finalize the meeting details.
          </p>
          <a href="/" className="inline-block px-8 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors border border-secondary/30 shadow-lg shadow-secondary/20">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-transparent flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10 mt-10">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Schedule Your AI Setup Demo</h1>
        <p className="text-slate-600">See our intelligent solutions in action and discover how we can automate your operations.</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input {...register('name')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" {...register('email')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
             </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" {...register('phone')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input {...register('company')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
             </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <input {...register('country')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interested Service</label>
                <select {...register('service')} className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm">
                  <option value="">-- Select Service --</option>
                  <option value="virtual-assistant">AI Virtual Assistant</option>
                  <option value="software">AI Software Development</option>
                  <option value="prototyping">AI Prototyping</option>
                  <option value="consulting">Digital Custom Automation</option>
                </select>
                {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
            <input type="date" min={new Date().toISOString().split('T')[0]} {...register('date')} className="w-full md:w-1/2 bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm" />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Specific Requirements (Optional)</label>
            <textarea {...register('requirements')} rows={4} placeholder="Let us know what you want to achieve..." className="w-full bg-white text-slate-850 placeholder-slate-400 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm"></textarea>
          </div>
          <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition border border-secondary/30 shadow-lg shadow-secondary/20 transition-all text-lg flex justify-center items-center cursor-pointer">
            {isSubmitting ? 'Processing...' : 'Confirm Demo Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
