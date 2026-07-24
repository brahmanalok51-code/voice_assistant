import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, Calendar, Download, Trash2, 
  RefreshCw, FileText, Eye, Sparkles, BookOpen, X, MessageSquare
} from 'lucide-react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function HistoryDashboard({ onDownloadInvoice }) {
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // 📥 Fetch all logs from MongoDB
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/history`);
      // Backend structured matching wrapper array extraction
      if (response.data && response.data.history) {
        setHistoryRecords(response.data.history);
      } else {
        setHistoryRecords(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 🔍 Pull specific data indices when user activates modal window detail request
  const handleOpenDetails = async (recordId) => {
    try {
      const res = await axios.get(`${apiUrl}/api/history/${recordId}`);
      if (res.data && res.data.session) {
        setSelectedRecord(res.data.session);
      }
    } catch (err) {
      console.error("Failed to fetch detailed conversation logs:", err);
    }
  };

  // 🗑️ Delete History Record Pipeline Handler
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this practice session log?")) return;
    
    setDeletingId(id);
    try {
      await axios.delete(`${apiUrl}/api/history/${id}`);
      setHistoryRecords(historyRecords.filter(record => record._id !== id));
      if (selectedRecord && selectedRecord._id === id) {
        setSelectedRecord(null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-2 sm:px-4 text-left">
      
      {/* 🚀 HEADER SUB-SURFACE CONTAINER */}
      <div className="flex justify-between items-center bg-white border border-[#E7EDF4] shadow-[0_4px_20px_rgba(23,61,87,0.02)] rounded-2xl p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#173D57]/5 text-[#173D57] rounded-xl">
            <History className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#173D57] tracking-tight">Practice History Hub</h2>
            <p className="text-xs text-[#6B7A8A] font-semibold">Track and review your everyday conversational English progress</p>
          </div>
        </div>
        
        <button 
          onClick={fetchHistory} 
          disabled={loading}
          className="p-2.5 bg-[#F7F9FC] hover:bg-[#E7EDF4] border border-[#E7EDF4] rounded-xl text-[#173D57] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          title="Sync Session Records"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#4AAEDB]' : ''}`} />
        </button>
      </div>

      {/* 🔮 MAIN DATA STATES INTERACTIVE RENDER LAYER */}
      {loading && historyRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-[#E7EDF4] shadow-sm rounded-3xl">
          <RefreshCw className="w-9 h-9 text-[#4AAEDB] animate-spin" />
          <p className="text-xs text-[#6B7A8A] font-bold uppercase tracking-widest">Syncing system database logs...</p>
        </div>
      ) : historyRecords.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-[#E7EDF4] rounded-3xl p-6">
          <FileText className="w-12 h-12 text-[#6B7A8A]/40 mx-auto mb-4" />
          <h3 className="text-base font-bold text-[#173D57]">No Sessions Logged Yet</h3>
          <p className="text-xs text-[#6B7A8A] max-w-sm mx-auto mt-1 font-semibold leading-relaxed">
            Complete your initial live dialogue module interface to generate tracking indexes and performance data matrices.
          </p>
        </div>
      ) : (
        /* 💻 DYNAMIC 2-COLUMN LUXURY DASHBOARD GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {historyRecords.map((record) => {
            // Safe alignment parser logic for handling deep nested database keys
            const feedbackSummary = record.diagnosis?.overallFeedback || "Session successfully logged.";
            const displayTopic = record.symptom || "General Conversation Module";

            return (
              <motion.div
                key={record._id}
                whileHover={{ y: -2 }}
                className="bg-white border border-[#E7EDF4] shadow-[0_8px_32px_0_rgba(23,61,87,0.04)] hover:border-[#4AAEDB]/60 rounded-2xl p-5 flex flex-col justify-between gap-5 transition-all duration-300 relative group"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center w-full gap-2">
                    <span className="text-[10px] bg-[#F7F9FC] border border-[#E7EDF4] text-[#6B7A8A] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold uppercase tracking-wide">
                      <Calendar className="w-3.5 h-3.5 text-[#4AAEDB]" /> 
                      {new Date(record.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#173D57] bg-[#4AAEDB]/10 border border-[#4AAEDB]/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#4AAEDB]" /> Tutor Session
                    </span>
                  </div>

                  <div className="text-left space-y-0.5">
                    <h4 className="text-[10px] font-extrabold text-[#6B7A8A] uppercase tracking-widest">Discussion Module</h4>
                    <p className="text-base font-black text-[#2A2A2A] truncate tracking-tight">{displayTopic}</p>
                  </div>

                  <div className="text-left space-y-1">
                    <h4 className="text-[10px] font-extrabold text-[#6B7A8A] uppercase tracking-widest">Tutor Evaluation Abstract</h4>
                    <p className="text-xs text-[#6B7A8A] font-semibold leading-relaxed line-clamp-2">
                      {feedbackSummary}
                    </p>
                  </div>
                </div>

                {/* --- CARD ACTION TRIGGER BLOCK --- */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#E7EDF4]">
                  <button
                    onClick={() => handleOpenDetails(record._id)}
                    className="flex-1 h-10 bg-[#F7F9FC] hover:bg-[#173D57] border border-[#E7EDF4] hover:border-[#173D57] rounded-xl text-xs font-bold text-[#173D57] hover:text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer group-hover:shadow-inner"
                  >
                    <Eye className="w-4 h-4 text-[#4AAEDB]" /> View Analytics
                  </button>
                  
                  <button
                    onClick={() => onDownloadInvoice(record.qaPairs, record.symptom)}
                    className="p-2.5 bg-[#4AAEDB]/10 hover:bg-[#4AAEDB] text-[#173D57] hover:text-white rounded-xl border border-[#4AAEDB]/20 transition-all cursor-pointer"
                    title="Export Evaluation PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={(e) => handleDelete(record._id, e)}
                    disabled={deletingId === record._id}
                    className="p-2.5 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl border border-rose-100 hover:border-rose-500 transition-all disabled:opacity-40 cursor-pointer"
                    title="Purge Log Record"
                  >
                    {deletingId === record._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 bg-[#173D57]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              className="w-full max-w-xl bg-white border border-[#E7EDF4] rounded-3xl p-6 shadow-[0_25px_60px_-15px_rgba(23,61,87,0.25)] relative max-h-[85vh] flex flex-col text-left"
            >
              {/* Modal Top Floating Header */}
              <div className="flex justify-between items-start border-b border-[#E7EDF4] pb-4 mb-4">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-[#173D57] tracking-tight">Session Analytics Evaluation</h3>
                  <p className="text-[10px] font-mono text-[#6B7A8A]">Log Matrix Reference: {selectedRecord._id}</p>
                </div>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 bg-[#F7F9FC] border border-[#E7EDF4] rounded-xl text-[#6B7A8A] hover:text-[#173D57] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Report Content Fields */}
              <div className="overflow-y-auto pr-1 space-y-5 no-scrollbar flex-grow">
                
                <div className="space-y-1">
                  <h4 className="text-[10px] font-extrabold text-[#6B7A8A] uppercase tracking-widest">Active Discussion Focus</h4>
                  <p className="text-base font-black text-[#2A2A2A]">{selectedRecord.symptom || "General Discussion"}</p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-extrabold text-[#6B7A8A] uppercase tracking-widest">Tutor Performance Summary</h4>
                  <div className="bg-[#F7F9FC] border border-[#E7EDF4] p-4 rounded-2xl text-xs sm:text-sm font-semibold text-[#2A2A2A] leading-relaxed">
                    {selectedRecord.diagnosis?.overallFeedback}
                  </div>
                </div>

                {/* Deep Interactive Dialogue Log History Extraction Engine */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold text-[#6B7A8A] uppercase tracking-widest flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#4AAEDB]" /> Dialogue Log History ({Object.keys(selectedRecord.qaPairs || {}).length} Exchanges)
                  </h4>
                  <div className="space-y-3 bg-[#F7F9FC] border border-[#E7EDF4] p-4 rounded-2xl max-h-48 overflow-y-auto no-scrollbar text-xs">
                    {selectedRecord.qaPairs && Object.entries(selectedRecord.qaPairs).map(([q, a], i) => (
                      <div key={i} className="border-l-2 border-[#4AAEDB] pl-3 space-y-1 pb-1 mb-2 last:mb-0 text-left">
                        <p className="text-[#173D57] font-bold">Tutor: {q}</p>
                        <p className="text-[#2A2A2A] font-medium bg-white px-2.5 py-1.5 rounded-xl border border-[#E7EDF4] inline-block mt-0.5 shadow-sm italic">
                          User: "{a}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold text-[#6B7A8A] uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Actionable Language Optimization Tips
                  </h4>
                  <ul className="text-xs space-y-2 text-[#2A2A2A]">
                    {selectedRecord.diagnosis?.tips && selectedRecord.diagnosis.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-[#F7F9FC] border border-[#E7EDF4] p-3 rounded-xl font-semibold">
                        <span className="w-2 h-2 bg-[#4AAEDB] rounded-full shrink-0 mt-1.5" /> 
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Bottom Fixed Actions Drawer */}
              <div className="pt-4 border-t border-[#E7EDF4] mt-4">
                <button
                  onClick={() => {
                    onDownloadInvoice(selectedRecord.qaPairs, selectedRecord.symptom);
                    setSelectedRecord(null);
                  }}
                  className="w-full h-12 bg-gradient-to-r from-[#173D57] via-[#245475] to-[#173D57] text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#173D57]/10 tracking-widest uppercase cursor-pointer hover:opacity-95 transition-all"
                >
                  <Download className="w-4 h-4 text-[#4AAEDB]" /> Export Performance Evaluation PDF
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}