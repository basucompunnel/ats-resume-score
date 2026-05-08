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
  const technicalPattern = /\b[A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*\b|[a-z]+(?:\+\+|#|\.js|\.ts|\.py)/gi;
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

export interface ComparisonResult {
  resumeText: string;
  matchScore: number;
  matchedKeywords: string[];
  matchedPercentage: number;
  totalJDKeywords: number;
}

export interface AnalysisReport {
  jdKeywords: string[];
  resumeComparisons: ComparisonResult[];
  allMissingKeywords: string[];
  topMissingKeywords: string[];
  suggestedSkillGaps: { skill: string; category: string }[];
  recommendations: string[];
}

/**
 * Analyze resumes against a job description
 * @param jdText - Job description text
 * @param resumeTexts - Array of resume texts (1-3)
 * @returns Analysis report with scores and recommendations
 */
export function analyzeResumes(
  jdText: string,
  resumeTexts: string[]
): AnalysisReport {
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

  // Find missing keywords (in JD but not in any resume)
  const allResumeKeywords = new Set<string>();
  resumeTexts.forEach((text) => {
    extractAllKeywords(text).forEach((kw) => allResumeKeywords.add(kw));
  });

  const allMissingKeywords = jdKeywords.filter((kw) => !allResumeKeywords.has(kw));

  // Get top 10 most important missing keywords
  const topMissingKeywords = allMissingKeywords.slice(0, 10);

  // Generate skill gaps with categories
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

  return {
    jdKeywords,
    resumeComparisons,
    allMissingKeywords,
    topMissingKeywords,
    suggestedSkillGaps,
    recommendations,
  };
}
