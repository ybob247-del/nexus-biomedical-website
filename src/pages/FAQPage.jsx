import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQPage = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [language, setLanguage] = useState('en');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch FAQs from database
  useEffect(() => {
    fetchFAQs();
  }, [language]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/faq?language=${language}`);
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const data = await response.json();
      setFaqs(data);
      setFilteredFaqs(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(faqs.map(faq => faq.category))];

  // Filter FAQs based on search and category
  useEffect(() => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        (faq.keywords && faq.keywords.toLowerCase().includes(query))
      );
    }

    setFilteredFaqs(filtered);
  }, [searchQuery, selectedCategory, faqs]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      en: {
        all: 'All Categories',
        general: 'General',
        pricing: 'Pricing',
        endoguard: 'EndoGuard',
        rxguard: 'RxGuard',
        technical: 'Technical',
        support: 'Support'
      },
      es: {
        all: 'Todas las Categorías',
        general: 'General',
        pricing: 'Precios',
        endoguard: 'EndoGuard',
        rxguard: 'RxGuard',
        technical: 'Técnico',
        support: 'Soporte'
      }
    };
    return labels[language][category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      pricing: 'bg-green-500/10 text-green-400 border-green-500/30',
      endoguard: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      rxguard: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      technical: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      support: 'bg-pink-500/10 text-pink-400 border-pink-500/30'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {language === 'en' ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Find answers to common questions about our platforms, pricing, and features.'
              : 'Encuentre respuestas a preguntas comunes sobre nuestras plataformas, precios y características.'}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-slate-800/50 p-1 backdrop-blur-sm border border-purple-500/20">
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-2 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-6 py-2 rounded-md transition-all ${
                language === 'es'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Español
            </button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search questions...' : 'Buscar preguntas...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors backdrop-blur-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="text-gray-400" size={20} />
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-800/50 text-gray-300 border-slate-700 hover:border-purple-500/50'
                  }`}
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">
              {language === 'en' ? 'Loading FAQs...' : 'Cargando preguntas...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* FAQ List */}
        {!loading && !error && (
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-slate-800/30 border border-purple-500/20 rounded-lg overflow-hidden backdrop-blur-sm hover:border-purple-500/40 transition-all"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(faq.category)}`}>
                          {getCategoryLabel(faq.category)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {faq.question}
                      </h3>
                    </div>
                    {expandedId === faq.id ? (
                      <ChevronUp className="text-purple-400 flex-shrink-0" size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                    )}
                  </button>
                  
                  {expandedId === faq.id && (
                    <div className="px-6 pb-4 pt-2 border-t border-purple-500/10">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-8 backdrop-blur-sm">
                  <p className="text-xl text-gray-300 mb-6">
                    {language === 'en' 
                      ? 'No FAQs found matching your search.'
                      : 'No se encontraron preguntas que coincidan con su búsqueda.'}
                  </p>
                  <button
                    onClick={() => navigate('/chatbot')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    <MessageCircle size={20} />
                    {language === 'en' ? 'Ask AI Chatbot' : 'Preguntar al Chatbot IA'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Still Have Questions CTA */}
        {!loading && !error && filteredFaqs.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'en' ? 'Still Have Questions?' : '¿Todavía Tiene Preguntas?'}
              </h2>
              <p className="text-gray-300 mb-6">
                {language === 'en'
                  ? 'Our AI chatbot is available 24/7 to answer your questions instantly.'
                  : 'Nuestro chatbot IA está disponible 24/7 para responder sus preguntas al instante.'}
              </p>
              <button
                onClick={() => navigate('/chatbot')}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <MessageCircle size={20} />
                {language === 'en' ? 'Chat with AI Assistant' : 'Chatear con Asistente IA'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQPage;
