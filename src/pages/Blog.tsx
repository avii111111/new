import { Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { blogArticles } from '../data/blogData';

export function Blog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = blogArticles.filter(article => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query)
    );
  });

  return (
    <div className="pt-12 pb-24 top-0 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Insights & News</h1>
            <p className="text-lg text-slate-600">Explore the latest articles on artificial intelligence, business automation, and digital strategy.</p>
          </div>
          <div className="w-full md:w-72 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary sm:text-sm shadow-sm" 
              placeholder="Search articles..." 
            />
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:scale-[1.01] border border-slate-200/80 hover:border-orange-500/20 flex flex-col group">
                <div className="h-48 overflow-hidden relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 border border-slate-200 backdrop-blur-sm text-xs font-semibold text-slate-800 rounded-full uppercase tracking-wider shadow-sm">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-3 flex items-center justify-between">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-secondary transition-colors">{article.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  </div>
                  <Link to={`/blog/${article.id}`} className="inline-flex items-center text-secondary font-medium hover:text-orange-700 transition-colors text-sm group mt-auto cursor-pointer">
                    Read Article
                    <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Found</h3>
            <p className="text-slate-500 text-sm">We couldn't find any articles matching your search query. Try different keywords.</p>
          </div>
        )}

      </div>
    </div>
  );
}
