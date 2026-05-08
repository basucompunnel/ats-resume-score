"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnalysisReport, ComparisonResult } from "@/lib/analyzer";

interface ComparisonReportProps {
  report: AnalysisReport;
}

export function ComparisonReport({ report }: ComparisonReportProps) {
  return (
    <div className="w-full space-y-6">
      {/* Summary Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {report.resumeComparisons.map((comparison, index) => (
          <Card key={index} className="rounded-xs">
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

      {/* Matched Keywords */}
      <Card className="rounded-xs">
        <CardHeader>
          <CardTitle>Matched Keywords</CardTitle>
          <CardDescription>
            Keywords from the job description found in your resumes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {report.resumeComparisons.length > 0 && report.resumeComparisons[0].matchedKeywords.length > 0 ? (
              report.resumeComparisons[0].matchedKeywords.map((keyword, idx) => (
                <Badge key={idx} variant="secondary" className="rounded-xs">
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No keywords matched</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Missing Keywords */}
      <Card className="rounded-xs">
        <CardHeader>
          <CardTitle>Top Missing Keywords</CardTitle>
          <CardDescription>
            Important keywords from the job description not found in your resumes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {report.topMissingKeywords.length > 0 ? (
              report.topMissingKeywords.map((keyword, idx) => (
                <Badge key={idx} variant="destructive" className="rounded-xs">
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No missing keywords</p>
            )}
          </div>
        </CardContent>
      </Card>

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
              report.suggestedSkillGaps.map((gap, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
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
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm leading-relaxed flex gap-2">
                <span className="flex-shrink-0">{rec.split(' ')[0]}</span>
                <span>{rec.split(' ').slice(1).join(' ')}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Detailed Resume Breakdown */}
      <Card className="rounded-xs">
        <CardHeader>
          <CardTitle>Detailed Analysis by Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {report.resumeComparisons.map((comparison, idx) => (
            <div key={idx} className="space-y-3 pb-6 border-b last:pb-0 last:border-0">
              <div>
                <h4 className="font-semibold mb-2">Resume {idx + 1}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Match Score: </span>
                    <span className="font-medium">{comparison.matchedPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Keywords Matched: </span>
                    <span className="font-medium">
                      {comparison.matchScore} / {comparison.totalJDKeywords}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Matched Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {comparison.matchedKeywords.length > 0 ? (
                    comparison.matchedKeywords.slice(0, 10).map((kw, i) => (
                      <Badge key={i} variant="secondary" className="text-xs rounded-xs">
                        {kw}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No matches</span>
                  )}
                  {comparison.matchedKeywords.length > 10 && (
                    <Badge variant="secondary" className="text-xs rounded-xs">
                      +{comparison.matchedKeywords.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
