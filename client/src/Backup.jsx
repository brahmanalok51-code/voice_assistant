import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ArrowRight, CheckCircle, Download, RefreshCw, 
  Mic, MicOff, Volume2, VolumeX, AlertTriangle, FileText 
} from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [symptom, setSymptom] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // 0: Input, 1: Questions, 2: Final Report
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  // Voice Controls State
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Speech Recognition Ref
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition on Mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (currentStep === 0) {
          setSymptom((prev) => (prev ? prev + ' ' + transcript : transcript));
        } else {
          setCurrentAnswer(transcript);
        }
        setIsListening(false);
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error: ", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [currentStep]);

  // Trigger Text-to-Speech whenever a new question loads
  useEffect(() => {
    if (currentStep > 0 && currentStep <= questions.length && !isMuted) {
      speakText(questions[currentStep - 1]);
    }
  }, [currentStep, questions, isMuted]);

  // Text-to-Speech Utility Function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new MySpeechUtterance(text); // Using custom naming wrapper
      function MySpeechUtterance(t) {
        const u = new SpeechSynthesisUtterance(t);
        u.lang = 'en-US';
        u.rate = 1.0;
        return u;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle Speech-to-Text Microphone Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Step 1: Fetch Questions from Ollama Backend
  const handleStartAssessment = async (e) => {
    if (e) e.preventDefault();
    if (!symptom.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-questions', { symptom });
      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to communicate with the AI Server. Please ensure your Node.js server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle Sequential Question Submission
  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) return;

    const updatedAnswers = { ...answers, [questions[currentStep - 1]]: currentAnswer };
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(questions.length + 1);
      if (!isMuted) speakText("Assessment completed. You can now download your health diagnostic report.");
    }
  };

  // Step 3: Trigger Final PDF Download from Backend
  const handleDownloadInvoice = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-diagnosis', {
        answers,
        symptom
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Medical_Assessment_Report_${Date.now()}.pdf`;
      link.click();
    } catch (error) {
      console.error("Invoice Download Error:", error);
      alert("Something went wrong while generating your diagnosis invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-slate-950 font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Controls & Branding */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              ClinicalAI Engine
            </h1>
            <p className="text-xs text-slate-500 font-medium">Automated Triage System</p>
          </div>
        </div>

        {/* Global Voice Assistant Toggle Mute/Unmute */}
        {currentStep > 0 && currentStep <= questions.length && (
          <button
            onClick={() => {
              if (!isMuted) window.speechSynthesis.cancel();
              setIsMuted(!isMuted);
            }}
            className={`p-2 rounded-xl border transition-all ${
              isMuted 
                ? 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
            }`}
            title={isMuted ? "Unmute Voice Guide" : "Mute Voice Guide"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Main Glassmorphic Panel */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/40 relative">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 0: Intake Portal */}
          {currentStep === 0 && (
            <motion.div
              key="intake-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md">Step 01 // Intake</span>
                <h2 className="text-2xl font-semibold text-white tracking-tight mt-3">Describe your medical concerns</h2>
                <p className="text-sm text-slate-400">Please provide a detailed summary of your current symptoms for accurate dynamic questioning.</p>
              </div>
              
              <div className="relative">
                <textarea
                  className="w-full h-36 bg-slate-900/60 border border-white/10 rounded-2xl p-4 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none text-sm leading-relaxed"
                  placeholder="Example: I have been experiencing intense lower abdominal pain for the past 48 hours accompanied by mild nausea..."
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                />
                
                {/* Micro Input Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-4 bottom-4 p-2.5 rounded-xl transition-all ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/20' 
                      : 'bg-slate-800 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                  title="Speak through mic"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={handleStartAssessment}
                disabled={loading || !symptom.trim()}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-emerald-500/10"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4编 animate-spin" /> Analyzing Symptoms with Local Gemma Engine...
                  </>
                ) : (
                  <>
                    Initialize AI Assessment <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* STEP 1: Interactive Triage Protocol */}
          {currentStep > 0 && currentStep <= questions.length && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Modern Micro Progress Monitor */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                  <span className="text-emerald-400 uppercase tracking-wider">Evaluation Phase</span>
                  <span>{currentStep} / {questions.length} Questions Completed</span>
                </div>
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-300"
                    style={{ width: `${(currentStep / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Display Current Question */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 min-h-[90px] flex items-start gap-3">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <h3 className="text-lg font-medium text-slate-100 leading-snug">
                  {questions[currentStep - 1]}
                </h3>
              </div>

              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  className="w-full h-12 bg-slate-900/60 border border-white/10 rounded-xl px-4 pr-12 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  placeholder="Type or click the microphone to answer..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNextQuestion()}
                />
                
                {/* Question Mic Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-2 top-2 p-1.5 rounded-lg transition-all ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
                className="w-full h-12 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-white/10 font-medium rounded-xl flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99]"
              >
                Proceed to Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Processing Outcome Gateway */}
          {currentStep > questions.length && (
            <motion.div
              key="completion-gate"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/5">
                <CheckCircle className="w-7 h-7" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Assessment Finalized</h2>
                <p className="text-sm text-slate-400 mt-1">Your secure interactive data points have been successfully securely compiled.</p>
              </div>

              {/* Mini Interactive Log Viewer */}
              <div className="bg-slate-900/80 border border-white/5 rounded-2xl p-4 text-left max-h-40 overflow-y-auto text-xs space-y-3 scrollbar-thin">
                <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Patient Assessment Records:</p>
                {Object.entries(answers).map(([q, a], idx) => (
                  <div key={idx} className="border-l border-emerald-500/30 pl-2 space-y-0.5">
                    <p className="text-slate-400 font-medium">Q: {q}</p>
                    <p className="text-slate-300 italic">A: {a}</p>
                  </div>
                ))}
              </div>

              {/* Call-to-action button */}
              <button
                onClick={handleDownloadInvoice}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-indigo-500/10"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Structuring PDF Invoices...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Medical Diagnostics Invoice
                  </>
                )}
              </button>

              {/* Disclaimer */}
              <div className="flex gap-2 text-left p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[11px] text-amber-500/70 leading-normal">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Notice:</strong> This automated medical overview operates entirely locally. For valid pharmaceutical prescriptions or deep emergencies, please consult a authorized physical medical provider.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}