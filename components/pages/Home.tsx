import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function Home() {
  const features = [
    {
      title: "Multi-Resume Comparison",
      description: "Upload up to 3 resumes and compare them against a single job description",
      icon: "📄",
    },
    {
      title: "ATS Score Analysis",
      description: "Get a detailed match percentage showing how well your resume aligns with the JD",
      icon: "📊",
    },
    {
      title: "Keyword Matching",
      description: "See exactly which keywords from the job description appear in your resume",
      icon: "🎯",
    },
    {
      title: "Skills Gap Analysis",
      description: "Identify missing skills and get actionable recommendations for improvement",
      icon: "💡",
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Badge className="mx-auto rounded-xs">ATS Resume Analyzer</Badge>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Optimize Your Resume for ATS Systems
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare your resume against job descriptions to ensure it passes Applicant Tracking Systems and gets seen by recruiters.
          </p>
          
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/comparison">
              <Button size="lg" className="rounded-xs">
                Start Analyzing
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xs">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="flex flex-col rounded-xs">
                <CardHeader>
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/20 bg-primary/5 rounded-xs">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Improve Your Resume?</CardTitle>
              <CardDescription className="text-base mt-2">
                Get detailed insights on how well your resume matches job descriptions and what you can improve.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/comparison">
                <Button size="lg" className="rounded-xs">
                  Go to Analyzer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
