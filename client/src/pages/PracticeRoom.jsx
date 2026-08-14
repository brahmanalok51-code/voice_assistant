import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, Mic, ArrowRight, ArrowLeft, 
  Sparkles, BookOpen, Languages 
} from 'lucide-react';
import axios from 'axios';

export default function VocabPracticeRoom() {
  const { levelId } = useParams();
  const navigate = useNavigate();

  // Normalize levelId (defaults to "1" if undefined)
  const currentLevelId = levelId || '1';

  const [levelWords, setLevelWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [wordIndex, setWordIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeMicIndex, setActiveMicIndex] = useState(null); 
  const [spokenSentences, setSpokenSentences] = useState({}); 

  // Fetch Level Data from Backend JSON Route
  useEffect(() => {
    setLoading(true);
    setErrorMessage(null);
    setWordIndex(0);
    setSpokenSentences({});
    setActiveMicIndex(null);

    axios.get(`http://localhost:5000/api/vocabulary/level/${currentLevelId}`)
      .then(res => {
        if (res.data && res.data.success && Array.isArray(res.data.words)) {
          setLevelWords(res.data.words);
        } else {
          setErrorMessage("Invalid data format received.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch level details:", err);
        setErrorMessage(
          err.response?.data?.message || `Failed to load words for Level ${currentLevelId}`
        );
        setLoading(false);
      });
  }, [currentLevelId]);

  const activeWord = levelWords[wordIndex];

  // Text-To-Speech (Speech Synthesis) Engine
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;  
      utterance.pitch = 1.0;  

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Sentence-Level Microphone Speech-To-Text Engine
  const startMicForSentence = (sentenceIdx) => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;

    rec.onstart = () => setActiveMicIndex(sentenceIdx);
    rec.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      setSpokenSentences(prev => ({ ...prev, [sentenceIdx]: spoken }));
    };
    rec.onerror = () => setActiveMicIndex(null);
    rec.onend = () => setActiveMicIndex(null);

    rec.start();
  };

  // Progress Handlers
  const handleNextWord = () => {
    setSpokenSentences({});
    setActiveMicIndex(null);

    if (wordIndex < levelWords.length - 1) {
      setWordIndex(prev => prev + 1);
    } else {
      const parsedLevel = parseInt(currentLevelId, 10);
      const savedCompleted = parseInt(localStorage.getItem('user_completed_level') || '0', 10);
      
      if (!isNaN(parsedLevel) && parsedLevel > savedCompleted) {
        localStorage.setItem('user_completed_level', parsedLevel.toString());
      }
      
      alert(`🎉 Level ${currentLevelId} Completed! Unlocking Next Level...`);
      navigate('/level');
    }
  };

  const handlePrevWord = () => {
    setSpokenSentences({});
    setActiveMicIndex(null);
    if (wordIndex > 0) {
      setWordIndex(prev => prev - 1);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center font-sans text-slate-300 gap-3">
        <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold tracking-wide text-cyan-400 animate-pulse">
          Loading Level {currentLevelId} Vocabulary...
        </p>
      </div>
    );
  }

  // Error / Empty Fallback
  if (errorMessage || !levelWords || levelWords.length === 0) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center font-sans p-6 text-center gap-4 text-slate-300">
        <p className="text-base font-bold text-rose-400">
          {errorMessage || `No vocabulary data found for Level ${currentLevelId}.`}
        </p>
        <button 
          onClick={() => navigate('/level')} 
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
        >
          Return to Levels
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-300 font-sans antialiased p-4 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Background Soft Ambient Glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15 pointer-events-none z-0" />

      {/* Top Header Controls Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4 border-b border-slate-800 relative z-10 gap-2">
        <button 
          onClick={() => navigate('/level')}
          className="px-3.5 py-2 bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl sm:rounded-2xl shadow-sm text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to</span> Levels
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-extrabold rounded-full text-xs uppercase tracking-wider">
            Level {currentLevelId} Practice
          </span>
        </div>

        <div className="px-3 py-1 bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-black rounded-xl text-xs sm:text-sm">
          Word {wordIndex + 1} of {levelWords.length}
        </div>
      </header>

      {/* Main Interactive Card */}
      <main className="max-w-4xl mx-auto w-full my-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl ring-4 ring-emerald-500/5 space-y-6 sm:space-y-8 relative overflow-hidden"
          >
            {/* Top Border Accent Line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-cyan-500/40 rounded-full" />

            {/* Word Header */}
            <div className="text-center space-y-3 pb-6 border-b border-slate-800">
              <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                Target Word #{wordIndex + 1}
              </span>
              
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {activeWord.word}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="text-xs sm:text-sm font-bold text-slate-400">
                  🗣️ {activeWord.pronunciation}
                </span>
                {activeWord.hindiPronunciation && (
                  <span className="text-xs sm:text-sm font-black text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg">
                    ({activeWord.hindiPronunciation})
                  </span>
                )}
              </div>

              {/* Hindi Meaning Badge */}
              <div className="inline-block mt-2 px-4 py-2 bg-amber-950/60 border border-amber-500/30 text-amber-400 font-bold rounded-2xl text-xs sm:text-sm shadow-sm">
                हिंदी अर्थ: {activeWord.hindiMeaning}
              </div>
            </div>

            {/* Example Sentences */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Example Sentences & Hindi Translation
                </p>
                <span className="text-[11px] font-bold text-slate-500">
                  {activeWord.sentences?.length || 0} Sentences
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {activeWord.sentences?.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 sm:p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-3 hover:border-emerald-500/30 transition-all shadow-inner"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-400">
                          Sentence 0{idx + 1}
                        </span>
                        <p className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed">
                          "{item.english}"
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-lg w-fit border border-cyan-500/20 flex items-center gap-1.5 mt-1">
                          <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> {item.hindi}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => speakText(item.english)}
                          className="px-3 py-2 bg-slate-900 border border-slate-700 text-cyan-400 hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Volume2 className="w-4 h-4 text-cyan-400" /> Listen
                        </button>

                        <button
                          onClick={() => startMicForSentence(idx)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                            activeMicIndex === idx
                              ? 'bg-emerald-500 text-slate-950 font-black animate-pulse shadow-lg shadow-emerald-500/30'
                              : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <Mic className="w-4 h-4 text-emerald-400" /> {activeMicIndex === idx ? "Listening..." : "Speak"}
                        </button>
                      </div>
                    </div>

                    {/* Live Speech Recognition Feedback */}
                    {spokenSentences[idx] && (
                      <div className="p-3 bg-slate-900/80 border border-emerald-500/30 rounded-xl text-xs space-y-1 shadow-sm">
                        <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400" /> Your Spoken Speech Result:
                        </p>
                        <p className="font-bold text-white text-sm">"{spokenSentences[idx]}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10 pt-2">
        <button
          onClick={handlePrevWord}
          disabled={wordIndex === 0}
          className="w-full sm:w-1/3 h-12 sm:h-14 bg-slate-900/60 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Previous Word
        </button>

        <button
          onClick={() => {
            const ex1 = activeWord.sentences?.[0]?.english ? ` Example one: ${activeWord.sentences[0].english}.` : '';
            const ex2 = activeWord.sentences?.[1]?.english ? ` Example two: ${activeWord.sentences[1].english}.` : '';
            speakText(`${activeWord.word}. Hindi Meaning: ${activeWord.hindiMeaning}.${ex1}${ex2}`);
          }}
          className="w-full sm:w-1/3 h-12 sm:h-14 bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Volume2 className="w-4 h-4 text-cyan-400" /> Explain Word
        </button>

        <button
          onClick={handleNextWord}
          className="w-full sm:w-1/3 h-12 sm:h-14 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          {wordIndex < levelWords.length - 1 ? "Next Word" : "Complete Level!"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

    </div>
  );
}