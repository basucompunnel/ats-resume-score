// Text normalization and extraction utilities
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function extractWords(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

// Extract potential keywords (words longer than 3 chars, excluding common words)
function extractKeywords(text: string): Set<string> {
  const commonWords = new Set([
    'the', 'and', 'for', 'with', 'from', 'that', 'this', 'will', 'your', 'have',
    'has', 'can', 'are', 'is', 'was', 'were', 'been', 'be', 'to', 'of', 'in',
    'on', 'at', 'by', 'as', 'or', 'an', 'a', 'we', 'you', 'they', 'it', 'our',
    'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'about',
    'also', 'would', 'should', 'could', 'may', 'might', 'must', 'some', 'any',
  ]);

  const words = extractWords(text);
  return new Set(
    words.filter(
      (word) => word.length > 3 && !commonWords.has(word) && !/^\d+$/.test(word)
    )
  );
}

// Extract skills/technical terms (capitalized words, hyphenated terms, etc.)
function extractTechnicalTerms(text: string): Set<string> {
  const technicalPattern = /\b[A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*\b|[a-z]+[+#]|\.[jt]s|py/gi;
  const matches = text.match(technicalPattern) || [];
  return new Set(matches.map((term) => normalizeText(term)).filter((term) => term.length > 0));
}

// Combine keyword extraction methods
function extractAllKeywords(text: string): Set<string> {
  const keywords = new Set<string>();
  extractKeywords(text).forEach((kw) => keywords.add(kw));
  extractTechnicalTerms(text).forEach((term) => keywords.add(term));
  return keywords;
}

// ============================================================================
// Keyword Categorization
// ============================================================================

type KeywordCategory = 'technical' | 'ability' | 'generic' | 'title';

interface KeywordInfo {
  category: KeywordCategory;
  weight: number;
}

const TECHNICAL_KEYWORDS: Record<string, number> = {
  // Programming languages
  javascript: 1.0, typescript: 1.0, python: 1.0, java: 1.0, golang: 1.0,
  rust: 1.0, php: 1.0, 'c#': 1.0, ruby: 1.0, 'c++': 1.0,
  // Frameworks
  react: 1.0, vue: 1.0, angular: 1.0, 'next.js': 1.0, express: 1.0,
  django: 1.0, fastapi: 1.0, spring: 1.0, node: 1.0, svelte: 1.0,
  // Databases
  sql: 1.0, mongodb: 1.0, postgresql: 1.0, redis: 1.0, elasticsearch: 1.0,
  dynamodb: 1.0, mysql: 1.0, firestore: 1.0,
  // Cloud & DevOps
  aws: 1.0, azure: 1.0, gcp: 1.0, kubernetes: 1.0, docker: 1.0,
  terraform: 1.0, jenkins: 1.0, ci: 1.0, cd: 1.0,
  // APIs & Architectures
  rest: 1.0, graphql: 1.0, websockets: 1.0, microservices: 1.0,
  // Other Technical
  git: 1.0, html: 1.0, css: 1.0, apis: 1.0, architecture: 1.0,
  architectures: 1.0, testing: 1.0, unit: 1.0, integration: 1.0,
};

const ABILITY_KEYWORDS: Record<string, number> = {
  leadership: 0.67, communication: 0.67, collaboration: 0.67, teamwork: 0.67,
  'problem-solving': 0.67, analytical: 0.67, strategic: 0.67, driven: 0.67,
  vision: 0.67, flexible: 0.67, responsive: 0.67, reliability: 0.67,
  committed: 0.67, 'fast-paced': 0.67, influencing: 0.67, 'ability to lead': 0.67,
};

const GENERIC_KEYWORDS: Record<string, number> = {
  data: 0.33, systems: 0.33, teams: 0.33, frontend: 0.33, backend: 0.33,
  performance: 0.33, development: 0.33, design: 0.33, platform: 0.33,
  experience: 0.33, applications: 0.33, support: 0.33, tools: 0.33,
  building: 0.33, working: 0.33, years: 0.33, professional: 0.33,
  modern: 0.33, scalable: 0.33, best: 0.33, complex: 0.33,
};

function categorizeKeyword(keyword: string): KeywordInfo {
  const normalized = normalizeText(keyword);
  
  if (TECHNICAL_KEYWORDS[normalized] !== undefined) {
    return { category: 'technical', weight: TECHNICAL_KEYWORDS[normalized] };
  }
  
  if (ABILITY_KEYWORDS[normalized] !== undefined) {
    return { category: 'ability', weight: ABILITY_KEYWORDS[normalized] };
  }
  
  if (GENERIC_KEYWORDS[normalized] !== undefined) {
    return { category: 'generic', weight: GENERIC_KEYWORDS[normalized] };
  }
  
  // Default to generic with low weight
  return { category: 'generic', weight: 0.33 };
}

function countKeywordFrequency(text: string, keyword: string): number {
  const words = extractWords(text);
  const normalizedKeyword = normalizeText(keyword);
  return words.filter((w) => normalizeText(w) === normalizedKeyword).length;
}

// Extract job title from text (look for common job title patterns)
function extractJobTitle(text: string): string {
  const titlePatterns = [
    /(?:title|position|role|job title)[:\s]+([^\n]+)/i,
    /^([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Architect|Manager|Lead|Director|Specialist))/m,
  ];
  
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return '';
}

// Extract measurable results (numbers, percentages, improvements)
function extractMeasurableResults(text: string): string[] {
  const results: string[] = [];
  const patterns = [
    /(\d+[,\d]*\+?(?:\s*(?:users|records|customers|transactions|requests|responses))?)/gi,
    /(\d+%\s*(?:improvement|increase|decrease|growth|reduction))/gi,
    /(?:from|by)\s*(\d+\.?\d*)\s*(?:to|through)\s*(\d+\.?\d*)/gi,
  ];
  
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      results.push(...matches);
    }
  }
  
  return Array.from(new Set(results)).slice(0, 10);
}

// Extract contact details
function extractContactDetails(text: string): { email?: string; phone?: string } {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/\+?[\d\s\-()]{10,}/);
  
  return {
    email: emailMatch?.[0],
    phone: phoneMatch?.[0],
  };
}

// ============================================================================
// Interfaces
// ============================================================================

export interface KeywordMatch {
  readonly keyword: string;
  readonly foundInResume: number;
  readonly foundInJD: number;
  readonly category: KeywordCategory;
  readonly weight: number;
  readonly matched: boolean;
}

export interface CategoryScore {
  readonly category: string;
  readonly percentage: number;
  readonly matched: number;
  readonly total: number;
  readonly weight: number;
}

export interface DetailedAnalysis {
  readonly jobTitle: { found: boolean; title: string };
  readonly wordCount: number;
  readonly wordCountStatus: 'low' | 'good' | 'high';
  readonly contactDetails: { email?: string; phone?: string };
  readonly measurableResults: string[];
}

export interface ComparisonResult {
  readonly resumeText: string;
  readonly matchScore: number;
  readonly matchedKeywords: string[];
  readonly matchedPercentage: number;
  readonly totalJDKeywords: number;
}

export interface AnalysisReport {
  readonly jdKeywords: string[];
  readonly resumeComparisons: ComparisonResult[];
  readonly allMissingKeywords: string[];
  readonly topMissingKeywords: string[];
  readonly suggestedSkillGaps: { skill: string; category: string }[];
  readonly recommendations: string[];
}

export interface EnhancedAnalysisReport extends AnalysisReport {
  readonly categoryScores: CategoryScore[];
  readonly keywordMatches: KeywordMatch[];
  readonly overallScore: number;
  readonly detailedAnalysis: DetailedAnalysis[];
}

/**
 * Analyze resumes against a job description with enhanced metrics
 * @param jdText - Job description text
 * @param resumeTexts - Array of resume texts (1-3)
 * @returns Enhanced analysis report with detailed breakdown
 */
export function analyzeResumes(
  jdText: string,
  resumeTexts: string[]
): EnhancedAnalysisReport {
  // Extract keywords from JD
  const jdKeywords = Array.from(extractAllKeywords(jdText)).sort();

  // Compare each resume
  const resumeComparisons: ComparisonResult[] = resumeTexts
    .filter((text) => text.trim().length > 0)
    .map((resumeText) => {
      const resumeKeywords = extractAllKeywords(resumeText);
      const matchedKeywords = jdKeywords.filter((keyword) =>
        resumeKeywords.has(keyword)
      );
      const matchScore = matchedKeywords.length;
      const matchedPercentage =
        jdKeywords.length > 0
          ? Math.round((matchScore / jdKeywords.length) * 100)
          : 0;

      return {
        resumeText,
        matchScore,
        matchedKeywords,
        matchedPercentage,
        totalJDKeywords: jdKeywords.length,
      };
    });

  // Build keyword matches with frequencies and categories
  const keywordMatches: KeywordMatch[] = jdKeywords.map((keyword) => {
    const { category, weight } = categorizeKeyword(keyword);
    const allResumeKeywords = new Set<string>();
    resumeTexts.forEach((text) => {
      extractAllKeywords(text).forEach((kw) => allResumeKeywords.add(kw));
    });
    
    return {
      keyword,
      foundInResume: resumeComparisons[0]?.matchedKeywords.includes(keyword) 
        ? countKeywordFrequency(resumeComparisons[0]?.resumeText || '', keyword)
        : 0,
      foundInJD: countKeywordFrequency(jdText, keyword),
      category,
      weight,
      matched: allResumeKeywords.has(keyword),
    };
  });

  // Calculate category scores
  const categoryScores = calculateCategoryScores(keywordMatches);

  // Calculate weighted overall score
  const overallScore = calculateOverallScore(keywordMatches);

  // Find missing keywords
  const allResumeKeywords = new Set<string>();
  resumeTexts.forEach((text) => {
    extractAllKeywords(text).forEach((kw) => allResumeKeywords.add(kw));
  });
  const allMissingKeywords = jdKeywords.filter((kw) => !allResumeKeywords.has(kw));
  const topMissingKeywords = allMissingKeywords.slice(0, 10);

  // Generate skill gaps
  const skillCategories: Record<string, string[]> = {
    programming: ['javascript', 'typescript', 'python', 'java', 'c#', 'golang', 'rust', 'php', 'ruby'],
    databases: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb'],
    frameworks: ['react', 'vue', 'angular', 'node', 'express', 'django', 'fastapi', 'spring'],
    cloud: ['aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform'],
    tools: ['git', 'docker', 'jenkins', 'gitlab', 'github', 'jira', 'figma'],
    soft_skills: ['leadership', 'communication', 'teamwork', 'problem-solving', 'analytical'],
  };

  const suggestedSkillGaps = topMissingKeywords
    .slice(0, 8)
    .map((skill) => {
      let category = 'general';
      for (const [cat, skills] of Object.entries(skillCategories)) {
        if (skills.includes(skill.toLowerCase())) {
          category = cat;
          break;
        }
      }
      return { skill, category };
    });

  // Generate recommendations
  const recommendations: string[] = [];
  const avgMatchPercentage =
    resumeComparisons.length > 0
      ? Math.round(
          resumeComparisons.reduce((sum, r) => sum + r.matchedPercentage, 0) /
            resumeComparisons.length
        )
      : 0;

  if (avgMatchPercentage < 50) {
    recommendations.push('📌 Your resume has low keyword match. Review the job description carefully and highlight relevant experience.');
  } else if (avgMatchPercentage < 75) {
    recommendations.push('✓ Good keyword coverage, but consider adding more specific technical terms from the JD.');
  } else {
    recommendations.push('✅ Excellent keyword match! Your resume is well-aligned with the job requirements.');
  }

  if (topMissingKeywords.length > 0) {
    const topSkills = topMissingKeywords.slice(0, 5).join(', ');
    recommendations.push(
      `🎯 Consider adding or emphasizing these missing skills: ${topSkills}.`
    );
  }

  if (resumeComparisons.length > 1) {
    const bestResume = resumeComparisons.reduce((best, current) =>
      current.matchedPercentage > best.matchedPercentage ? current : best
    );
    const bestIndex = resumeComparisons.indexOf(bestResume);
    recommendations.push(
      `💡 Resume ${bestIndex + 1} has the highest match score (${bestResume.matchedPercentage}%). Use it as a reference for improvements.`
    );
  }

  recommendations.push('📝 Use ATS-friendly formatting: clear sections, standard fonts, and relevant keywords naturally placed.');

  // Extract detailed analysis for each resume
  const detailedAnalysis = resumeTexts
    .filter((text) => text.trim().length > 0)
    .map((resumeText) => {
      const wordCount = extractWords(resumeText).length;
      const wordCountStatus: 'low' | 'good' | 'high' = wordCount < 500 ? 'low' : wordCount > 1500 ? 'high' : 'good';
      const jobTitle = extractJobTitle(resumeText);
      
      return {
        jobTitle: { found: !!jobTitle, title: jobTitle },
        wordCount,
        wordCountStatus,
        contactDetails: extractContactDetails(resumeText),
        measurableResults: extractMeasurableResults(resumeText),
      };
    });

  return {
    jdKeywords,
    resumeComparisons,
    allMissingKeywords,
    topMissingKeywords,
    suggestedSkillGaps,
    recommendations,
    categoryScores,
    keywordMatches,
    overallScore,
    detailedAnalysis,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateCategoryScores(keywordMatches: KeywordMatch[]): CategoryScore[] {
  const categories = ['technical', 'ability', 'generic'] as const;
  const scores: CategoryScore[] = [];

  for (const cat of categories) {
    const categoryMatches = keywordMatches.filter((km) => km.category === cat);
    const matched = categoryMatches.filter((km) => km.matched).length;
    const total = categoryMatches.length;
    const percentage = total > 0 ? Math.round((matched / total) * 100) : 0;
    const weight = categoryMatches[0]?.weight || 0.33;

    scores.push({
      category: cat === 'technical' ? 'Technical Skills' : cat === 'ability' ? 'Abilities' : 'Generic Keywords',
      percentage,
      matched,
      total,
      weight,
    });
  }

  return scores;
}

function calculateOverallScore(keywordMatches: KeywordMatch[]): number {
  if (keywordMatches.length === 0) return 0;

  const totalWeightedScore = keywordMatches.reduce((sum, km) => {
    return sum + (km.matched ? km.weight : 0);
  }, 0);

  const totalPossibleScore = keywordMatches.reduce((sum, km) => {
    return sum + km.weight;
  }, 0);

  return totalPossibleScore > 0 ? Math.round((totalWeightedScore / totalPossibleScore) * 100) : 0;
}
