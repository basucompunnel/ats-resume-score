"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// ============================================================================
// ResumesSection Subcomponent
// ============================================================================

interface ResumesSectionProps {
  readonly resume1: string;
  readonly resume2: string;
  readonly resume3: string;
  readonly onResume1Change: (text: string) => void;
  readonly onResume2Change: (text: string) => void;
  readonly onResume3Change: (text: string) => void;
}

function ResumesSection({
  resume1,
  resume2,
  resume3,
  onResume1Change,
  onResume2Change,
  onResume3Change,
}: ResumesSectionProps) {
  return (
    <Card className="rounded-xs">
      <CardHeader>
        <CardTitle>Resumes</CardTitle>
        <CardDescription>
          Paste the text of 1-3 resumes you want to analyze. At least one resume is required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resume 1 */}
        <div className="space-y-2">
          <label htmlFor="resume1" className="text-sm font-medium">
            Resume 1
          </label>
          <Textarea
            id="resume1"
            placeholder="Paste your first resume here..."
            value={resume1}
            onChange={(e) => onResume1Change(e.target.value)}
            className="min-h-[150px] resize-none rounded-xs mt-1"
          />
        </div>

        {/* Resume 2 */}
        <div className="space-y-2">
          <label htmlFor="resume2" className="text-sm font-medium">
            Resume 2 (Optional)
          </label>
          <Textarea
            id="resume2"
            placeholder="Paste your second resume here..."
            value={resume2}
            onChange={(e) => onResume2Change(e.target.value)}
            className="min-h-[150px] resize-none rounded-xs mt-1"
          />
        </div>

        {/* Resume 3 */}
        <div className="space-y-2">
          <label htmlFor="resume3" className="text-sm font-medium">
            Resume 3 (Optional)
          </label>
          <Textarea
            id="resume3"
            placeholder="Paste your third resume here..."
            value={resume3}
            onChange={(e) => onResume3Change(e.target.value)}
            className="min-h-[150px] resize-none rounded-xs mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// JobDescriptionSection Subcomponent
// ============================================================================

interface JobDescriptionSectionProps {
  readonly jobDescription: string;
  readonly onJobDescriptionChange: (text: string) => void;
}

function JobDescriptionSection({
  jobDescription,
  onJobDescriptionChange,
}: JobDescriptionSectionProps) {
  return (
    <Card className="rounded-xs">
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
        <CardDescription>
          Paste the job description you want to match your resumes against.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label htmlFor="jd" className="text-sm font-medium">
            Job Description
          </label>
          <Textarea
            id="jd"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            className="min-h-[200px] resize-none rounded-xs mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ActionButtons Subcomponent
// ============================================================================

interface ActionButtonsProps {
  readonly onCompare: () => void;
  readonly onClear: () => void;
  readonly isLoading?: boolean;
  readonly canCompare: boolean;
}

function ActionButtons({
  onCompare,
  onClear,
  isLoading = false,
  canCompare,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-3 justify-end">
      <Button
        variant="outline"
        onClick={onClear}
        disabled={isLoading}
        className="rounded-xs"
      >
        Clear
      </Button>
      <Button
        onClick={onCompare}
        disabled={!canCompare || isLoading}
        className="rounded-xs"
      >
        {isLoading ? "Analyzing..." : "Compare"}
      </Button>
    </div>
  );
}

// ============================================================================
// ComparisonForm Main Component
// ============================================================================

interface ComparisonFormProps {
  readonly resume1: string;
  readonly resume2: string;
  readonly resume3: string;
  readonly jobDescription: string;
  readonly onResume1Change: (text: string) => void;
  readonly onResume2Change: (text: string) => void;
  readonly onResume3Change: (text: string) => void;
  readonly onJobDescriptionChange: (text: string) => void;
  readonly onCompare: () => void;
  readonly onClear: () => void;
  readonly isLoading?: boolean;
}

export function ComparisonForm({
  resume1,
  resume2,
  resume3,
  jobDescription,
  onResume1Change,
  onResume2Change,
  onResume3Change,
  onJobDescriptionChange,
  onCompare,
  onClear,
  isLoading = false,
}: ComparisonFormProps) {
  const canCompare = !!((
    resume1.trim() || 
    resume2.trim() || 
    resume3.trim()
  ) && jobDescription.trim());

  return (
    <div className="w-full space-y-6">
      <ResumesSection
        resume1={resume1}
        resume2={resume2}
        resume3={resume3}
        onResume1Change={onResume1Change}
        onResume2Change={onResume2Change}
        onResume3Change={onResume3Change}
      />
      
      <JobDescriptionSection
        jobDescription={jobDescription}
        onJobDescriptionChange={onJobDescriptionChange}
      />
      
      <ActionButtons
        onCompare={onCompare}
        onClear={onClear}
        isLoading={isLoading}
        canCompare={canCompare}
      />
    </div>
  );
}
