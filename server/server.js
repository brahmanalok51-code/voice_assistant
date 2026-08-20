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
    // Strip markdown code fences if present
    const cleanJsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonString);
  } catch (e) {
    console.error("Failed parsing LLM clean string execution:", e.message);
    return {};
  }
};

// 🤖 UPDATED HUGGING FACE PHI-3.5 INFERENCE ROUTER
const callAI = async (messagesArray) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.1-8b-instant', // Ultra-fast and accurate for language tutoring & grammar
      messages: messagesArray,
      temperature: 0.3,
      max_tokens: 350,
      response_format: { type: "json_object" } // Direct strict JSON guarantee
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY.trim()}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
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
    const rawContent = await callHuggingFacePhi3(messages);
    const parsed = parseModelJson(rawContent);
    const finalReply = parsed.reply || rawContent || "That is very interesting! Could you tell me more about it?";

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

  const systemPrompt = `<|system|>
You are an expert, highly encouraging English Language Tutor.
The student wants to practice conversation on the topic: "${practiceTopic}".
Respond STRICTLY with a valid JSON object matching this exact structure:
{ 
  "category": "conversation_topic",
  "nextQuestion": "Your natural conversational English practice question here",
  "tutorNote": "An encouraging opening tip welcoming them to this conversation segment."
}
<|end|>
<|user|>
Please generate an initial question for practice topic: ${practiceTopic}
<|end|>
<|assistant|>`;

  try {
    const modelOutput = await callHuggingFacePhi3(systemPrompt);
    const parsed = parseModelJson(modelOutput);
    
    res.json({
      success: true,
      category: practiceTopic,
      nextQuestion: parsed.nextQuestion || "What are your primary thoughts regarding this topic?",
      tutorFeedback: parsed.tutorNote || "Let's begin practicing! I am ready to evaluate your inputs."
    });

  } catch (error) {
    console.error("Phi3 Question Ingestion Error:", error.response?.data || error.message);
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

  // 🧠 PHASE 2: Run Phi-3.5 via Hugging Face
  const systemPrompt = `<|system|>
You are an elite English Language Tutor evaluating a student's response inside a live discussion thread.
Tutor Question: "${currentQuestion}"
Student Response: "${currentAnswer}"
Respond STRICTLY with a valid JSON object matching this structure:
{ 
  "isValid": true,
  "correctedText": "Polished native expression version of user input"
}
<|end|>
<|user|>
Evaluate and polish the student response: "${currentAnswer}"
<|end|>
<|assistant|>`;

  try {
    const modelOutput = await callHuggingFacePhi3(systemPrompt);
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


//============================== old code dont remove it is backup code ==================

// import express from 'express';
// import cors from 'cors';
// import ollama from 'ollama';
// import PDFDocument from 'pdfkit';
// import mongoose from 'mongoose';
// import axios from 'axios';
// import path from 'path';
// import fs from 'fs';
// import Assessment from './models/Assessment.js'; // Ensure your model schema matches the field inputs below
// import authRoutes from './routes/authRoutes.js';

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());
// app.use('/api/auth', authRoutes);
// app.use('/api/auth', authRoutes);
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// app.use('/api/user', authRoutes);

// // --- MongoDB Local Connection ---
// mongoose.connect('mongodb://localhost:27017/health_ai_db')
//   .then(() => console.log('Successfully connected to MongoDB Local'))
//   .catch(err => console.error('❌ MongoDB Connection Error:', err));

// // 🛠️ SAFE JSON PARSING UTILITY HELPER
// const parseModelJson = (rawContent) => {
//   try {
//     if (!rawContent) return {};
//     // Clean potential markdown code blocks wrapped around the JSON response string
//     const cleanJsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
//     return JSON.parse(cleanJsonString);
//   } catch (e) {
//     console.error("Failed parsing LLM clean string execution:", e.message);
//     return {};
//   }
// };

// // session initialiation...
// app.post('/api/session/init', async (req, res) => {
//   try {
//     const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

//     res.status(200).json({
//       success: true,
//       message: "Session initialized successfully",
//       sessionId,
//     });
//   } catch (error) {
//     console.error("Session Init Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to initialize session",
//     });
//   }
// });


// // 💬 UPDATED: LIVE VOICE/CHAT CONVERSATION PIPELINE WITH OPEN QUESTION GENERATOR
// app.post('/api/chat', async (req, res) => {
//   const { userMessage, sessionId } = req.body;

//   if (!userMessage || !userMessage.trim()) {
//     return res.status(400).json({ error: "User message is required." });
//   }

//   // 🧠 ENHANCED PHI3 SPECIFICATION: Forces model to respond AND ask a counter-question to keep the conversation loop alive
//   const systemPrompt = `
//     You are Aura, an exceptionally friendly and intelligent English Language Tutor.
//     Engage in an interactive conversation with the user to help them practice English.

//     User's Input: "${userMessage}"

//     Perform these two tasks:
//     1. Reply naturally and supportively to what the user just said in 1 or 2 fluent sentences.
//     2. Ask an engaging, open-ended follow-up question related to the topic to keep the conversation flowing.

//     Respond STRICTLY with a valid JSON object matching this exact structure:
//     {
//       "reply": "Your natural reply combined with the next interesting practice question here"
//     }
//   `;

//   try {
//     const response = await ollama.chat({
//       model: 'phi3',
//       messages: [{ role: 'user', content: systemPrompt }],
//       format: 'json',
//       options: {
//         temperature: 0.5, // Slightly higher for dynamic natural conversations
//         num_predict: 250
//       }
//     });

//     const parsed = parseModelJson(response.message.content);
//     const finalReply = parsed.reply || "That is very interesting! Could you tell me more about it?";

//     res.json({
//       success: true,
//       reply: finalReply
//     });
//   } catch (error) {
//     console.error("Chat API Execution Bottleneck:", error);
//     res.status(500).json({ 
//       success: false, 
//       reply: "I understand what you mean. That sounds wonderful! What else would you like to share about this topic?" 
//     });
//   }
// });

// // =========================================================================
// // 🚀 ROUTE 1: INGESTION HUB — CHOOSE TOPIC & ASK THE INITIAL PRACTICE QUESTION
// // =========================================================================
// app.post('/api/generate-questions', async (req, res) => {
//   const { symptom } = req.body; // 'symptom' parameter maps directly as the practice topic text context
//   const practiceTopic = symptom || "General Everyday Conversation";

//   // 🧠 ENHANCED PHI3 TUTOR PROMPT: Initializes the interactive discussion module cleanly
//   const systemPrompt = `
//     You are an expert, highly encouraging English Language Tutor.
//     The student wants to practice conversation on the topic: "${practiceTopic}".

//     Perform these steps:
//     1. Acknowledge the topic gracefully in one brief introductory sentence.
//     2. Generate an open-ended, interesting follow-up question that encourages the student to write a detailed response.
//     3. Ensure the question uses clear, standard, and natural English grammar structures.

//     Respond STRICTLY with a valid JSON object matching this exact structure:
//     { 
//       "category": "conversation_topic",
//       "nextQuestion": "Your natural conversational English practice question here",
//       "tutorNote": "An encouraging opening tip welcoming them to this conversation segment."
//     }
//   `;

//   try {
//     const response = await ollama.chat({
//       model: 'phi3', 
//       messages: [{ role: 'user', content: systemPrompt }],
//       format: 'json',
//       options: { 
//         temperature: 0.4, // Balanced for engaging conversational variants
//         num_predict: 350   
//       }
//     });

//     const parsed = parseModelJson(response.message.content);
    
//     res.json({
//       success: true,
//       category: practiceTopic,
//       nextQuestion: parsed.nextQuestion || "What are your primary thoughts regarding this topic?",
//       tutorFeedback: parsed.tutorNote || "Let's begin practicing! I am ready to evaluate your inputs."
//     });

//   } catch (error) {
//     console.error("Ollama Phi3 Question Ingestion Error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Internal server bottleneck.", 
//       message: "Failed to initialize conversational tutor engine frameworks." 
//     });
//   }
// });

// // =========================================================================
// // 🌐 ROUTE 2: STRICT REAL-TIME GRAMMAR CHECK & FLOATING CORRECTIONS HUB
// // =========================================================================
// const LANGUAGE_TOOL_API = 'https://api.languagetoolplus.com/v2/check';

// app.post('/api/validate-answer', async (req, res) => {
//   const { currentQuestion, currentAnswer } = req.body;

//   if (!currentAnswer || !currentAnswer.trim()) {
//     return res.json({ 
//       isValid: false, 
//       grammarCorrected: "", 
//       suggestions: [] 
//     });
//   }

//   // 🔍 PHASE 1: Run LanguageTool API to harvest explicit character offsets and typos
//   let grammarSuggestions = [];
//   try {
//     const ltParams = new URLSearchParams();
//     ltParams.append('text', currentAnswer);
//     ltParams.append('language', 'en-US');

//     const ltResponse = await axios.post(LANGUAGE_TOOL_API, ltParams, {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//     });

//     if (ltResponse.data && ltResponse.data.matches) {
//       grammarSuggestions = ltResponse.data.matches.map(match => ({
//         message: match.message,
//         offset: match.offset,
//         length: match.length,
//         replacements: match.replacements.slice(0, 3).map(r => r.value)
//       }));
//     }
//   } catch (ltError) {
//     console.warn("⚠️ LanguageTool public pipeline temporarily offline:", ltError.message);
//   }

//   // 🧠 PHASE 2: Run Phi-3 Mini for high-context natural rephrasing outputs
//   const systemPrompt = `
//     You are an elite English Language Tutor evaluating a student's response inside a live discussion thread.
    
//     Context Mapping:
//     Tutor Question: "${currentQuestion}"
//     Student Response: "${currentAnswer}"

//     Verify and Correct:
//     1. Set "isValid" to false ONLY if the response is completely blank, automated bot spam, or absolute gibberish.
//     2. Provide a beautifully polished, grammatically flawless, and native-sounding phrasing of their input in the "correctedText" key.
//     3. If their statement is already 100% fluent and natural, make the "correctedText" completely identical to the original input string.

//     Respond STRICTLY with a valid JSON object matching this structure:
//     { 
//       "isValid": true_or_false,
//       "correctedText": "Polished native expression version of user input"
//     }
//   `;

//   try {
//     const response = await ollama.chat({
//       model: 'phi3', 
//       messages: [{ role: 'user', content: systemPrompt }],
//       format: 'json',
//       options: { 
//         temperature: 0.2, 
//         num_predict: 250 
//       }
//     });

//     const validation = parseModelJson(response.message.content);
//     const isValid = validation && typeof validation.isValid === 'boolean' ? validation.isValid : true;
//     const correctedText = validation?.correctedText || currentAnswer;

//     res.json({
//       isValid: isValid,
//       originalAnswer: currentAnswer,
//       grammarCorrected: correctedText,
//       hasGrammarIssues: grammarSuggestions.length > 0 || correctedText.toLowerCase().trim() !== currentAnswer.toLowerCase().trim(),
//       suggestions: grammarSuggestions 
//     });

//   } catch (error) {
//     console.error("English Validation Pipeline Crash Recovery Triggered:", error);
//     res.json({ 
//       isValid: true, 
//       grammarCorrected: currentAnswer, 
//       hasGrammarIssues: false,
//       suggestions: [] 
//     });
//   }
// });


// // =========================================================================
// // 🗄️ ROUTE 4: DASHBOARD PERFORMANCE LIGHTWEIGHT RECOVERY HUB
// // =========================================================================
// app.get('/api/history', async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const filter = userId ? { userId } : {};

//     const records = await Assessment.find(filter)
//       .select('symptom diagnosis createdAt _id') 
//       .sort({ createdAt: -1 })
//       .lean(); 

//     res.json({
//       success: true,
//       count: records.length,
//       history: records
//     });

//   } catch (error) {
//     console.error("History Listing Fetch Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: "Failed to fetch English practice session history records from storage layers." 
//     });
//   }
// });

// // =========================================================================
// // 🔍 ROUTE 5: SINGLE HISTORICAL LOG DETAILS PULL PIPELINE
// // =========================================================================
// app.get('/api/history/:id', async (req, res) => {
//   try {
//     const sessionDetail = await Assessment.findById(req.params.id);
//     if (!sessionDetail) {
//       return res.status(404).json({ success: false, error: "Target practice log file not found." });
//     }
//     res.json({ success: true, session: sessionDetail });
//   } catch (error) {
//     console.error("Single Session Detailed Log Fetch Error:", error);
//     res.status(500).json({ success: false, error: "Failed to load detailed conversation log fields." });
//   }
// });

// // =========================================================================
// // 🗑️ ROUTE 6: REMOVE AND PURGE SYSTEM DATABASE ASSESSMENTS
// // =========================================================================
// app.delete('/api/history/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedRecord = await Assessment.findByIdAndDelete(id);
//     if (!deletedRecord) {
//       return res.status(404).json({ success: false, error: "Practice session record not found." });
//     }
//     res.json({ 
//       success: true, 
//       message: "Practice session history successfully deleted.",
//       deletedId: id
//     });
//   } catch (error) {
//     console.error("Delete Pipeline Processing Error:", error);
//     res.status(500).json({ success: false, error: "Failed to delete the selected practice session log data." });
//   }
// });

// // ============================== levels code ===============================================

// const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'words.json');

// // Helper function to read data safely
// const getVocabularyData = () => {
//   const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
//   return JSON.parse(rawData);
// };

// // =================================================================
// // ROUTE: Get Static/Curated Level Data from JSON File by Level ID
// // =================================================================
// app.get('/api/vocabulary/level/:levelId', async (req, res) => {
//   const { levelId } = req.params;

//   try {
//     const allData = getVocabularyData();

//     // Check if the requested level key exists (e.g., "1", "21", "22")
//     const words = allData[levelId.toString()];

//     if (!words || !Array.isArray(words) || words.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: `No vocabulary list found for Level ${levelId}`
//       });
//     }

//     return res.json({
//       success: true,
//       levelNumber: parseInt(levelId, 10),
//       totalWords: words.length,
//       words: words
//     });
//   } catch (error) {
//     console.error(`Error reading level ${levelId} from JSON:`, error.message);
//     return res.status(500).json({
//       success: false,
//       error: "Internal server error while fetching level data."
//     });
//   }
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Aura English Tutor Server running smoothly on Port: ${PORT}`);
// });