# 📊 ATS Resume Score

**Stop letting ATS filters block qualified candidates.** Get your resume in front of the right people by analyzing exactly which keywords your resume needs to match any job description.

---

## The Problem

Every day, thousands of qualified job seekers are silently rejected—not because they're unqualified, but because their resume doesn't contain the specific keywords an ATS is looking for. You can't get the job if your resume doesn't reach a human recruiter's desk.

## The Solution

**ATS Resume Score** analyzes how well your resume matches any job description. Compare up to 3 different versions of your resume side-by-side, see your match percentage, and get a detailed breakdown of exactly which keywords you're missing. Then iterate, reoptimize, and try again.

---

## ✨ Key Features

- **Multi-Resume Comparison** — Upload up to 3 resumes simultaneously to compare which version scores best against a job description
- **Match Scoring** — Get a precise percentage score showing how well your resume aligns with the target role
- **Keyword Gap Analysis** — Instantly see which technical skills, abilities, and industry terms your resume is missing
- **Weighted Relevance** — Our algorithm prioritizes technical skills over generic terms, so your score reflects what recruiters actually care about
- **Real-Time Results** — Paste a job description and get instant feedback—no waiting, no signup required

---

## 🚀 How to Use

1. **Paste the job description** — Copy the full job description from the job posting and paste it into the text area
2. **Upload your resume(s)** — Add 1–3 resumes (PDF, .docx, or plain text) to see which one performs best
3. **View your score** — Get an instant match percentage showing how aligned your resume is with the role
4. **Review the gaps** — See a detailed breakdown of missing keywords organized by category (Technical, Abilities, Generic)
5. **Optimize and rerun** — Update your resume with missing keywords and retest until you hit your target match score

---

## 🔬 How the Algorithm Works

This tool uses a **weighted keyword matching system** to score your resume against a job description:

- **Technical Skills** (1.0x weight) — Weighted highest because these are deal-breakers. Missing tools, languages, or frameworks will tank your score.
- **Abilities** (0.67x weight) — Important but slightly more flexible. Keywords like "project management," "collaboration," or "problem-solving" are easier to reframe.
- **Generic Terms** (0.33x weight) — Lowest weight because these are often assumed or easily explained in interviews.

Your overall match score is calculated as:
$$\text{Score} = \frac{\sum (\text{matches} \times \text{weight})}{\sum (\text{keywords} \times \text{weight})} \times 100$$

**Example**: If a job description has 10 technical terms (1.0x), 8 abilities (0.67x), and 15 generic terms (0.33x), and your resume matches 8 technical terms, 6 abilities, and 12 generic terms, your score would reflect that technical alignment is strongest, but you're weaker on abilities.

---

## 💻 Getting Started (Development)

Want to run this locally or contribute?

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start using the tool.

**Tech Stack**: Next.js, React, TypeScript, TailwindCSS

---

## 📝 License

Open source. Contributions welcome.

---

**Questions?** Open an issue or reach out. Let's help more qualified candidates get their resumes in front of recruiters.
