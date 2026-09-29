import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  History,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Download,
  Copy,
  Check,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  Film,
  Zap,
  Layers,
  FileCode,
  X,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Activity,
  CheckCircle,
  Eye
} from 'lucide-react';

import { VideoPreview } from './VideoPreview';

export type JobStatusType = 'Pending' | 'Completed' | 'Error';

export interface JobHistoryItem {
  id: string;
  title: string;
  topicCategory: 'B2B Finanse' | 'Gospodarka & NBP' | 'Rynki & Giełda' | 'Kredyty & Nieruchomości' | 'AI & Tech';
  status: JobStatusType;
  progress: number; // 0 to 100
  timestamp: string; // ISO or formatted string
  durationFormatted: string; // e.g. "18.0s"
  resolution: string; // e.g. "720x1280 (9:16)"
  fileSize?: string; // e.g. "2.4 MB"
  outputUrl?: string;
  filename?: string;
  errorReason?: string;
  scenesCount: number;
  voiceoverLanguage: string;
  audioTrackName: string;
  captionStyle: string;
  logs: string[];
}

const INITIAL_MOCK_HISTORY: JobHistoryItem[] = [
  {
    id: 'job_2026_rf24_9921',
    title: 'Analiza wskaźników płynności i zadłużenia spółek z sektora OZE (NIP: 5252819201)',
    topicCategory: 'B2B Finanse',
    status: 'Completed',
    progress: 100,
    timestamp: '2026-09-26T16:30:12Z',
    durationFormatted: '18.0s',
    resolution: '720x1280 (Shorts 9:16)',
    fileSize: '3.4 MB',
    filename: 'combined_video_job_rf24_9921.mp4',
    outputUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    scenesCount: 1,
    voiceoverLanguage: 'Polski (Adam Pro)',
    audioTrackName: 'Chill Ambient Waves',
    captionStyle: 'Montserrat Bold • Karaoke Yellow',
    logs: [
      '[16:30:12] Pobrano wskaźniki finansowe i dane z KRS / Biała Lista VAT',
      '[16:30:13] Generowanie inteligentnej syntezy lektorskiej AI...',
      '[16:30:14] Dopasowano tło wideo Pexels Motion (Sektor Energetyczny)',
      '[16:30:16] FFmpeg nałożył napisy word-by-word z precyzyjnym timingiem',
      '[16:30:18] Wyrenderowano plik wideo MP4 (3.4 MB). Zadanie zakończone.'
    ]
  },
  {
    id: 'job_2026_rf24_9884',
    title: 'Decyzja RPP w sprawie stóp procentowych: Co oznacza dla rat kredytów hipotecznych?',
    topicCategory: 'Gospodarka & NBP',
    status: 'Completed',
    progress: 100,
    timestamp: '2026-09-26T15:14:45Z',
    durationFormatted: '18.0s',
    resolution: '720x1280 (Shorts 9:16)',
    fileSize: '2.8 MB',
    filename: 'combined_video_job_rf24_9884.mp4',
    outputUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    scenesCount: 1,
    voiceoverLanguage: 'Polski (Krzysztof Deep)',
    audioTrackName: 'Corporate Tech Groove',
    captionStyle: 'Montserrat Bold • Yellow Glow',
    logs: [
      '[15:14:45] Odebrano zapytanie z modułu Auto-Pilot',
      '[15:14:46] Pobrano najnowsze dane inflacji CPI i komunikat NBP',
      '[15:14:48] Synteza audio TTS 24kHz zakończona pomyślnie',
      '[15:14:50] Scalanie strumieni wideo z dynamicznym montażem',
      '[15:14:52] ✓ Eksport gotowy do publikacji'
    ]
  },
  {
    id: 'job_2026_rf24_9840',
    title: 'Raport rentowności EBITDA i dynamiki przychodów e-commerce Q3',
    topicCategory: 'B2B Finanse',
    status: 'Pending',
    progress: 68,
    timestamp: '2026-09-26T17:48:20Z',
    durationFormatted: '18.0s',
    resolution: '1080x1920 (FHD 9:16)',
    fileSize: 'Przetwarzanie...',
    filename: 'combined_video_job_rf24_9840.mp4',
    scenesCount: 2,
    voiceoverLanguage: 'Polski (Maja Modern)',
    audioTrackName: 'Modern Lo-Fi Beats',
    captionStyle: 'Montserrat Bold • Classic Center',
    logs: [
      '[17:48:20] Zainicjowano zadanie renderowania w kolejce serwera',
      '[17:48:22] Pobieranie tła wideo 4K z bazy multimediów...',
      '[17:48:24] Nakładanie filtrów tekstowych i warstw analitycznych...',
      '[17:48:26] Klatka 320/540 • Prędkość: 3.8x • Trwa kodowanie H.264'
    ]
  },
  {
    id: 'job_2026_rf24_9771',
    title: 'Wzrost wolumenu transakcji na GPW: Sektor technologiczny bije rekordy',
    topicCategory: 'Rynki & Giełda',
    status: 'Completed',
    progress: 100,
    timestamp: '2026-09-26T13:02:11Z',
    durationFormatted: '18.0s',
    resolution: '720x1280 (Shorts 9:16)',
    fileSize: '3.1 MB',
    filename: 'combined_video_job_rf24_9771.mp4',
    outputUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    scenesCount: 1,
    voiceoverLanguage: 'Polski (Adam Pro)',
    audioTrackName: 'Upbeat Ambient Focus',
    captionStyle: 'Montserrat Bold • Karaoke Yellow',
    logs: [
      '[13:02:11] Import artykułu z Bankier.pl / Giełda',
      '[13:02:12] Wygenerowano skrypt 18-sekundowy z analizą obrotów',
      '[13:02:15] Renderowanie FFmpeg zakończone bez ostrzeżeń'
    ]
  },
  {
    id: 'job_2026_rf24_9650',
    title: 'Zmiany podatkowe w CIT dla spółek komandytowych – Kluczowe ryzyka prawne',
    topicCategory: 'B2B Finanse',
    status: 'Error',
    progress: 42,
    timestamp: '2026-09-26T11:20:05Z',
    durationFormatted: '18.0s',
    resolution: '720x1280 (Shorts 9:16)',
    errorReason: 'Zewnętrzny serwer wideo zwrócił kod 403 Forbidden podczas pobierania klipu źródłowego (Timeout 15s).',
    scenesCount: 1,
    voiceoverLanguage: 'Polski (Adam Pro)',
    audioTrackName: 'Dark Analytical Drone',
    captionStyle: 'Montserrat Bold • Cyan Highlight',
    logs: [
      '[11:20:05] Rozpoczęto pobieranie zasobu multimedialnego...',
      '[11:20:10] BŁĄD: Serwer zewnętrzny odmówił dostępu (HTTP 403 Forbidden)',
      '[11:20:12] Próba automatycznego wznowienia z alternatywnego mirrora...',
      '[11:20:20] Przekroczono limit czasu oczekiwania. Zadanie przerwane.'
    ]
  },
  {
    id: 'job_2026_rf24_9512',
    title: 'Rewolucja AI w audycie sprawozdań finansowych: Automatyzacja bilansów',
    topicCategory: 'AI & Tech',
    status: 'Completed',
    progress: 100,
    timestamp: '2026-09-25T20:15:30Z',
    durationFormatted: '18.0s',
    resolution: '720x1280 (Shorts 9:16)',
    fileSize: '4.1 MB',
    filename: 'combined_video_job_rf24_9512.mp4',
    outputUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyflights.mp4',
    scenesCount: 1,
    voiceoverLanguage: 'Polski (Maja Modern)',
    audioTrackName: 'Cyber Matrix Synthesis',
    captionStyle: 'Montserrat Bold • Karaoke Yellow',
    logs: [
      '[20:15:30] Przyjęto zlecenie z webhooka Make.com',
      '[20:15:32] Sukces generowania warstwy lektorskiej',
      '[20:15:36] Eksport MP4 zoptymalizowany pod kątem platform YouTube Shorts i TikTok'
    ]
  }
];

interface JobHistoryDashboardProps {
  onToast?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const JobHistoryDashboard: React.FC<JobHistoryDashboardProps> = ({ onToast }) => {
  // Local state initialized from localStorage or mock fallback
  const [historyItems, setHistoryItems] = useState<JobHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('rf24_job_history_mock');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_MOCK_HISTORY;
  });

  const [statusFilter, setStatusFilter] = useState<'All' | JobStatusType>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration'>('newest');

  // Modal inspection states
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobHistoryItem | null>(null);
  const [previewVideoJob, setPreviewVideoJob] = useState<JobHistoryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSimulatingNewJob, setIsSimulatingNewJob] = useState<boolean>(false);

  // Sync to local storage on changes
  const updateHistory = (newItems: JobHistoryItem[]) => {
    setHistoryItems(newItems);
    try {
      localStorage.setItem('rf24_job_history_mock', JSON.stringify(newItems));
    } catch {}
  };

  // Metrics Calculations
  const metrics = useMemo(() => {
    const total = historyItems.length;
    const completed = historyItems.filter((j) => j.status === 'Completed').length;
    const pending = historyItems.filter((j) => j.status === 'Pending').length;
    const error = historyItems.filter((j) => j.status === 'Error').length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, error, successRate };
  }, [historyItems]);

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    return historyItems
      .filter((job) => {
        if (statusFilter !== 'All' && job.status !== statusFilter) return false;
        if (categoryFilter !== 'All' && job.topicCategory !== categoryFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchId = job.id.toLowerCase().includes(q);
          const matchCategory = job.topicCategory.toLowerCase().includes(q);
          const matchError = job.errorReason?.toLowerCase().includes(q);
          return matchTitle || matchId || matchCategory || matchError;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        if (sortBy === 'duration') {
          return parseFloat(b.durationFormatted) - parseFloat(a.durationFormatted);
        }
        return 0;
      });
  }, [historyItems, statusFilter, categoryFilter, searchQuery, sortBy]);

  // Retry Failed Task (transitions Error -> Pending -> Completed with progress simulation)
  const handleRetryJob = (jobId: string) => {
    const targetJob = historyItems.find((j) => j.id === jobId);
    if (!targetJob) return;

    onToast?.('info', 'Ponawianie zadania', `Rozpoczęto ponowne przetwarzanie zadania #${jobId}`);

    const updated = historyItems.map((j) => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'Pending' as JobStatusType,
          progress: 15,
          errorReason: undefined,
          logs: [
            ...j.logs,
            `[${new Date().toLocaleTimeString()}] Ponowna próba renderowania zainicjowana przez użytkownika...`
          ]
        };
      }
      return j;
    });
    updateHistory(updated);

    // Simulate step progress
    setTimeout(() => {
      setHistoryItems((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, progress: 65 } : j))
      );
    }, 1200);

    setTimeout(() => {
      setHistoryItems((prev) => {
        const next = prev.map((j) => {
          if (j.id === jobId) {
            return {
              ...j,
              status: 'Completed' as JobStatusType,
              progress: 100,
              fileSize: '3.2 MB',
              filename: `combined_video_${j.id}.mp4`,
              outputUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              logs: [
                ...j.logs,
                `[${new Date().toLocaleTimeString()}] ✓ Zastępcze źródło wideo pobrane pomyślnie. Renderowanie zakończone sukcesem.`
              ]
            };
          }
          return j;
        });
        try {
          localStorage.setItem('rf24_job_history_mock', JSON.stringify(next));
        } catch {}
        return next;
      });
      onToast?.('success', 'Zadanie ukończone', `Zadanie #${jobId} zostało pomyślnie wyrenderowane!`);
    }, 2800);
  };

  // Add New Mock Task
  const handleAddMockJob = () => {
    setIsSimulatingNewJob(true);
    const id = `job_rf24_${Date.now().toString().slice(-4)}`;
    const topics: { title: string; category: JobHistoryItem['topicCategory'] }[] = [
      {
        title: 'Analiza wskaźnika zadłużenia kapitału własnego i dźwigni finansowej spółek GPW',
        category: 'B2B Finanse'
      },
      {
        title: 'Prognoza dynamiki PKB Polski i presji kosztowej w przedsiębiorstwach na 2027',
        category: 'Gospodarka & NBP'
      },
      {
        title: 'Rentowność najmu mieszkań vs obligacje skarbowe – Porównanie stóp zwrotu',
        category: 'Kredyty & Nieruchomości'
      },
      {
        title: 'Algorytmiczny hedging walutowy EUR/PLN dla importerów i eksporterów',
        category: 'Rynki & Giełda'
      }
    ];

    const chosen = topics[Math.floor(Math.random() * topics.length)];

    const newJob: JobHistoryItem = {
      id,
      title: chosen.title,
      topicCategory: chosen.category,
      status: 'Pending',
      progress: 25,
      timestamp: new Date().toISOString(),
      durationFormatted: '18.0s',
      resolution: '720x1280 (Shorts 9:16)',
      fileSize: 'Przetwarzanie...',
      scenesCount: 1,
      voiceoverLanguage: 'Polski (Adam Pro)',
      audioTrackName: 'Chill Ambient Waves',
      captionStyle: 'Montserrat Bold • Karaoke Yellow',
      logs: [
        `[${new Date().toLocaleTimeString()}] Utworzono zadanie w kolejce Make.com / API`,
        `[${new Date().toLocaleTimeString()}] Przetwarzanie skryptu wideo i generowanie głosu lektora...`
      ]
    };

    const nextList = [newJob, ...historyItems];
    updateHistory(nextList);
    onToast?.('info', 'Nowe zadanie w kolejce', `Dodano "${chosen.title.slice(0, 45)}..."`);

    // Simulate completion
    setTimeout(() => {
      setHistoryItems((prev) =>
        prev.map((j) => (j.id === id ? { ...j, progress: 80 } : j))
      );
    }, 1500);

    setTimeout(() => {
      setHistoryItems((prev) => {
        const finished = prev.map((j) => {
          if (j.id === id) {
            return {
              ...j,
              status: 'Completed' as JobStatusType,
              progress: 100,
              fileSize: `${(Math.random() * 2 + 2).toFixed(1)} MB`,
              filename: `combined_video_${id}.mp4`,
              outputUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              logs: [
                ...j.logs,
                `[${new Date().toLocaleTimeString()}] Renderowanie 540 klatek zakończone sukcesem.`
              ]
            };
          }
          return j;
        });
        try {
          localStorage.setItem('rf24_job_history_mock', JSON.stringify(finished));
        } catch {}
        return finished;
      });
      setIsSimulatingNewJob(false);
      onToast?.('success', 'Gotowe!', `Zadanie #${id} zostało pomyślnie wyrenderowane.`);
    }, 3200);
  };

  // Delete Job from History
  const handleDeleteJob = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = historyItems.filter((j) => j.id !== jobId);
    updateHistory(filtered);
    if (selectedJobForDetails?.id === jobId) setSelectedJobForDetails(null);
    onToast?.('info', 'Usunięto', `Zadanie #${jobId} zostało usunięte z historii.`);
  };

  // Reset to default mock data
  const handleResetHistory = () => {
    updateHistory(INITIAL_MOCK_HISTORY);
    onToast?.('success', 'Przywrócono historię', 'Załadowano domyślny zestaw zadań demonstracyjnych.');
  };

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onToast?.('success', 'Skopiowano', `ID zadania ${text} w schowku.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-red-600/10 via-amber-500/5 to-transparent pointer-events-none rounded-2xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Historia Renderowania Zadań (Job History)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold font-mono">
                  Lokalny Dashboard
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Przeglądaj, monitoruj i weryfikuj historyczne zadania montażu wideo z podziałem na statusy:{' '}
                <strong className="text-emerald-400">Completed</strong>,{' '}
                <strong className="text-amber-400">Pending</strong> oraz{' '}
                <strong className="text-rose-400">Error</strong>.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              onClick={handleAddMockJob}
              disabled={isSimulatingNewJob}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/40 active:scale-95 transition disabled:opacity-50"
              title="Symuluj uruchomienie nowego zadania w kolejce"
            >
              <Plus className="w-4 h-4" />
              <span>Dodaj zadanie testowe</span>
            </button>

            <button
              onClick={handleResetHistory}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              title="Przywróć domyślne zadania demonstracyjne"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetuj mocki</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Wszystkie Zadania
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{metrics.total}</span>
              <span className="text-[10px] text-slate-500 font-medium">100% całości</span>
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                {metrics.completed}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                {metrics.successRate}% sukcesu
              </span>
            </div>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                {metrics.pending}
              </span>
              <span className="text-[10px] text-amber-400 font-medium">W trakcie renderowania</span>
            </div>
          </div>

          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Error
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black text-rose-300 font-mono">
                {metrics.error}
              </span>
              <span className="text-[10px] text-rose-400 font-medium">Wymaga ponowienia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-md">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'All'
                ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>Wszystkie ({metrics.total})</span>
          </button>

          <button
            onClick={() => setStatusFilter('Completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'Completed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed ({metrics.completed})</span>
          </button>

          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'Pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending ({metrics.pending})</span>
          </button>

          <button
            onClick={() => setStatusFilter('Error')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'Error'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Error ({metrics.error})</span>
          </button>
        </div>

        {/* Search and Sort controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj po tytule, ID..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-red-500"
            >
              <option value="newest">Najnowsze pierwsze</option>
              <option value="oldest">Najstarsze pierwsze</option>
              <option value="duration">Wg czasu trwania</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List / Cards */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Brak zadań spełniających kryteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Zmień filtr statusu lub wyszukiwaną frazę, aby wyświetlić zadania z historii renderowania.
            </p>
            <button
              onClick={() => {
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700"
            >
              Wyczyść filtry
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isCompleted = job.status === 'Completed';
            const isPending = job.status === 'Pending';
            const isError = job.status === 'Error';

            return (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`bg-slate-950/80 border rounded-2xl p-4 transition-all shadow-md group ${
                  isCompleted
                    ? 'border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/40'
                    : isPending
                    ? 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/60'
                    : 'border-rose-500/30 bg-rose-950/10 hover:border-rose-500/60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left Column: Status Badge, Title & Tags */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Tag */}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Completed
                        </span>
                      )}

                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                          Pending ({job.progress}%)
                        </span>
                      )}

                      {isError && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          Error
                        </span>
                      )}

                      {/* Topic Category */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700/60">
                        {job.topicCategory}
                      </span>

                      {/* Job ID with Copy button */}
                      <button
                        onClick={(e) => handleCopy(job.id, job.id, e)}
                        className="font-mono text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 transition"
                        title="Kopiuj ID zadania"
                      >
                        {job.id}
                        {copiedId === job.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-500" />
                        )}
                      </button>

                      {/* Timestamp */}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto lg:ml-0">
                        <Clock className="w-3 h-3" />
                        {new Date(job.timestamp).toLocaleString('pl-PL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-300 transition leading-snug">
                      {job.title}
                    </h3>

                    {/* Error message snippet if error */}
                    {isError && job.errorReason && (
                      <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-2.5 text-xs text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{job.errorReason}</span>
                      </div>
                    )}

                    {/* Progress bar if pending */}
                    {isPending && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-amber-300">
                          <span>Postęp renderowania klatek FFmpeg...</span>
                          <span className="font-mono font-bold">{job.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-500"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Metadata specs */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Długość: <strong className="text-slate-200">{job.durationFormatted}</strong></span>
                      <span>•</span>
                      <span>Format: <strong className="text-slate-200">{job.resolution}</strong></span>
                      {job.fileSize && (
                        <>
                          <span>•</span>
                          <span>Rozmiar: <strong className="text-slate-200">{job.fileSize}</strong></span>
                        </>
                      )}
                      <span>•</span>
                      <span>Lektor: <strong className="text-slate-200">{job.voiceoverLanguage}</strong></span>
                    </div>
                  </div>

                  {/* Right Column: Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80 w-full lg:w-auto justify-end">
                    {/* Play Video Button for Completed Tasks */}
                    {isCompleted && job.outputUrl && (
                      <button
                        onClick={() => setPreviewVideoJob(job)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                        title="Odtwórz wideo"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-400" />
                        <span>Odtwórz</span>
                      </button>
                    )}

                    {/* Download Button for Completed */}
                    {isCompleted && (
                      <a
                        href={job.outputUrl || '#'}
                        download={job.filename || `${job.id}.mp4`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition active:scale-95"
                        title="Pobierz plik MP4"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-300" />
                        <span>Pobierz</span>
                      </a>
                    )}

                    {/* Retry Button for Error */}
                    {isError && (
                      <button
                        onClick={() => handleRetryJob(job.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-rose-950/40"
                        title="Uruchom zadanie ponownie"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Ponów próbę</span>
                      </button>
                    )}

                    {/* Details / Logs inspector */}
                    <button
                      onClick={() => setSelectedJobForDetails(job)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
                      title="Zobacz szczegółowe logi i parametry"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Szczegóły</span>
                    </button>

                    {/* Delete item */}
                    <button
                      onClick={(e) => handleDeleteJob(job.id, e)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Usuń z historii"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Details & Logs Modal */}
      <AnimatePresence>
        {selectedJobForDetails && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      Szczegóły Zadania #{selectedJobForDetails.id}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Pełne metadane techniczne, stylizacja i logi wykonawcze FFmpeg
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJobForDetails(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Title & Status */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Temat Wideo
                  </span>
                  <p className="text-sm font-bold text-white">{selectedJobForDetails.title}</p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Status:</span>
                    <span
                      className={`font-bold ${
                        selectedJobForDetails.status === 'Completed'
                          ? 'text-emerald-400'
                          : selectedJobForDetails.status === 'Pending'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {selectedJobForDetails.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Rozdzielczość:</span>
                    <span className="text-slate-200 font-semibold">{selectedJobForDetails.resolution}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Długość trwania:</span>
                    <span className="text-slate-200 font-semibold">{selectedJobForDetails.durationFormatted}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Głos TTS:</span>
                    <span className="text-slate-200 font-semibold">{selectedJobForDetails.voiceoverLanguage}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ścieżka Audio:</span>
                    <span className="text-slate-200 font-semibold">{selectedJobForDetails.audioTrackName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Styl Napisów:</span>
                    <span className="text-slate-200 font-semibold">{selectedJobForDetails.captionStyle}</span>
                  </div>
                </div>

                {/* Logs terminal box */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-red-400" />
                    Logi Konsolowe Zadania
                  </span>
                  <div className="bg-black/90 border border-slate-800/90 rounded-xl p-3 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                    {selectedJobForDetails.logs && selectedJobForDetails.logs.length > 0 ? (
                      selectedJobForDetails.logs.map((log, i) => (
                        <div
                          key={i}
                          className={`leading-relaxed ${
                            log.includes('BŁĄD') || log.includes('Error')
                              ? 'text-rose-400 font-bold'
                              : log.includes('✓') || log.includes('zakończone')
                              ? 'text-emerald-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic">Brak zapisanych logów dla tego zadania.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Data utworzenia: {new Date(selectedJobForDetails.timestamp).toLocaleString('pl-PL')}
                </span>
                <button
                  onClick={() => setSelectedJobForDetails(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Zamknij
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewVideoJob && previewVideoJob.outputUrl && (
          <VideoPreview
            videoUrl={previewVideoJob.outputUrl}
            title={previewVideoJob.title}
            fileSize={previewVideoJob.fileSize}
            jobId={previewVideoJob.id}
            variant="modal"
            autoPlay={true}
            onClose={() => setPreviewVideoJob(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
