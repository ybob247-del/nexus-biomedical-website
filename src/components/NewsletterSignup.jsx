import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Sparkles, CheckCircle } from 'lucide-react';

export default function NewsletterSignup() {
  const { i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          language: i18n.language,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Subscription failed');
      }

      setSubmitted(true);
      setEmail('');
      setName('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 sm:p-12">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
            {i18n.language === 'es' ? 'Manténgase Informado' : 'Stay Informed'}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {i18n.language === 'es'
            ? 'Suscríbete a Nuestro Boletín'
            : 'Subscribe to Our Newsletter'}
        </h2>

        <p className="text-slate-300 mb-8 max-w-2xl">
          {i18n.language === 'es'
            ? 'Recibe actualizaciones semanales sobre investigación biomédica, consejos de salud y nuevas características de la plataforma.'
            : 'Get weekly updates on biomedical research, health tips, and new platform features.'}
        </p>

        {submitted ? (
          <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-semibold text-green-300">
                {i18n.language === 'es' ? '¡Suscripción exitosa!' : 'Subscription successful!'}
              </p>
              <p className="text-sm text-green-300/80">
                {i18n.language === 'es'
                  ? 'Verifica tu correo para confirmar tu suscripción.'
                  : 'Check your email to confirm your subscription.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={i18n.language === 'es' ? 'Tu nombre' : 'Your name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <input
                type="email"
                placeholder={i18n.language === 'es' ? 'Tu correo' : 'Your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{i18n.language === 'es' ? 'Suscribiendo...' : 'Subscribing...'}</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>{i18n.language === 'es' ? 'Suscribirse Ahora' : 'Subscribe Now'}</span>
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center">
              {i18n.language === 'es'
                ? 'No compartimos tu correo. Puedes desuscribirte en cualquier momento.'
                : "We don't share your email. You can unsubscribe anytime."}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
