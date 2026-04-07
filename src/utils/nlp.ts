// ─── NLP Analysis Engine ──────────────────────────────────────────────────────
// Pure client-side NLP scoring — no API needed.
// Analyzes answer quality, fluency, sentiment, filler words and more.

export interface NLPResult {
  overallScore:    number;   // 0-100
  clarityScore:    number;
  fluencyScore:    number;
  confidenceScore: number;
  relevanceScore:  number;
  depthScore:      number;
  sentiment:       "positive" | "neutral" | "negative";
  topFillerWords:  string[];
  avgWordCount:    number;
  skippedCount:    number;
}

// ── Filler word list ──────────────────────────────────────────────────────────
const FILLER_WORDS = [
  "um", "uh", "like", "you know", "basically", "actually",
  "literally", "sort of", "kind of", "i mean", "right",
  "so", "well", "okay", "honestly", "just", "very", "really",
];

// ── Weak confidence phrases ──────────────────────────────────────────────────
const WEAK_PHRASES = [
  "i think maybe", "i'm not sure", "i don't know", "i guess",
  "probably", "might be", "could be", "i believe maybe",
  "not really sure", "i'm not certain",
];

// ── Strong confidence phrases ────────────────────────────────────────────────
const STRONG_PHRASES = [
  "definitely", "certainly", "clearly", "in my experience",
  "the key point is", "for example", "specifically", "therefore",
  "this means", "as a result", "in conclusion",
];

// ── Technical keyword sets by role ──────────────────────────────────────────
const KEYWORDS: Record<string, string[]> = {
  frontend: ["react", "component", "state", "props", "dom", "css", "html", "javascript", "hook", "render"],
  backend:  ["api", "server", "database", "node", "express", "endpoint", "middleware", "authentication", "sql", "rest"],
  fullstack:["frontend", "backend", "database", "deployment", "api", "server", "client", "integration"],
  dsa:      ["algorithm", "complexity", "array", "tree", "graph", "sort", "search", "recursion", "hash", "stack"],
  hr:       ["team", "experience", "challenge", "learned", "goal", "achieve", "communicate", "leadership", "growth"],
  system:   ["scalable", "load balancer", "cache", "microservice", "database", "latency", "availability", "throughput"],
};

// ─── Main analyzer ────────────────────────────────────────────────────────────
export function analyzeAnswerNLP(
  answers:   string[],
  questions: string[],
  role = "frontend"
): NLPResult {
  const validAnswers = answers.filter(a => a && a !== "SKIPPED" && a.trim().length > 0);
  const skippedCount = answers.filter(a => !a || a === "SKIPPED").length;

  if (validAnswers.length === 0) {
    return {
      overallScore: 0, clarityScore: 0, fluencyScore: 0,
      confidenceScore: 0, relevanceScore: 0, depthScore: 0,
      sentiment: "neutral", topFillerWords: [], avgWordCount: 0, skippedCount,
    };
  }

  // ── Per-answer scoring ───────────────────────────────────────────────────
  const scores = validAnswers.map(ans => scoreAnswer(ans, role));

  // ── Aggregate ───────────────────────────────────────────────────────────
  const avg = (key: keyof typeof scores[0]) =>
    Math.round(scores.reduce((a, s) => a + (s[key] as number), 0) / scores.length);

  const clarityScore    = avg("clarity");
  const fluencyScore    = avg("fluency");
  const confidenceScore = avg("confidence");
  const relevanceScore  = avg("relevance");
  const depthScore      = avg("depth");

  const overallScore = Math.round(
    clarityScore    * 0.25 +
    fluencyScore    * 0.20 +
    confidenceScore * 0.20 +
    relevanceScore  * 0.20 +
    depthScore      * 0.15
  );

  // ── Filler word frequency ────────────────────────────────────────────────
  const fillerFreq: Record<string, number> = {};
  validAnswers.forEach(ans => {
    const lower = ans.toLowerCase();
    FILLER_WORDS.forEach(fw => {
      const re    = new RegExp(`\\b${fw}\\b`, "gi");
      const count = (lower.match(re) || []).length;
      if (count > 0) fillerFreq[fw] = (fillerFreq[fw] || 0) + count;
    });
  });
  const topFillerWords = Object.entries(fillerFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);

  // ── Sentiment (simple heuristic) ─────────────────────────────────────────
  const allText = validAnswers.join(" ").toLowerCase();
  const posWords = ["good", "great", "excellent", "success", "achieved", "improved", "learned", "passionate", "love", "enjoy", "strong", "confident"];
  const negWords = ["bad", "failed", "difficult", "struggle", "problem", "issue", "never", "hate", "poor", "worst"];
  const posCount = posWords.filter(w => allText.includes(w)).length;
  const negCount = negWords.filter(w => allText.includes(w)).length;
  const sentiment: "positive" | "neutral" | "negative" =
    posCount > negCount + 2 ? "positive" : negCount > posCount ? "negative" : "neutral";

  const avgWordCount = Math.round(
    validAnswers.reduce((a, ans) => a + ans.trim().split(/\s+/).length, 0) / validAnswers.length
  );

  return {
    overallScore, clarityScore, fluencyScore, confidenceScore,
    relevanceScore, depthScore, sentiment, topFillerWords,
    avgWordCount, skippedCount,
  };
}

// ─── Score a single answer ────────────────────────────────────────────────────
function scoreAnswer(text: string, role: string) {
  const lower = text.toLowerCase().trim();
  const words = lower.split(/\s+/).filter(Boolean);
  const wc    = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 2);

  // ── Clarity: sentence structure, length, not too long/short ─────────────
  const lengthScore = wc < 10 ? 20 : wc < 25 ? 50 : wc < 80 ? 90 : wc < 150 ? 75 : 55;
  const sentScore   = sentences.length >= 2 ? 85 : sentences.length === 1 ? 50 : 30;
  const clarity     = clamp(Math.round(lengthScore * 0.5 + sentScore * 0.5));

  // ── Fluency: penalize filler words ──────────────────────────────────────
  let fillerPenalty = 0;
  FILLER_WORDS.forEach(fw => {
    const re    = new RegExp(`\\b${fw}\\b`, "gi");
    const count = (lower.match(re) || []).length;
    fillerPenalty += count * 5;
  });
  const fluency = clamp(100 - fillerPenalty);

  // ── Confidence: strong vs weak phrases ──────────────────────────────────
  const strongHits = STRONG_PHRASES.filter(p => lower.includes(p)).length;
  const weakHits   = WEAK_PHRASES.filter(p => lower.includes(p)).length;
  const confidence = clamp(60 + strongHits * 12 - weakHits * 15);

  // ── Relevance: keyword matching ──────────────────────────────────────────
  const kws = KEYWORDS[role] || KEYWORDS.frontend;
  const kwHits = kws.filter(kw => lower.includes(kw)).length;
  const relevance = clamp(30 + Math.min(kwHits, 6) * 12);

  // ── Depth: length + examples + numbers ──────────────────────────────────
  const hasNumbers  = /\d+/.test(text) ? 15 : 0;
  const hasExample  = /(for example|for instance|such as|like when|in my|e\.g\.)/.test(lower) ? 20 : 0;
  const depthLength = wc > 60 ? 60 : Math.round((wc / 60) * 60);
  const depth       = clamp(depthLength + hasNumbers + hasExample);

  return { clarity, fluency, confidence, relevance, depth };
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}