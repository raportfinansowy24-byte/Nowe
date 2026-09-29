import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  CheckCircle2,
  Clock,
  Film,
  Play,
  Pause,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  FileVideo,
  Sparkles,
  HardDrive
} from 'lucide-react';
import { RecentCompletedJob } from '../types';
import { VideoPreview } from './VideoPreview';

interface RecentJobsSidePanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onToast?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const RecentJobsSidePanel: React.FC<RecentJobsSidePanelProps> = ({
  isOpen,
  onToggle,
  onToast
}) => {
  const [jobs, setJobs] = useState<RecentCompletedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewingJob, setPreviewingJob] = useState<RecentCompletedJob | null>(null);

  const fetchRecentCompletedJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs/recent-completed?limit=5');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      }
    } catch (err) {
      console.warn('Błąd pobierania ostatnich zadań renderowania:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentCompletedJobs();
    const interval = setInterval(fetchRecentCompletedJobs, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = (job: RecentCompletedJob) => {
    navigator.clipboard.writeText(job.downloadUrl || job.outputUrl);
    setCopiedId(job.id);
    onToast?.('success', 'Skopiowano link', 'Link do pobrania wideo został skopiowany do schowka.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <>
      {/* Floating Toggle Button when closed */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          id="btn-open-recent-jobs-panel"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-zinc-900 border-l border-t border-b border-yellow-500/40 text-white px-3 py-4 rounded-l-2xl shadow-2xl flex flex-col items-center gap-2 hover:bg-zinc-800 hover:border-yellow-400 transition-all group"
          title="Otwórz panel ostatnich 5 wyrenderowanych filmów"
        >
          <div className="relative">
            <Film className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform" />
            {jobs.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {jobs.length}
              </span>
            )}
          </div>
          <span className="writing-vertical text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:text-yellow-400">
            Historia (5)
          </span>
          <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400" />
        </motion.button>
      )}

      {/* Slide-out Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-zinc-950 border-l border-zinc-800 z-50 shadow-2xl flex flex-col text-white"
            >
              {/* Header */}
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                    <Film className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                      Ostatnie Renderowania
                      <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-mono border border-yellow-500/30">
                        Top {jobs.length}/5
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Ostatnie 5 gotowych filmów MP4
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={fetchRecentCompletedJobs}
                    disabled={loading}
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                    title="Odśwież listę zadań"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-yellow-400' : ''}`} />
                  </button>
                  <button
                    onClick={onToggle}
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                    title="Zamknij panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Jobs List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {jobs.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 my-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                      <FileVideo className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-300">Brak ukończonych zadań w tej sesji</p>
                    <p className="text-xs text-zinc-500 mt-1 max-w-[240px] mx-auto">
                      Gdy wyrenderujesz film w Auto-Pilocie lub Edytorze, pojawi się tutaj z datą i bezpośrednim linkiem.
                    </p>
                  </div>
                ) : (
                  jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 hover:border-yellow-500/40 transition-all shadow-md group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono">
                            #{index + 1}
                          </span>
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Zakończono pomyślnie
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>{job.timestampFormatted}</span>
                        </div>
                      </div>

                      {/* File details */}
                      <div className="bg-black/40 rounded-lg p-2.5 mb-3 border border-zinc-800/60 font-mono text-xs">
                        <div className="flex items-center justify-between text-zinc-300 truncate">
                          <span className="truncate font-semibold text-zinc-200" title={job.filename}>
                            {job.filename}
                          </span>
                          <span className="text-[11px] text-zinc-400 shrink-0 ml-2 bg-zinc-800 px-1.5 py-0.5 rounded">
                            {job.fileSize}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate mt-1">
                          ID: {job.id}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {/* Download link button */}
                        <a
                          href={job.downloadUrl}
                          download={job.filename}
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold transition-all shadow-sm active:scale-95"
                          title="Pobierz plik wideo MP4 na dysk"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Pobierz</span>
                        </a>

                        {/* Preview button */}
                        <button
                          onClick={() => setPreviewingJob(job)}
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all active:scale-95 border border-zinc-700/60"
                          title="Odtwórz wideo w oknie podglądu"
                        >
                          <Play className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Odtwórz</span>
                        </button>

                        {/* Copy link button */}
                        <button
                          onClick={() => handleCopyLink(job)}
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all active:scale-95 border border-zinc-700/60"
                          title="Kopiuj bezpośredni URL do schowka"
                        >
                          {copiedId === job.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">OK</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Panel Footer */}
              <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/60 text-center text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Format: 1080x1920 / 720x1280 (Shorts)</span>
                <span className="text-yellow-500/80 font-mono">18s Single Scene</span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewingJob && (
          <VideoPreview
            videoUrl={previewingJob.outputUrl}
            thumbnailUrl={previewingJob.thumbnailUrl}
            title={previewingJob.filename}
            fileSize={previewingJob.fileSize}
            jobId={previewingJob.id}
            variant="modal"
            autoPlay={true}
            onClose={() => setPreviewingJob(null)}
            onToast={onToast}
          />
        )}
      </AnimatePresence>
    </>
  );
};
