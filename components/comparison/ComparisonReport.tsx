"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EnhancedAnalysisReport } from "@/lib/analyzer";

interface ComparisonReportProps {
  readonly report: EnhancedAnalysisReport;
}

export function ComparisonReport({ report }: Readonly<ComparisonReportProps>) {
  return (
    <div className="w-full space-y-6">
      {/* Overall Weighted Score */}
      <Card className="rounded-xs bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Overall Match Score</CardTitle>
          <CardDescription>
            Weighted analysis across all keyword categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-5xl font-bold text-primary">{report.overallScore}%</span>
            </div>
            <Progress value={report.overallScore} className="flex-1 h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Category Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.categoryScores.map((score) => (
          <Card key={score.category} className="rounded-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{score.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Match Rate</span>
                  <span className="text-2xl font-bold text-primary">
                    {score.percentage}%
                  </span>
                </div>
                <Progress value={score.percentage} className="h-2" />
              </div>
              <div className="text-xs text-muted-foreground">
                {score.matched} of {score.total} keywords matched
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resume Comparison Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {report.resumeComparisons.map((comparison, index) => (
          <Card key={`resume-${index}`} className="rounded-xs">
            <CardHeader>
              <CardTitle className="text-lg">Resume {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className="text-2xl font-bold text-primary">
                    {comparison.matchedPercentage}%
                  </span>
                </div>
                <Progress value={comparison.matchedPercentage} className="h-2" />
              </div>
              <div className="text-sm text-muted-foreground">
                {comparison.matchScore} of {comparison.totalJDKeywords} keywords matched
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Keyword Analysis by Category */}
      <Card className="rounded-xs">
        <CardHeader>
          <CardTitle>Keyword Breakdown by Category</CardTitle>
          <CardDescription>
            Detailed view of matched and missing keywords organized by importance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(['technical', 'ability', 'generic'] as const).map((category) => {
              const categoryKeywords = report.keywordMatches.filter(
                (km) => km.category === category
              );
              const categoryLabel =
                category === 'technical'
                  ? 'Technical Skills'
                  : category === 'ability'
                    ? 'Abilities'
                    : 'Generic Keywords';

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{categoryLabel}</h4>
                    <Badge variant="outline" className="text-xs rounded-xs">
                      {categoryKeywords.filter((k) => k.matched).length} /{' '}
                      {categoryKeywords.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {categoryKeywords.map((km) => (
                      <div
                        key={`${category}-${km.keyword}`}
                        className={`p-2 rounded-md text-xs transition-colors ${
                          km.matched
                            ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                        }`}
                      >
                        <div className="flex items-start gap-1">
                          <span className="text-lg">
                            {km.matched ? '✅' : '❌'}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium truncate">{km.keyword}</p>
                            {km.foundInResume > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {km.foundInResume}x in resume
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Metadata Analysis */}
      {report.detailedAnalysis.length > 0 && (
        <Card className="rounded-xs">
          <CardHeader>
            <CardTitle>Resume Metadata Analysis</CardTitle>
            <CardDescription>
              Insights from resume structure and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {report.detailedAnalysis.map((analysis, idx) => (
                <div key={`analysis-${idx}`} className="space-y-4 pb-6 border-b last:pb-0 last:border-0">
                  <h4 className="font-semibold">Resume {idx + 1}</h4>

                  {/* Word Count */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Word Count</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          {analysis.wordCount}
                        </span>
                        <Badge
                          variant={
                            analysis.wordCountStatus === 'low'
                              ? 'destructive'
                              : analysis.wordCountStatus === 'good'
                                ? 'default'
                                : 'secondary'
                          }
                          className="text-xs rounded-xs capitalize"
                        >
                          {analysis.wordCountStatus}
                        </Badge>
                      </div>
                    </div>

                    {/* Job Title */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Job Title</p>
                      {analysis.jobTitle.found ? (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <span className="text-sm font-medium truncate">
                            {analysis.jobTitle.title}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 dark:text-red-400">✗</span>
                          <span className="text-sm text-muted-foreground">Not found</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  {(analysis.contactDetails.email ||
                    analysis.contactDetails.phone) && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Contact Details</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.contactDetails.email && (
                          <Badge key="email" variant="outline" className="text-xs rounded-xs">
                            📧 Email: {analysis.contactDetails.email}
                          </Badge>
                        )}
                        {analysis.contactDetails.phone && (
                          <Badge key="phone" variant="outline" className="text-xs rounded-xs">
                            📱 Phone
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Measurable Results */}
                  {analysis.measurableResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Measurable Results Found
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.measurableResults.slice(0, 5).map((result) => (
                          <Badge
                            key={result}
                            variant="secondary"
                            className="text-xs rounded-xs"
                          >
                            📊 {result}
                          </Badge>
                        ))}
                        {analysis.measurableResults.length > 5 && (
                          <Badge variant="outline" className="text-xs rounded-xs" key="more">
                            +{analysis.measurableResults.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills Gap Analysis */}
      <Card className="rounded-xs">
        <CardHeader>
          <CardTitle>Skills Gap Analysis</CardTitle>
          <CardDescription>
            Skills categories where you have gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.suggestedSkillGaps.length > 0 ? (
              report.suggestedSkillGaps.map((gap) => (
                <div
                  key={gap.skill}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                >
                  <span className="font-medium text-sm">{gap.skill}</span>
                  <Badge variant="outline" className="text-xs capitalize rounded-xs">
                    {gap.category.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skill gaps identified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="rounded-xs">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>
            Personalized suggestions to improve your resume match
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {report.recommendations.map((rec) => (
              <li key={rec} className="text-sm leading-relaxed flex gap-2">
                <span className="shrink-0">{rec.split(' ')[0]}</span>
                <span>{rec.split(' ').slice(1).join(' ')}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
