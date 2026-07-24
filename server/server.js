import express from 'express';
import cors from 'cors';
import ollama from 'ollama';
import PDFDocument from 'pdfkit';
import mongoose from 'mongoose';
import axios from 'axios';
import Assessment from './models/Assessment.js'; // Ensure your model schema matches the field inputs below

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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
// 💾 ROUTE 3: PERFORMANCE SESSION FINALIZER, DB LOGGER & PDF COMPILER
// =========================================================================
app.post('/api/generate-report', async (req, res) => {
  const { answers, symptom } = req.body; 
  const practiceTopic = symptom || "General English Conversation";

  if (!answers || Object.keys(answers).length === 0) {
    return res.status(400).json({ error: "Conversation logs are required." });
  }

  const formattedChatLog = Object.entries(answers)
    .map(([q, a]) => `Tutor Question: ${q}\nUser Response: ${a}`)
    .join('\n\n');

  const systemPrompt = `
    You are an expert English Language Performance Assessor. Review the following dialogue history:
    Topic: ${practiceTopic}
    Dialogue:
    ${formattedChatLog}

    Generate a comprehensive linguistic evaluation summarizing structural strengths, core syntax slip-ups, and clear improvement metrics.
    
    Respond STRICTLY with a valid JSON object matching this structure:
    {
      "overallFeedback": "Your clear summary performance feedback string here",
      "tips": ["Grammar structure tip 1", "Vocabulary vocabulary extension advice 2"]
    }
  `;

  try {
    const response = await ollama.chat({
      model: 'phi3',
      messages: [{ role: 'user', content: systemPrompt }],
      format: 'json', 
      options: { 
        temperature: 0.3,
        num_predict: 500 
      }
    });

    const evaluation = parseModelJson(response.message.content);

    // Save logs to MongoDB via standardized key schemas mapping
    const newAssessment = new Assessment({
      symptom: practiceTopic, 
      qaPairs: answers,       
      diagnosis: evaluation   
    });
    const savedData = await newAssessment.save();

    // 📄 TRIGGER PDF CONTEXT ENGINE
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=English_Practice_Report_${savedData._id}.pdf`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Assessment-ID');
    res.setHeader('X-Assessment-ID', savedData._id.toString());

    doc.pipe(res);

    // Render Clean UI Layout Elements (Branding Palette matching Charcoal/Navy rules)
    doc.fillColor('#173D57').fontSize(22).text('AURA ENGLISH LEARNING REPORT', { align: 'center', tracking: 1 });
    doc.moveDown(0.5);
    doc.strokeColor('#E7EDF4').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.fillColor('#6B7A8A').fontSize(9).text(`Session Reference ID: ${savedData._id}`, { align: 'right' });
    doc.fillColor('#2A2A2A').fontSize(11).text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Practice Module: Live Voice/Text Interactive Session`);
    doc.moveDown();

    doc.fillColor('#173D57').fontSize(14).text('1. Practice Conversation Topic:', { font: 'Helvetica-Bold' });
    doc.fillColor('#2A2A2A').fontSize(11).text(practiceTopic);
    doc.moveDown();

    doc.fillColor('#173D57').fontSize(14).text('2. Tutor Evaluation & Feedback:', { font: 'Helvetica-Bold' });
    doc.fillColor('#2A2A2A').fontSize(11).text(evaluation.overallFeedback || "Splendid progress inside the conversation flow modules.");
    doc.moveDown();

    doc.fillColor('#173D57').fontSize(14).text('3. Actionable Language Tips:', { font: 'Helvetica-Bold' });
    doc.fillColor('#2A2A2A').fontSize(11);
    
    if (evaluation.tips && Array.isArray(evaluation.tips)) {
      evaluation.tips.forEach((tip, i) => { doc.text(`${i + 1}. ${tip}`); });
    } else {
      doc.text("Continue expanding multi-context dialogue sessions to gain ultimate conversational fluency.");
    }
    doc.moveDown(2);

    doc.strokeColor('#E7EDF4').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.fillColor('#6B7A8A').fontSize(9).text(
      'NOTICE: This performance analysis report is dynamically compiled by Aura AI using LanguageTool validation vectors and the Phi-3 processing framework.',
      { align: 'justify' }
    );

    doc.end();

  } catch (error) {
    console.error("English Report Finalizer API Bottleneck:", error);
    res.status(500).json({ error: "Failed to finalize, log, and download performance file data." });
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aura English Tutor Server running smoothly on Port: ${PORT}`);
});