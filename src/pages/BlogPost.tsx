import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Linkedin, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { blogArticles } from '../data/blogData';

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const articleId = id ? parseInt(id, 10) : NaN;
  const article = blogArticles.find(a => a.id === articleId);

  // Scroll to top when article ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="pt-24 pb-24 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-3xl font-display font-bold text-white mb-4">Article Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md">The article you are looking for does not exist or may have been moved.</p>
        <Link
          to="/blog"
          className="inline-flex items-center px-6 py-3 rounded-full bg-secondary text-white font-medium hover:bg-secondary/90 transition-all border border-secondary/30 shadow-lg shadow-secondary/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog Insights
        </Link>
      </div>
    );
  }

  // Related articles (exclude current one)
  const relatedArticles = blogArticles.filter(a => a.id !== article.id).slice(0, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="pt-12 pb-24 bg-transparent min-h-screen relative z-10"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Navigation / Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        {/* Hero Meta Header */}
        <div className="mb-8">
          <span className="px-3 py-1 bg-secondary/20 border border-secondary/30 backdrop-blur-sm text-xs font-semibold text-blue-400 rounded-full uppercase tracking-wider mb-4 inline-block">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-6">
            {article.title}
          </h1>

          {/* Author and Date metadata */}
          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-white/10 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full border border-white/20 object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-white font-medium">{article.author.name}</div>
                <div className="text-xs text-slate-500">{article.author.role}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-slate-500" />
              {article.date}
            </div>

            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-slate-500" />
              {article.readTime}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="h-64 sm:h-96 md:h-[450px] overflow-hidden rounded-2xl relative mb-12 border border-white/10 shadow-2xl">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Layout: Main column and sharing sticky rail */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Sticky Social Share (On desktop) */}
          <div className="md:col-span-1 md:sticky md:top-28 h-fit flex md:flex-col gap-4 justify-center md:items-center py-4 border-y md:border-y-0 md:py-0 border-white/10">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase md:mb-2 self-center rotate-0">
              Share
            </span>
            <button
              onClick={handleCopyLink}
              title="Copy Link"
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all border border-white/10 flex items-center justify-center cursor-pointer relative"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400 animate-scale-in" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/20 text-xs px-2 py-1 rounded text-white whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Twitter"
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all border border-white/10 flex items-center justify-center"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all border border-white/10 flex items-center justify-center"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>

          {/* Article Dynamic Content Body */}
          <div className="md:col-span-11 prose prose-invert max-w-none">
            <div className="markdown-body">
              <Markdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-display font-medium text-white tracking-tight mt-10 mb-4 pb-2 border-b border-white/10">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-display font-medium text-white tracking-tight mt-10 mb-4">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-display font-medium text-white mt-8 mb-3">{children}</h3>,
                  p: ({ children }) => <p className="text-slate-300 leading-relaxed text-[16px] sm:text-[17px] mb-6 font-sans">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300 font-sans">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-slate-300 font-sans">{children}</ol>,
                  li: ({ children }) => <li className="text-slate-300 leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-secondary bg-white/5 p-5 rounded-r-2xl italic my-8 text-slate-200 text-lg shadow-sm">
                      {children}
                    </blockquote>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-slate-950/60 p-5 rounded-2xl overflow-x-auto my-8 border border-white/10 font-mono text-sm text-blue-300 leading-relaxed shadow-lg">
                      {children}
                    </pre>
                  ),
                  code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-purple-300 font-mono font-medium">{children}</code>,
                  hr: () => <hr className="border-white/10 my-10" />,
                }}
              >
                {article.content}
              </Markdown>
            </div>

            {/* Newsletter SignUp Form CTA Card inside the Article */}
            <div className="mt-16 bg-gradient-to-tr from-white/10 to-white/5 border border-white/15 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 blur-3xl rounded-full"></div>
              <div className="relative z-10 max-w-2xl">
                <h3 className="text-2xl font-display font-bold text-white mb-3">Stay Ahead of the Curve</h3>
                <p className="text-slate-400 mb-6 text-sm sm:text-base">
                  Get high-impact AI strategy blueprints, industry news, and product reviews straight to your inbox weekly.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); alert("Successfully subscribed! Thank you."); }} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your work email"
                    className="flex-grow px-5 py-3 rounded-full bg-slate-900/60 border border-white/20 text-white text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-all text-sm tracking-wide shadow-lg shadow-secondary/20 shrink-0 border border-secondary/30"
                  >
                    Subscribe Weekly
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* RELATED ARTICLES FOOTER */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-10 text-center md:text-left">
            Related Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {relatedArticles.map((relArt) => (
              <div key={relArt.id} className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] border border-white/10 flex flex-col group h-full">
                <div className="h-44 overflow-hidden relative">
                  <img src={relArt.image} alt={relArt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-slate-900/90 border border-white/20 backdrop-blur-sm text-[10px] font-semibold text-white rounded-full uppercase tracking-wider">
                      {relArt.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-400 mb-2">{relArt.date}</div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-blue-400 transition-colors">{relArt.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-4">{relArt.excerpt}</p>
                  </div>
                  <Link to={`/blog/${relArt.id}`} className="inline-flex items-center text-secondary font-medium hover:text-white transition-colors text-xs tracking-wide">
                    Read Article
                    <ArrowLeft className="ml-1 h-3.5 w-3.5 rotate-180 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
