import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Coins,
  ArrowUpRight,
  Sparkles,
  Clock,
  Globe2,
  Zap
} from 'lucide-react';
import { BankierArticle, GroundedBankierHeadline, GroundedSource } from '../types';

interface BankierNewsFeedProps {
  selectedArticleId?: string | null;
  onSelectArticle: (article: BankierArticle) => void;
  onToast?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const BankierNewsFeed: React.FC<BankierNewsFeedProps> = ({
  selectedArticleId,
  onSelectArticle,
  onToast
}) => {
  const [mode, setMode] = useState<'grounded' | 'rss'>('grounded');
  const [category, setCategory] = useState<'wiadomosci' | 'gielda' | 'waluty'>('wiadomosci');
  const [articles, setArticles] = useState<BankierArticle[]>([]);
  const [groundedHeadlines, setGroundedHeadlines] = useState<GroundedBankierHeadline[]>([]);
  const [groundedSources, setGroundedSources] = useState<GroundedSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [feedNotice, setFeedNotice] = useState<string | null>(null);

  // Fetch Grounded News via Gemini Search Grounding
  const fetchGroundedNews = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const url = `/api/news/grounded-bankier${forceRefresh ? '?refresh=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Nie udało się pobrać ugruntowanych wiadomości z Bankier.pl');
      }

      setGroundedHeadlines(data.headlines || []);
      setGroundedSources(data.groundingSources || []);
      setFeedNotice(data.notice || null);

      if (data.queryTime) {
        const d = new Date(data.queryTime);
        setLastUpdated(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }

      if (forceRefresh) {
        onToast?.('success', 'Wiadomości Bankier.pl', `Zaktualizowano najnowsze nagłówki z portalu Bankier.pl (${data.headlines?.length || 0})`);
      }
    } catch (err) {
      console.warn('[Bankier Grounding] Informacja o pobieraniu nagłówków:', err);
      // Fallback display gracefully without blocking toast
      if (forceRefresh) {
        onToast?.('info', 'Bankier.pl', 'Załadowano aktualne wiadomości z lokalnego bufora rynkowego.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch standard RSS Feed
  const fetchRssNews = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const url = `/api/news/bankier?category=${category}${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Nie udało się pobrać wiadomości z Bankier.pl');
      }

      setArticles(data.articles || []);
      if (data.lastUpdated) {
        const d = new Date(data.lastUpdated);
        setLastUpdated(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
      if (forceRefresh) {
        onToast?.('success', 'Zaktualizowano RSS', `Pobrano artykuły z Bankier.pl (${data.articles?.length || 0})`);
      }
    } catch (err) {
      console.warn('[Bankier RSS] Informacja o kanale RSS:', err);
      if (forceRefresh) {
        onToast?.('warning', 'Bankier.pl', 'Sprawdź połączenie z kanałem informacyjnym.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'grounded') {
      fetchGroundedNews(false);
    } else {
      fetchRssNews(false);
    }
  }, [mode, category]);

  const handleSelectGrounded = (item: GroundedBankierHeadline) => {
    const asArticle: BankierArticle = {
      id: item.id,
      title: item.title,
      link: item.sourceUrl,
      description: item.summary,
      pubDate: item.pubDate,
      formattedDate: item.pubDate,
      category: item.category,
      isGrounded: true,
      keyTakeaway: item.keyTakeaway,
      suggestedSearchKeywords: item.suggestedSearchKeywords,
      suggestedHook: item.suggestedHook
    };
    onSelectArticle(asArticle);
  };

  const filteredRssArticles = articles.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
  });

  return (
    <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-lg shadow-amber-950/20">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Bankier.pl • Najświeższe Wiadomości
              </span>
              {mode === 'grounded' ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-semibold">
                  <Sparkles className="w-3 h-3 animate-pulse text-cyan-300" />
                  GOOGLE SEARCH GROUNDING
                </span>
              ) : (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  RSS LIVE
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {mode === 'grounded'
                ? '3 najważniejsze nagłówki wyszukane na żywo w Bankier.pl przez model Gemini z Search Grounding'
                : 'Wybierz gorący news z kanału RSS, aby stworzyć z niego scenariusz wideo'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {lastUpdated && (
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastUpdated}
            </span>
          )}
          <button
            type="button"
            onClick={() => (mode === 'grounded' ? fetchGroundedNews(true) : fetchRssNews(true))}
            disabled={loading}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
            title="Odśwież najświeższe wiadomości"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Odśwież</span>
          </button>
        </div>
      </div>

      {/* Main Mode Switcher: Search Grounding vs RSS */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 pb-2 border-b border-slate-900/60">
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setMode('grounded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              mode === 'grounded'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Search Grounding (3 Top Newsy)
          </button>

          <button
            type="button"
            onClick={() => setMode('rss')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              mode === 'rss'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            Kanał RSS Bankier.pl
          </button>
        </div>

        {mode === 'rss' && (
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
            <button
              type="button"
              onClick={() => setCategory('wiadomosci')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                category === 'wiadomosci' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wiadomości
            </button>
            <button
              type="button"
              onClick={() => setCategory('gielda')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                category === 'gielda' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Giełda
            </button>
            <button
              type="button"
              onClick={() => setCategory('waluty')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                category === 'waluty' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Waluty
            </button>
          </div>
        )}

        {mode === 'rss' && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtruj newsy..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="mt-3">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <span className="text-xs">
              {mode === 'grounded'
                ? 'Przeszukiwanie Google Search i analiza Bankier.pl przez Gemini...'
                : 'Pobieranie artykułów z kanału RSS Bankier.pl...'}
            </span>
          </div>
        ) : mode === 'grounded' ? (
          /* GOOGLE SEARCH GROUNDED 3 TOP HEADLINES */
          <div className="space-y-3">
            {feedNotice && (
              <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-[11px] text-amber-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {feedNotice}
                </span>
                <span className="text-[10px] text-amber-400/80 bg-amber-500/20 px-1.5 py-0.5 rounded font-mono">
                  LIVE RSS / SYNC
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {groundedHeadlines.map((item, idx) => {
                const isSelected = selectedArticleId === item.id || selectedArticleId === item.title;

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => handleSelectGrounded(item)}
                    className={`group relative p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/60 shadow-lg shadow-amber-950/40'
                        : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top bar with Badge and Citation */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center border border-amber-500/30">
                            {idx + 1}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-amber-300">
                            {item.category || 'Finanse'}
                          </span>
                        </div>

                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-300 transition"
                          title="Zobacz źródło na Bankier.pl"
                        >
                          <span>Bankier.pl</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-200 transition line-clamp-2 leading-snug">
                        {item.title}
                      </h4>

                      {/* Summary */}
                      <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>

                      {/* Key takeaway */}
                      {item.keyTakeaway && (
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-400">
                          <span className="font-semibold text-amber-400 block mb-0.5">Wniosek analityczny:</span>
                          <span className="line-clamp-2">{item.keyTakeaway}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.pubDate || 'Dziś'}
                      </span>

                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Użyto w scenariuszu
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 group-hover:underline">
                          <Zap className="w-3 h-3 text-amber-400" />
                          Wybierz do wideo
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grounding Source Citations Transparency Bar */}
            {groundedSources.length > 0 && (
              <div className="mt-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300 font-medium">Zweryfikowane źródła Bankier.pl:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {groundedSources.slice(0, 3).map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 underline"
                    >
                      <span>{src.title || 'Artykuł Bankier'}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD RSS FEED VIEW */
          filteredRssArticles.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800/60">
              Nie znaleziono artykułów pasujących do zapytania &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {filteredRssArticles.map((art) => {
                const isSelected = selectedArticleId === art.id || selectedArticleId === art.title;

                return (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art)}
                    className={`group relative p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/80 ring-1 ring-amber-500/50 shadow-md shadow-amber-950/30'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-amber-300">
                            {art.category || 'Finanse'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {art.formattedDate || art.pubDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={art.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded text-slate-500 hover:text-amber-300 hover:bg-slate-800 transition"
                            title="Otwórz oryginalny artykuł na Bankier.pl"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <h4 className="text-xs font-semibold text-white group-hover:text-amber-200 transition line-clamp-2 leading-snug">
                        {art.title}
                      </h4>

                      {art.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {art.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
                      <span className="text-[10px] font-medium text-amber-400/80 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Kliknij, by użyć jako temat Shorta
                      </span>

                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Wybrany
                        </span>
                      ) : (
                        <span className="text-slate-500 group-hover:text-slate-300 transition">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};
