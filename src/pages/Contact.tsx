import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

const contactSchema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().min(2, "Required"),
  country: z.string().min(2, "Required"),
  jobTitle: z.string().min(2, "Required"),
  type: z.string().min(1, "Required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export function Contact() {
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();
  
  // Feedback System States
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewCompany, setReviewCompany] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonialsList(data);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    }
  };

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: z.infer<typeof contactSchema>) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSuccess(true);
        reset();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      setFeedbackError("Please fill in your name and comment.");
      return;
    }
    
    setIsSubmittingFeedback(true);
    setFeedbackError("");
    setFeedbackSuccess(false);
    
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewName,
          company: reviewCompany,
          rating,
          comment: reviewComment
        })
      });
      
      if (res.ok) {
        setFeedbackSuccess(true);
        setReviewName("");
        setReviewCompany("");
        setReviewComment("");
        setRating(5);
        fetchTestimonials();
      } else {
        const errData = await res.json();
        setFeedbackError(errData.error || "Failed to submit feedback.");
      }
    } catch (err) {
      setFeedbackError("A network error occurred. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="pt-12 pb-24 min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Contact Us</h1>
          <p className="text-lg text-slate-400">Have questions about our AI solutions? Our team is ready to help you formulate the perfect AI strategy.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/10 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold text-white mb-2">Our Headquarters</h3>
              <p className="text-slate-400 text-sm">Innovation Hub, Tech Park<br />Sunderland, United Kingdom</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/10 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold text-white mb-2">Email Us</h3>
              <p className="text-slate-400 text-sm">hello@ai-solutions.co.uk<br />support@ai-solutions.co.uk</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/10 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold text-white mb-2">Call Us</h3>
              <p className="text-slate-400 text-sm">+44 191 123 4567<br />Mon-Fri, 9am - 5pm GMT</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl border border-white/10">
              <h2 className="text-2xl font-display font-bold text-white mb-8">Send us a message</h2>
              {success ? (
                <div className="bg-green-500/10 text-green-300 p-8 rounded-xl border border-green-200 text-center">
                  <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                  <p>Thank you for reaching out. An AI specialist will contact you within 24 hours.</p>
                  <button onClick={() => setSuccess(false)} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                      <input {...register('name')} className="w-full bg-[#020617] text-white placeholder-slate-400 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                      <input {...register('email')} type="email" className="w-full bg-[#020617] text-white placeholder-slate-400 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                      <input {...register('phone')} className="w-full bg-[#020617] text-white placeholder-slate-400 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                      <input {...register('company')} className="w-full bg-[#020617] text-white placeholder-slate-400 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans" />
                      {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
                      <input {...register('country')} className="w-full bg-[#020617] text-white placeholder-slate-400 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans" />
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Job Title</label>
                      <input {...register('jobTitle')} className="w-full bg-[#020617] text-white placeholder-slate-400 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans" />
                      {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Inquiry Type</label>
                    <select {...register('type')} className="w-full bg-[#020617] text-white placeholder-slate-400 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans">
                      <option className="bg-[#020617]" value="">-- Select Type --</option>
                      <option className="bg-[#020617]" value="AI Assistant">AI Assistant</option>
                      <option className="bg-[#020617]" value="Software Solution">Software Solution</option>
                      <option className="bg-[#020617]" value="Prototype">Prototype</option>
                      <option className="bg-[#020617]" value="Demo Request">Demo Request</option>
                      <option className="bg-[#020617]" value="Event Information">Event Information</option>
                    </select>
                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                    <textarea {...register('message')} rows={4} className="w-full bg-[#020617] text-white placeholder-slate-400 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans"></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary/90 transition border border-secondary/30 shadow-lg shadow-secondary/20 transition-all font-sans cursor-pointer">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Reviews and Feedback Section */}
        <div className="mt-20 border-t border-white/10 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Website Review & Feedback</h2>
            <p className="text-slate-400">Tell us about your experience with our platform! Your feedback helps us shape and improve our AI solutions continually.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Submit review column */}
            <div className="lg:col-span-1 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl h-fit">
              <h3 className="text-xl font-display font-bold text-white mb-6">Leave a Review</h3>
              
              {feedbackSuccess ? (
                <div className="bg-emerald-500/10 text-emerald-300 p-6 rounded-xl border border-emerald-400/30 text-center animate-fade-in">
                  <p className="font-bold mb-2 text-lg">Thank You!</p>
                  <p className="text-sm">Your feedback was successfully submitted. Website guests can see your rating instantly.</p>
                  <button 
                    onClick={() => setFeedbackSuccess(false)} 
                    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    Give Another Review
                  </button>
                </div>
              ) : (
                <form onSubmit={submitFeedback} className="space-y-6">
                  {feedbackError && <p className="text-red-400 text-sm mt-1">{feedbackError}</p>}
                  
                  {/* Star Rating selector */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors duration-150 ${
                              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-amber-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      value={reviewName} 
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-[#020617] text-white placeholder-slate-500 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Company / Role <span className="text-xs text-slate-500">(Optional)</span></label>
                    <input 
                      type="text" 
                      value={reviewCompany} 
                      onChange={(e) => setReviewCompany(e.target.value)}
                      placeholder="e.g. Acme Tech"
                      className="w-full bg-[#020617] text-white placeholder-slate-500 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Comment / Feedback</label>
                    <textarea 
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4} 
                      placeholder="Share your thoughts on the website or services..."
                      className="w-full bg-[#020617] text-white placeholder-slate-500 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary font-sans"
                    />
                  </div>

                  <button 
                    disabled={isSubmittingFeedback} 
                    type="submit" 
                    className="w-full py-2.5 bg-secondary text-white font-medium rounded-lg hover:bg-secondary/90 transition border border-secondary/30 shadow-lg shadow-secondary/20 transition-all font-sans cursor-pointer flex justify-center items-center gap-2"
                  >
                    {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              )}
            </div>

            {/* Existing feedbacks grid column */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                  <h3 className="text-xl font-display font-bold text-white">Live Feedback Feed</h3>
                </div>
                <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">{testimonialsList.length} reviews</span>
              </div>

              {testimonialsList.length === 0 ? (
                <div className="text-slate-400 bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-sm flex-grow flex flex-col justify-center items-center">
                  <Star className="h-8 w-8 text-slate-600 mb-3 animate-pulse" />
                  <p>No reviews have been submitted yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar flex-grow auto-rows-min">
                  {testimonialsList.map((t, index) => (
                    <div 
                      key={t.id || index} 
                      className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all flex flex-col justify-between"
                    >
                      <div className="mb-4">
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                            />
                          ))}
                        </div>
                        <p className="text-slate-300 text-sm italic leading-relaxed">"{t.comment}"</p>
                      </div>
                      <div className="border-t border-white/5 pt-3">
                        <h4 className="font-bold text-white text-sm">{t.name}</h4>
                        {t.company && <p className="text-xs text-slate-400 mt-0.5">{t.company}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
