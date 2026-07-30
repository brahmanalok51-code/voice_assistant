import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, History, User, Cpu, 
  Mic, Volume2, MicOff, RefreshCw, FileText, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import ai from "./assets/ai-assistant.avif";
import vdo from "./assets/ai-assist-2.mp4";
import { useNavigate } from 'react-router';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuraChat() {
  // --- VOICE & CHAT STATES ---
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('General Introduction');
  const [conversationMap, setConversationMap] = useState({});

  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const isProcessingRef = useRef(false);
  const continuousModeRef = useRef(false); // Crucial: Dynamic global pointer loop control
  const chatBottomRef = useRef(null);

  // Automatically plays video when sound/speaking is true, pauses when false
const videoRef = useRef(null);

useEffect(() => {
  if (!videoRef.current) return;

  if (isSpeaking) {
    videoRef.current.play().catch(() => {});
  } else {
    videoRef.current.pause();
    videoRef.current.currentTime = 0; // Resets video back to the starting frame
  }
}, [isSpeaking]);


  // Auto-scroll chat box when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveTranscript]);

 // 🌟 Updated Text-To-Speech Engine (Female Voice Forced)
const speakText = (text, onCompleteCallback) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Clears any pending speech
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Speaking speed
    utterance.pitch = 1.2; // Pitch badhane se voice female accent ke pass jati hai

    // 👩 FEMALE VOICE SELECTOR LOGIC
    const voices = window.speechSynthesis.getVoices();
    
    // System mein available Female voices search karein (e.g., Zira, Samantha, Google US English Female)
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Female') || 
       voice.name.includes('Zira') || 
       voice.name.includes('Samantha') || 
       voice.name.includes('Google US English') || 
       voice.name.includes('Victoria'))
    );

    // Agar female voice mil jaye toh apply karein, warna pitch high karke chalaein
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onCompleteCallback) onCompleteCallback();
    };

    utterance.onerror = (err) => {
      console.error("Speech Synthesis Error:", err);
      setIsSpeaking(false);
      if (onCompleteCallback) onCompleteCallback();
    };

    window.speechSynthesis.speak(utterance);
  } else if (onCompleteCallback) {
    onCompleteCallback();
  }
};

  // 🌟 2. Mic Activation Helper
  const startListening = () => {
    // Agar AI bol raha hai ya request processing mein hai, toh mic start mat karo
    if (isProcessingRef.current || window.speechSynthesis.speaking) return;
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.log("Mic operational notice:", err.message);
      }
    }
  };

  // 🌟 3. Initialize Web Speech Engine & Session on Mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false; 
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        setLiveTranscript(transcript);

        // Auto Send to AI when user finishes sentence
        if (event.results[0].isFinal && transcript.trim()) {
          rec.stop(); // Safe speech detection halt
          handleSendMessage(transcript);
        }
      };

      rec.onerror = (e) => {
        console.error("Mic Recognition Error:", e.error);
        setIsListening(false);
        
        // Loop Recovery Protection: Agar continuous mode active hai aur noise error aaye, toh mic reset karo
        if (continuousModeRef.current && e.error !== 'aborted') {
          setTimeout(() => startListening(), 1000);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        // Chain Reaction: Agar continuous mode true hai aur AI processing nahi kar raha, toh mic zinda rakho
        if (continuousModeRef.current && !isProcessingRef.current && !window.speechSynthesis.speaking) {
          setTimeout(() => startListening(), 400);
        }
      };

      recognitionRef.current = rec;
    }

    // Load initial session on mount
    initSession();

    return () => {
      continuousModeRef.current = false;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // 🌟 4. Session Initialization Route Hook
  const initSession = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/session/init`, { userId: 'default_user' });
      setSessionId(res.data.sessionId);

      const greetingText = res.data.greeting || "Hello Alok! I am Aura, your AI English practice assistant. What topic would you like to speak about today?";
      setCurrentQuestion(greetingText);
      
      setMessages([{ 
        id: Date.now(), 
        sender: 'aurora', 
        text: greetingText, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);

    } catch (err) {
      console.error("Session Init Error:", err);
      const fallbackGreeting = "Hello Alok! I am Aura, your AI English practice assistant. Let's practice English together!";
      setMessages([{ 
        id: Date.now(), 
        sender: 'aurora', 
        text: fallbackGreeting, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 5. Main Chat Pipeline (Validates Grammar & Calls /api/chat)
  const handleSendMessage = async (userText) => {
    if (!userText.trim() || isProcessingRef.current) return;

    isProcessingRef.current = true;
    setLoading(true);
    setLiveTranscript('');

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step A: Immediate UI Update with User input
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      sender: 'user', 
      text: userText, 
      time: currentTime 
    }]);

    setConversationMap(prev => ({ ...prev, [currentQuestion]: userText }));

    try {
      // Step B: Parallel grammar evaluation trigger
      axios.post(`${apiUrl}/api/validate-answer`, {
        currentQuestion: currentQuestion,
        currentAnswer: userText
      }).then(valRes => {
        if (valRes.data && valRes.data.hasGrammarIssues) {
          setMessages(prev => [...prev, {
            id: Date.now() + 0.5,
            sender: 'system_tip',
            text: `Grammar Tip: rewrite ➔ "${valRes.data.grammarCorrected}"`,
            time: currentTime
          }]);
        }
      }).catch(err => console.warn("Grammar framework warning bypass:", err));

      // Step C: Live AI response generation fetch
      const res = await axios.post(`${apiUrl}/api/chat`, {
        sessionId,
        userMessage: userText
      });

      const aiReply = res.data.reply;
      setCurrentQuestion(aiReply); // Target tracking state adjustment

      // Step D: Append AI Reply text content to chat box
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'aurora', 
        text: aiReply, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);

      // Step E: Trigger Voice out ➔ Complete callback activates Mic instantly
      speakText(aiReply, () => {
        isProcessingRef.current = false;
        if (continuousModeRef.current) {
          startListening();
        }
      });

    } catch (err) {
      console.error("Chat API Integration Error:", err);
      isProcessingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  // 🌟 6. Toggle Hands-Free Conversation Flow Controller
  const handleToggleVoice = () => {
    if (isListening || continuousModeRef.current) {
      continuousModeRef.current = false;
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsListening(false);
      setIsSpeaking(false);
    } else {
      continuousModeRef.current = true;
      startListening();
    }
  };

  // 🌟 7. Reset Session Handler
  const handleResetSession = async () => {
    continuousModeRef.current = false;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setMessages([]);
    setLiveTranscript('');
    setConversationMap({});
    await initSession();
  };

  // 🌟 8. End Practice Log Session and Save File 
  const handleEndAndSaveSession = async () => {
    if (Object.keys(conversationMap).length === 0) {
      alert("Please engage in at least one practice exchange before finalizing.");
      return;
    }

    continuousModeRef.current = false;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/generate-report`, {
        symptom: "General English Practice Session",
        answers: conversationMap
      }, { responseType: 'blob' });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `Aura_English_Report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("Practice summary logged into DB successfully!");
      handleResetSession();
    } catch (err) {
      console.error("Report System Issue:", err);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="w-full min-h-screen bg-[#0C1721] text-white font-sans flex flex-col justify-between p-1 selection:bg-[#4AAEDB] selection:text-white overflow-hidden">
    
    {/* 🚀 TOP NAVIGATION HEADER */}
    <header className="w-full max-w-7xl mx-auto bg-[#173D57]/30 backdrop-blur-xl border border-white/10 rounded-2xl px-4 md:px-6 py-2 flex items-center justify-between shadow-2xl mb-2 shrink-0">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
        <div className="w-10 h-10 bg-gradient-to-br from-[#4AAEDB] to-[#173D57] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4AAEDB]/20 group-hover:scale-105 transition-transform">
          <Cpu className="w-6 h-6 stroke-[2]" />
        </div>
        <span className="font-black text-xl md:text-2xl tracking-wider bg-gradient-to-r from-white via-[#4AAEDB] to-cyan-300 bg-clip-text text-transparent">
          AURA
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          onClick={handleResetSession}
          title="Reset Session"
          className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#4AAEDB]' : ''}`} />
        </button>

        <button 
          onClick={handleEndAndSaveSession}
          title="End Session & Export PDF Report"
          className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden md:inline">Save Session</span>
        </button>

        <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all">
          <User className="w-4 h-4" />
        </button>

        <button 
          onClick={() => navigate("/history")}
          className="px-3.5 py-2 bg-[#173D57]/80 hover:bg-[#4AAEDB] border border-[#4AAEDB]/40 rounded-xl text-xs font-bold tracking-wide flex items-center gap-2 transition-all shadow-md shadow-[#4AAEDB]/10 group cursor-pointer"
        >
          <History className="w-4 h-4 text-[#4AAEDB] group-hover:text-white transition-colors" />
          <span className="hidden sm:inline">History</span>
        </button>
      </div>
    </header>

    {/* 🔮 MAIN INTERACTIVE BODY CONTAINER (Height locked cleanly via calculated screen bounds) */}
    <main className="w-full max-w-7xl mx-auto flex-grow h-[calc(100vh-140px)] min-h-[500px] grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative z-10 ml-0 sm:ml-10 overflow-hidden mb-2">

      {/* 👧 DESKTOP CENTER LEFT: AVATAR DISPLAY (Locked dimensions preventing image stretching or distortion) */}
      <div className="hidden lg:flex lg:col-span-5 h-full max-h-full bg-gradient-to-b from-[#173D57]/30 via-[#0C1721]/50 to-[#173D57]/20 backdrop-blur-2xl border border-white/10 rounded-3xl relative overflow-hidden flex-col justify-end items-center p-6 shadow-2xl group shrink-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#4AAEDB]/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className={`absolute top-6 right-8 w-32 h-32 border rounded-full pointer-events-none transition-all duration-500 ${
          isSpeaking ? 'border-[#4AAEDB] scale-110 animate-ping' : 'border-[#4AAEDB]/30 animate-spin-slow'
        }`} />

<div className="relative z-10 w-[100%] max-w-[400px] h-[100%] max-h-[430px] flex justify-center items-end overflow-hidden rounded-3xl">
  <video
    src={vdo} 
    ref={videoRef}
    autoPlay={isSpeaking}
    loop
    muted={false} 
    playsInline
    className={`w-full h-full object-cover rounded-3xl filter brightness-105 contrast-105 transition-all duration-300 mb-10 ${
      isSpeaking ? 'border-2 border-[#4AAEDB] shadow-lg shadow-[#4AAEDB]/30' : 'border-2 border-transparent'
    }`}
  />
</div>

        <div className="absolute bottom-6 bg-[#0C1721]/80 backdrop-blur-md border border-[#4AAEDB]/40 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-xl">
          <span className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-bounce' : isListening ? 'bg-rose-500 animate-ping' : 'bg-[#4AAEDB] animate-ping'}`} />
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#4AAEDB]">
            {isSpeaking ? 'AURORA SPEAKING...' : isListening ? 'AURORA LISTENING...' : 'AURORA ONLINE'}
          </span>
        </div>
      </div>

      {/* 💬 RIGHT SIDE: WHATSAPP STYLE CHAT CONTAINER (Clean internal routing with no-scrollbar overflow control) */}
      <div className="col-span-1 lg:col-span-6 h-full max-h-full bg-gradient-to-b from-[#173D57]/40 via-[#102333]/60 to-[#0C1721]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-y-auto no-scrollbar">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={ai} 
                className="w-11 h-11 rounded-2xl object-cover border border-[#4AAEDB]"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0C1721] rounded-full ${
                isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
              }`} />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#4AAEDB]">Girl Assistant</h3>
              <h2 className="text-lg font-black text-white tracking-wide">AURORA</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#4AAEDB]/10 border border-[#4AAEDB]/30 text-[#4AAEDB] px-3 py-1 rounded-full font-extrabold tracking-wider uppercase">
              {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Flow Active'}
            </span>
          </div>
        </div>

        {/* MESSAGES LAYER (Takes up available space and scrolls internally) */}
        <div className="flex-grow overflow-y-auto space-y-4 pr-1 no-scrollbar flex flex-col justify-end mb-2">
          <div className="space-y-4 overflow-y-auto no-scrollbar pr-1">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex flex-col ${
                    msg.sender === 'user' 
                      ? 'items-end' 
                      : msg.sender === 'system_tip' 
                      ? 'items-center my-1' 
                      : 'items-start'
                  }`}
                >
                  {msg.sender === 'system_tip' ? (
                    <div className="max-w-[90%] px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 font-medium flex items-center gap-2 shadow-sm">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{msg.text}</span>
                    </div>
                  ) : (
                    <div className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed relative text-left ${
                      msg.sender === 'user' 
                        ? 'bg-[#173D57] text-white border border-white/10 rounded-br-none shadow-md' 
                        : 'bg-gradient-to-r from-[#173D57]/90 to-[#102B3F] text-slate-100 border border-[#4AAEDB]/30 rounded-bl-none shadow-lg'
                    }`}>
                      {msg.sender === 'aurora' && (
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-extrabold text-[#4AAEDB] uppercase tracking-wider">AURORA</span>
                          <Volume2 className={`w-3.5 h-3.5 text-[#4AAEDB] ${isSpeaking ? 'animate-bounce' : ''}`} />
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>
                  )}

                  {msg.sender !== 'system_tip' && (
                    <span className="text-[9px] text-slate-500 font-bold mt-1 px-1">
                      {msg.time}
                    </span>
                  )}
                </motion.div>
              ))}

              {liveTranscript && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-end">
                  <div className="max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed bg-[#173D57]/60 text-slate-300 border border-[#4AAEDB]/30 border-dashed rounded-br-none">
                    <p className="text-left italic">{liveTranscript}...</p>
                  </div>
                  <span className="text-[9px] text-[#4AAEDB] font-bold mt-1 px-1 animate-pulse">
                    Listening live...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div ref={chatBottomRef} />
        </div>

        {/* CONTROLLER MODULE */}
        <div className="mt-auto pt-4 border-t border-white/10 flex flex-col items-center gap-3 shrink-0">
          <div className="flex items-center justify-between w-full px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-[#4AAEDB] animate-pulse'}`} /> 
              AURA VOICE 
            </span>
            <span>
              STATUS: {loading ? 'PROCESSING...' : isListening ? 'LISTENING' : isSpeaking ? 'SPEAKING' : 'HANDS-FREE STEADY'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleToggleVoice}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border transition-all duration-300 shadow-2xl cursor-pointer ${
              continuousModeRef.current
                ? 'bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white border-rose-400 shadow-rose-500/30' 
                : 'bg-gradient-to-r from-[#4AAEDB] via-[#173D57] to-[#0C1721] text-white border-[#4AAEDB]/50 hover:border-[#4AAEDB] shadow-[#4AAEDB]/20'
            }`}
          >
            {continuousModeRef.current ? (
              <>
                <MicOff className="w-5 h-5 animate-bounce" /> Loop Active ➔ Click to Pause Flow
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-[#4AAEDB]" />
                INITIATE Talking
              </>
            )}
          </motion.button>
        </div>

      </div>
    </main>
  </div>
);
}