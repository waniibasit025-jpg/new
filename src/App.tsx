import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PhoneLookupView from './components/PhoneLookupView';
import LiveLocationSharingView from './components/LiveLocationSharingView';
import SearchHistoryView from './components/SearchHistoryView';
import TelecomEducationView from './components/TelecomEducationView';
import SecurityAndContactView from './components/SecurityAndContactView';
import RecipientConsentView from './components/RecipientConsentView';
import PrivacyTermsModal from './components/PrivacyTermsModal';
import Footer from './components/Footer';
import { PhoneLookupResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lookup' | 'live' | 'history' | 'intelligence' | 'security'>('lookup');
  const [history, setHistory] = useState<PhoneLookupResult[]>([]);
  const [isHistoryPaused, setIsHistoryPaused] = useState(false);
  const [liveSharingTarget, setLiveSharingTarget] = useState<string>('');
  const [initialLookupQuery, setInitialLookupQuery] = useState<string>('');

  // Recipient consent direct link mode (e.g. from ?share=<token>)
  const [recipientToken, setRecipientToken] = useState<string | null>(null);

  // Modal states
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // Check URL query on mount for ?share=<token>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get('share');
    if (shareParam) {
      setRecipientToken(shareParam);
    }

    // Load history from localStorage
    try {
      const savedHistory = localStorage.getItem('phonetrace_history_v1');
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const paused = localStorage.getItem('phonetrace_history_paused');
      if (paused === 'true') setIsHistoryPaused(true);
    } catch (e) {
      console.error('Failed to load local history:', e);
    }
  }, []);

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem('phonetrace_history_v1', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  const handleLookupComplete = (result: PhoneLookupResult) => {
    if (isHistoryPaused) return;
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.query !== result.query && item.e164 !== result.e164);
      return [result, ...filtered].slice(0, 50); // store last 50
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('phonetrace_history_v1');
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePauseHistory = () => {
    const nextState = !isHistoryPaused;
    setIsHistoryPaused(nextState);
    try {
      localStorage.setItem('phonetrace_history_paused', String(nextState));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestLiveSharing = (phoneNumber: string) => {
    setLiveSharingTarget(phoneNumber);
    setActiveTab('live');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryQuery = (phone: string) => {
    setInitialLookupQuery(phone);
    setActiveTab('lookup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRecipientMode = (token: string) => {
    setRecipientToken(token);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitRecipientMode = () => {
    setRecipientToken(null);
    // Remove query param from URL without page reload
    if (window.history.pushState) {
      const newUrl = window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-900/40 py-1.5 px-4 text-center text-xs text-slate-300">
        <span>Official Security & Privacy Notice: Verified Telecom Intelligence Gateway. Administrator Contact: </span>
        <a href="mailto:wajhatbhai30@gmail.com" className="font-mono text-cyan-400 hover:underline font-semibold">
          wajhatbhai30@gmail.com
        </a>
      </div>

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (recipientToken) setRecipientToken(null);
          setActiveTab(tab);
        }}
        historyCount={history.length}
        activeShareSessionCount={0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {recipientToken ? (
          /* Recipient Location Sharing Screen */
          <RecipientConsentView
            token={recipientToken}
            onExit={handleExitRecipientMode}
          />
        ) : (
          /* Main Application Tabs */
          <>
            {activeTab === 'lookup' && (
              <PhoneLookupView
                onLookupComplete={handleLookupComplete}
                onRequestLiveSharing={handleRequestLiveSharing}
                initialQuery={initialLookupQuery}
              />
            )}

            {activeTab === 'live' && (
              <LiveLocationSharingView
                initialTargetPhone={liveSharingTarget}
                onOpenRecipientMode={handleOpenRecipientMode}
              />
            )}

            {activeTab === 'history' && (
              <SearchHistoryView
                history={history}
                onSelectQuery={handleSelectHistoryQuery}
                onClearHistory={handleClearHistory}
                isHistoryPaused={isHistoryPaused}
                onTogglePauseHistory={handleTogglePauseHistory}
              />
            )}

            {activeTab === 'intelligence' && (
              <TelecomEducationView />
            )}

            {activeTab === 'security' && (
              <SecurityAndContactView />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onSelectTab={(tab) => {
          if (recipientToken) setRecipientToken(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Privacy Policy & Terms Modal */}
      {legalModal && (
        <PrivacyTermsModal
          isOpen={true}
          type={legalModal}
          onClose={() => setLegalModal(null)}
        />
      )}
    </div>
  );
}
