import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, User, Tag, Share2, Heart } from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug, i18n.language]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) throw new Error('Post not found');
      const data = await response.json();
      setPost(data);
      
      // Fetch related posts
      if (data.category) {
        const relatedResponse = await fetch(`/api/blog/posts?category=${data.category}&limit=3`);
        const relatedData = await relatedResponse.json();
        setRelatedPosts(relatedData.filter(p => p.id !== data.id));
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const readingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post not found</h1>
          <button
            onClick={() => navigate('/blog')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <div className="px-4 sm:px-6 lg:px-8 pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Blog</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              {post.category && (
                <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full mb-4">
                  {post.category}
                </span>
              )}
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 text-sm text-slate-400 mb-8 pb-8 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>{readingTime(post.content)} min read</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    liked
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-slate-800/50 text-slate-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{liked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  onClick={sharePost}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-12 rounded-xl overflow-hidden border border-slate-700/50">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-invert max-w-none mb-12">
              <div
                className="text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 py-8 border-t border-slate-700/50">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                  >
                    <Tag className="w-4 h-4" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-12 border-t border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(relatedPost => (
                    <a
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all"
                    >
                      {relatedPost.featured_image && (
                        <div className="h-32 overflow-hidden rounded-lg mb-4">
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2">{formatDate(relatedPost.published_at)}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
