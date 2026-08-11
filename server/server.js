import express from 'express';
import cors from 'cors';
import ollama from 'ollama';
import PDFDocument from 'pdfkit';
import mongoose from 'mongoose';
import axios from 'axios';
import Assessment from './models/Assessment.js'; // Ensure your model schema matches the field inputs below
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// --- MongoDB Local Connection ---
mongoose.connect('mongodb://localhost:27017/health_ai_db')
  .then(() => console.log('✅ Successfully connected to MongoDB Local'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 🛠️ SAFE JSON PARSING UTILITY HELPER
const parseModelJson = (rawContent) => {
  try {
    if (!rawContent) return {};
    // Clean potential markdown code blocks wrapped around the JSON response string
    const cleanJsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonString);
  } catch (e) {
    console.error("Failed parsing LLM clean string execution:", e.message);
    return {};
  }
};


// 💬 UPDATED: LIVE VOICE/CHAT CONVERSATION PIPELINE WITH OPEN QUESTION GENERATOR
app.post('/api/chat', async (req, res) => {
  const { userMessage, sessionId } = req.body;

  if (!userMessage || !userMessage.trim()) {
    return res.status(400).json({ error: "User message is required." });
  }

  // 🧠 ENHANCED PHI3 SPECIFICATION: Forces model to respond AND ask a counter-question to keep the conversation loop alive
  const systemPrompt = `
    You are Aura, an exceptionally friendly and intelligent English Language Tutor.
    Engage in an interactive conversation with the user to help them practice English.

    User's Input: "${userMessage}"

    Perform these two tasks:
    1. Reply naturally and supportively to what the user just said in 1 or 2 fluent sentences.
    2. Ask an engaging, open-ended follow-up question related to the topic to keep the conversation flowing.

    Respond STRICTLY with a valid JSON object matching this exact structure:
    {
      "reply": "Your natural reply combined with the next interesting practice question here"
    }
  `;

  try {
    const response = await ollama.chat({
      model: 'phi3',
      messages: [{ role: 'user', content: systemPrompt }],
      format: 'json',
      options: {
        temperature: 0.5, // Slightly higher for dynamic natural conversations
        num_predict: 250
      }
    });

    const parsed = parseModelJson(response.message.content);
    const finalReply = parsed.reply || "That is very interesting! Could you tell me more about it?";

    res.json({
      success: true,
      reply: finalReply
    });
  } catch (error) {
    console.error("Chat API Execution Bottleneck:", error);
    res.status(500).json({ 
      success: false, 
      reply: "I understand what you mean. That sounds wonderful! What else would you like to share about this topic?" 
    });
  }
});

// =========================================================================
// 🚀 ROUTE 1: INGESTION HUB — CHOOSE TOPIC & ASK THE INITIAL PRACTICE QUESTION
// =========================================================================
app.post('/api/generate-questions', async (req, res) => {
  const { symptom } = req.body; // 'symptom' parameter maps directly as the practice topic text context
  const practiceTopic = symptom || "General Everyday Conversation";

  // 🧠 ENHANCED PHI3 TUTOR PROMPT: Initializes the interactive discussion module cleanly
  const systemPrompt = `
    You are an expert, highly encouraging English Language Tutor.
    The student wants to practice conversation on the topic: "${practiceTopic}".

    Perform these steps:
    1. Acknowledge the topic gracefully in one brief introductory sentence.
    2. Generate an open-ended, interesting follow-up question that encourages the student to write a detailed response.
    3. Ensure the question uses clear, standard, and natural English grammar structures.

    Respond STRICTLY with a valid JSON object matching this exact structure:
    { 
      "category": "conversation_topic",
      "nextQuestion": "Your natural conversational English practice question here",
      "tutorNote": "An encouraging opening tip welcoming them to this conversation segment."
    }
  `;

  try {
    const response = await ollama.chat({
      model: 'phi3', 
      messages: [{ role: 'user', content: systemPrompt }],
      format: 'json',
      options: { 
        temperature: 0.4, // Balanced for engaging conversational variants
        num_predict: 350   
      }
    });

    const parsed = parseModelJson(response.message.content);
    
    res.json({
      success: true,
      category: practiceTopic,
      nextQuestion: parsed.nextQuestion || "What are your primary thoughts regarding this topic?",
      tutorFeedback: parsed.tutorNote || "Let's begin practicing! I am ready to evaluate your inputs."
    });

  } catch (error) {
    console.error("Ollama Phi3 Question Ingestion Error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server bottleneck.", 
      message: "Failed to initialize conversational tutor engine frameworks." 
    });
  }
});

// =========================================================================
// 🌐 ROUTE 2: STRICT REAL-TIME GRAMMAR CHECK & FLOATING CORRECTIONS HUB
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

  // 🔍 PHASE 1: Run LanguageTool API to harvest explicit character offsets and typos
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

  // 🧠 PHASE 2: Run Phi-3 Mini for high-context natural rephrasing outputs
  const systemPrompt = `
    You are an elite English Language Tutor evaluating a student's response inside a live discussion thread.
    
    Context Mapping:
    Tutor Question: "${currentQuestion}"
    Student Response: "${currentAnswer}"

    Verify and Correct:
    1. Set "isValid" to false ONLY if the response is completely blank, automated bot spam, or absolute gibberish.
    2. Provide a beautifully polished, grammatically flawless, and native-sounding phrasing of their input in the "correctedText" key.
    3. If their statement is already 100% fluent and natural, make the "correctedText" completely identical to the original input string.

    Respond STRICTLY with a valid JSON object matching this structure:
    { 
      "isValid": true_or_false,
      "correctedText": "Polished native expression version of user input"
    }
  `;

  try {
    const response = await ollama.chat({
      model: 'phi3', 
      messages: [{ role: 'user', content: systemPrompt }],
      format: 'json',
      options: { 
        temperature: 0.2, 
        num_predict: 250 
      }
    });

    const validation = parseModelJson(response.message.content);
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
    console.error("English Validation Pipeline Crash Recovery Triggered:", error);
    res.json({ 
      isValid: true, 
      grammarCorrected: currentAnswer, 
      hasGrammarIssues: false,
      suggestions: [] 
    });
  }
});


// =========================================================================
// 🗄️ ROUTE 4: DASHBOARD PERFORMANCE LIGHTWEIGHT RECOVERY HUB
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
      error: "Failed to fetch English practice session history records from storage layers." 
    });
  }
});

// =========================================================================
// 🔍 ROUTE 5: SINGLE HISTORICAL LOG DETAILS PULL PIPELINE
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
// 🗑️ ROUTE 6: REMOVE AND PURGE SYSTEM DATABASE ASSESSMENTS
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

// ============================== levels code ===============================================

// 🌟 ADDED HELPER FUNCTION FOR HINDI TRANSLATION
const translateToHindi = async (text) => {
  if (!text || text.trim().length === 0) return text;
  try {
    const res = await axios.get(`https://api.mymemory.translated.net/get`, {
      params: { q: text, langpair: 'en|hi' },
      timeout: 4000
    });
    return res.data.responseData.translatedText || text;
  } catch (err) {
    console.error(`Hindi Translation Error for "${text}":`, err.message);
    return text;
  }
};

const fetchWordsByLevel = async (levelNum = 1) => {
  try {
    // Basic difficulty keywords based on Level Number
    const levelTopics = {
      1: "easy",
      2: "action",
      3: "opinion",
      4: "business",
      5: "academic"
    };

    const topic = levelTopics[levelNum] || "general";
    
    // Datamuse API call
    const response = await axios.get(`https://api.datamuse.com/words`, {
      params: {
        ml: topic,   // Means Like (topic/context)
        max: 40,     // 🌟 CHANGE 1: Pool size 20 se badha kar 40 kiya taaki 10 unique words aaram se mil sakein
        md: 'f'      // Include frequency metadata
      },
      timeout: 4000
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No words returned from Datamuse");
    }

    // Only clean single words
    const sortedWords = response.data
      .filter(item => item.word.length > 3 && !item.word.includes(' ')) 
      .map(item => item.word);

    // 🌟 CHANGE 2: .slice() ranges ko 5 se badha kar 10-10 ke gap par set kiya
    let selectedWords = [];
    if (levelNum === 1) {
      selectedWords = sortedWords.slice(0, 10); // Take top 10 common words
    } else if (levelNum === 2) {
      selectedWords = sortedWords.slice(5, 15); // Shift and take 10 words
    } else if (levelNum === 3) {
      selectedWords = sortedWords.slice(10, 20);
    } else if (levelNum === 4) {
      selectedWords = sortedWords.slice(15, 25);
    } else {
      selectedWords = sortedWords.slice(20, 30); // Advanced rare 10 words
    }

    // Check if we have at least 10 words, else fallback to top 10 from sorted list
    return selectedWords.length >= 10 ? selectedWords.slice(0, 10) : sortedWords.slice(0, 10);

  } catch (error) {
    console.error("Datamuse API Fetch Error, using fallback words:", error.message);
    // 🌟 CHANGE 3: Fallback arrays me bhi 10 words pure kar diye (in case API down ho)
    const fallbacks = {
      1: ["happy", "bright", "simple", "clean", "quick", "smile", "friend", "learn", "speak", "laugh"],
      2: ["appreciate", "consistent", "encourage", "generous", "improve", "practice", "routine", "effort", "honest", "stable"],
      3: ["frequent", "reluctant", "persuade", "cautious", "accurate", "observe", "neglect", "imagine", "various", "wonder"],
      4: ["elaborate", "inevitable", "substantial", "advocate", "prevalent", "strategy", "revenue", "analyze", "execute", "manage"],
      5: ["meticulous", "resilient", "pragmatic", "versatile", "scrutinize", "paradox", "ambiguous", "cognitive", "eloquent", "advocate"]
    };
    return fallbacks[levelNum] || fallbacks[1];
  }
};
// =================================================================
// ROUTE 7:  Get Dynamic Level Data with Dictionary & Translation
// =================================================================

app.get('/api/vocabulary/dynamic-level/:levelNum', async (req, res) => {
  const levelNum = parseInt(req.params.levelNum, 10) || 1;

  try {
    // 🌟 1. DYNAMICALLY FETCH WORDS BASED ON LEVEL (NO STATIC OBJECT)
    const wordsList = await fetchWordsByLevel(levelNum);

    const fetchedWordsPromises = wordsList.map(async (wordStr) => {
      let phoneticText = wordStr;
      let rawExamples = [];

      // 🌟 2. Fetch Dictionary Details & Example Sentences
      try {
        const dictRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordStr}`, { timeout: 3000 });
        const entry = dictRes.data[0];
        phoneticText = entry.phonetic || (entry.phonetics && entry.phonetics[0] ? entry.phonetics[0].text : wordStr);

        entry.meanings.forEach(meaning => {
          meaning.definitions.forEach(def => {
            if (def.example) rawExamples.push(def.example);
          });
        });
      } catch (dictErr) {
        console.warn(`Free Dictionary API skipped for "${wordStr}"`);
      }

      // Fallback sentences if dictionary doesn't have examples
      if (rawExamples.length === 0) {
        rawExamples = [
          `I always try to use the word ${wordStr} in my daily conversation.`,
          `Learning how to use ${wordStr} correctly will improve your speaking skills.`
        ];
      }
      const selectedExamples = rawExamples.slice(0, 2);

      // 🌟 3. Translate Word & Sentences to Hindi
      const [hindiMeaning, formattedSentences] = await Promise.all([
        translateToHindi(wordStr),
        Promise.all(
          selectedExamples.map(async (sentenceEn) => {
            const sentenceHi = await translateToHindi(sentenceEn);
            return { english: sentenceEn, hindi: sentenceHi };
          })
        )
      ]);

      return {
        word: wordStr,
        pronunciation: phoneticText,
        hindiMeaning: hindiMeaning,
        sentences: formattedSentences
      };
    });

    const finalLevelWords = await Promise.all(fetchedWordsPromises);
    res.json({ success: true, levelNumber: levelNum, words: finalLevelWords });

  } catch (error) {
    console.error("Dynamic Vocabulary Route Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch dynamic level words." });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aura English Tutor Server running smoothly on Port: ${PORT}`);
});