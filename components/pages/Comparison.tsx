"use client";

import { useState, useEffect } from "react";
import { ComparisonForm } from "@/components/comparison/ComparisonForm";
import { ComparisonReport } from "@/components/comparison/ComparisonReport";
import { useComparisonStorage } from "@/hooks/useComparisonStorage";
import { analyzeResumes, AnalysisReport } from "@/lib/analyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Comparison() {
  const { data, isLoaded, updateResume, updateJobDescription, clearAll } = useComparisonStorage();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCompare = () => {
    setIsAnalyzing(true);
    // Simulate small delay for UX feedback
    setTimeout(() => {
      const analysisReport = analyzeResumes(data.jobDescription, [
        data.resume1,
        data.resume2,
        data.resume3,
      ]);
      setReport(analysisReport);
      setIsAnalyzing(false);
    }, 300);
  };

  const handleClear = () => {
    clearAll();
    setReport(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="rounded-xs">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Resume ATS Analyzer</h1>
          <p className="text-muted-foreground mt-2">
            Compare your resumes against a job description to optimize for ATS systems
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ComparisonForm
                resume1={data.resume1}
                resume2={data.resume2}
                resume3={data.resume3}
                jobDescription={data.jobDescription}
                onResume1Change={(text) => updateResume(1, text)}
                onResume2Change={(text) => updateResume(2, text)}
                onResume3Change={(text) => updateResume(3, text)}
                onJobDescriptionChange={updateJobDescription}
                onCompare={handleCompare}
                onClear={handleClear}
                isLoading={isAnalyzing}
              />
            </div>
          </div>

          {/* Right Column: Report */}
          <div className="lg:col-span-2">
            {report ? (
              <ComparisonReport report={report} />
            ) : (
              <Card className="border-dashed rounded-xs">
                <CardHeader className="text-center py-12">
                  <CardTitle>Ready to analyze</CardTitle>
                  <CardDescription className="mt-2">
                    Fill in your resume(s) and job description, then click "Compare" to see your ATS match score and recommendations.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
