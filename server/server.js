import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import mongoose from 'mongoose';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import Assessment from './models/Assessment.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Routes Mount ---
app.use('/api/auth', authRoutes);
app.use('/api/user', authRoutes);

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/health_ai_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 🛠️ SAFE JSON PARSING UTILITY HELPER
const parseModelJson = (rawContent) => {
  try {
    if (!rawContent) return {};
    const cleanJsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonString);
  } catch (e) {
    console.error("Failed parsing LLM clean string execution:", e.message);
    return {};
  }
};

// 🤖 PRODUCTION-READY GROQ CLOUD INFERENCE ENGINE
const callAI = async (messagesArray) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.1-8b-instant',
      messages: messagesArray,
      temperature: 0.3,
      max_tokens: 350,
      response_format: { type: "json_object" }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY.trim()}`,
        'Content-Type': 'application/json'
      },
      timeout: 25000
    }
  );

  return response.data?.choices?.[0]?.message?.content || "{}";
};

// =========================================================================
// 🚀 SESSION INITIALIZATION
// =========================================================================
app.post('/api/session/init', async (req, res) => {
  try {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.status(200).json({
      success: true,
      message: "Session initialized successfully",
      sessionId,
    });
  } catch (error) {
    console.error("Session Init Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to initialize session",
    });
  }
});

// =========================================================================
// 💬 ROUTE 1: LIVE VOICE/CHAT CONVERSATION PIPELINE
// =========================================================================
app.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage || !userMessage.trim()) {
    return res.status(400).json({ error: "User message is required." });
  }

  const systemInstructions = `You are Aura, an exceptionally friendly and intelligent English Language Tutor.
Engage in an interactive conversation with the user to help them practice English.
Respond STRICTLY with a valid JSON object matching this exact structure:
{
  "reply": "Your natural reply combined with the next interesting practice question here"
}`;

  const messages = [
    { role: "system", content: systemInstructions },
    { role: "user", content: userMessage }
  ];

  try {
    const rawContent = await callAI(messages);
    const parsed = parseModelJson(rawContent);
    const finalReply = parsed.reply || "That is very interesting! Could you tell me more about it?";

    res.json({
      success: true,
      reply: finalReply
    });
  } catch (error) {
    console.error("Chat API Execution Bottleneck:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      reply: "I understand what you mean. That sounds wonderful! What else would you like to share about this topic?" 
    });
  }
});

// =========================================================================
// 🎯 ROUTE 2: CHOOSE TOPIC & ASK THE INITIAL PRACTICE QUESTION
// =========================================================================
app.post('/api/generate-questions', async (req, res) => {
  const { symptom } = req.body;
  const practiceTopic = symptom || "General Everyday Conversation";

  const messages = [
    {
      role: "system",
      content: `You are an expert, highly encouraging English Language Tutor.
The student wants to practice conversation on the topic: "${practiceTopic}".
Respond STRICTLY with a valid JSON object matching this exact structure:
{ 
  "category": "conversation_topic",
  "nextQuestion": "Your natural conversational English practice question here",
  "tutorNote": "An encouraging opening tip welcoming them to this conversation segment."
}`
    },
    {
      role: "user",
      content: `Please generate an initial question for practice topic: ${practiceTopic}`
    }
  ];

  try {
    const modelOutput = await callAI(messages);
    const parsed = parseModelJson(modelOutput);
    
    res.json({
      success: true,
      category: practiceTopic,
      nextQuestion: parsed.nextQuestion || "What are your primary thoughts regarding this topic?",
      tutorFeedback: parsed.tutorNote || "Let's begin practicing! I am ready to evaluate your inputs."
    });

  } catch (error) {
    console.error("Groq Question Ingestion Error:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: "Internal server bottleneck.", 
      message: "Failed to initialize conversational tutor engine frameworks." 
    });
  }
});

// =========================================================================
// 🌐 ROUTE 3: STRICT REAL-TIME GRAMMAR CHECK & FLOATING CORRECTIONS HUB
// =========================================================================
const LANGUAGE_TOOL_API = 'https://api.languagetoolplus.com/v2/check';

app.post('/api/validate-answer', async (req, res) => {
  const { currentQuestion, currentAnswer } = req.body;

  if (!currentAnswer || !currentAnswer.trim()) {
    return res.json({ 
      isValid: false, 
      grammarCorrected: "", 
      suggestions: [] 
    });
  }

  // 🔍 PHASE 1: Run LanguageTool API
  let grammarSuggestions = [];
  try {
    const ltParams = new URLSearchParams();
    ltParams.append('text', currentAnswer);
    ltParams.append('language', 'en-US');

    const ltResponse = await axios.post(LANGUAGE_TOOL_API, ltParams, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (ltResponse.data && ltResponse.data.matches) {
      grammarSuggestions = ltResponse.data.matches.map(match => ({
        message: match.message,
        offset: match.offset,
        length: match.length,
        replacements: match.replacements.slice(0, 3).map(r => r.value)
      }));
    }
  } catch (ltError) {
    console.warn("⚠️ LanguageTool public pipeline temporarily offline:", ltError.message);
  }

  // 🧠 PHASE 2: Run Polishing & Validation via Groq
  const messages = [
    {
      role: "system",
      content: `You are an elite English Language Tutor evaluating a student's response inside a live discussion thread.
Tutor Question: "${currentQuestion}"
Student Response: "${currentAnswer}"
Respond STRICTLY with a valid JSON object matching this structure:
{ 
  "isValid": true,
  "correctedText": "Polished native expression version of user input"
}`
    },
    {
      role: "user",
      content: `Evaluate and polish the student response: "${currentAnswer}"`
    }
  ];

  try {
    const modelOutput = await callAI(messages);
    const validation = parseModelJson(modelOutput);
    const isValid = validation && typeof validation.isValid === 'boolean' ? validation.isValid : true;
    const correctedText = validation?.correctedText || currentAnswer;

    res.json({
      isValid: isValid,
      originalAnswer: currentAnswer,
      grammarCorrected: correctedText,
      hasGrammarIssues: grammarSuggestions.length > 0 || correctedText.toLowerCase().trim() !== currentAnswer.toLowerCase().trim(),
      suggestions: grammarSuggestions 
    });

  } catch (error) {
    console.error("English Validation Pipeline Recovery Triggered:", error.response?.data || error.message);
    res.json({ 
      isValid: true, 
      grammarCorrected: currentAnswer, 
      hasGrammarIssues: false,
      suggestions: [] 
    });
  }
});

// =========================================================================
// 🗄️ ROUTE 4: DASHBOARD PERFORMANCE / HISTORY
// =========================================================================
app.get('/api/history', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    const records = await Assessment.find(filter)
      .select('symptom diagnosis createdAt _id') 
      .sort({ createdAt: -1 })
      .lean(); 

    res.json({
      success: true,
      count: records.length,
      history: records
    });

  } catch (error) {
    console.error("History Listing Fetch Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch English practice session history records." 
    });
  }
});

// =========================================================================
// 🔍 ROUTE 5: SINGLE HISTORICAL LOG DETAILS
// =========================================================================
app.get('/api/history/:id', async (req, res) => {
  try {
    const sessionDetail = await Assessment.findById(req.params.id);
    if (!sessionDetail) {
      return res.status(404).json({ success: false, error: "Target practice log file not found." });
    }
    res.json({ success: true, session: sessionDetail });
  } catch (error) {
    console.error("Single Session Detailed Log Fetch Error:", error);
    res.status(500).json({ success: false, error: "Failed to load detailed conversation log fields." });
  }
});

// =========================================================================
// 🗑️ ROUTE 6: REMOVE LOG
// =========================================================================
app.delete('/api/history/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecord = await Assessment.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ success: false, error: "Practice session record not found." });
    }
    res.json({ 
      success: true, 
      message: "Practice session history successfully deleted.",
      deletedId: id
    });
  } catch (error) {
    console.error("Delete Pipeline Processing Error:", error);
    res.status(500).json({ success: false, error: "Failed to delete the selected practice session log data." });
  }
});

// =========================================================================
// 📚 VOCABULARY LEVELS ROUTE
// =========================================================================
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'words.json');

const getVocabularyData = () => {
  const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
  return JSON.parse(rawData);
};

app.get('/api/vocabulary/level/:levelId', async (req, res) => {
  const { levelId } = req.params;

  try {
    const allData = getVocabularyData();
    const words = allData[levelId.toString()];

    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No vocabulary list found for Level ${levelId}`
      });
    }

    return res.json({
      success: true,
      levelNumber: parseInt(levelId, 10),
      totalWords: words.length,
      words: words
    });
  } catch (error) {
    console.error(`Error reading level ${levelId} from JSON:`, error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching level data."
    });
  }
});

// --- Server Listener ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aura English Tutor Server running smoothly on Port: ${PORT}`);
});