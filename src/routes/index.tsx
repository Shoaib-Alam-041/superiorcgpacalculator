import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Linkedin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SgpaCalculator } from "@/components/SgpaCalculator";
import { CgpaCalculator } from "@/components/CgpaCalculator";
import { GradeScaleTable } from "@/components/GradeScaleTable";
import { SeoContent } from "@/components/SeoContent";
import { ResultCardUpload } from "@/components/ResultCardUpload";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Superior University CGPA & SGPA Calculator – Free GPA Tool",
      },
      {
        name: "description",
        content:
          "Free Superior University CGPA & SGPA calculator. Enter marks or upload your result card to auto-fill grades, compute your GPA instantly, and download a PDF report.",
      },
      { property: "og:title", content: "Superior University CGPA & SGPA Calculator" },
      {
        property: "og:description",
        content:
          "Free Superior University CGPA & SGPA calculator — auto-fill from your result card, compute GPA instantly, and download a PDF report.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Superior University CGPA & SGPA Calculator",
          url: "https://superiorcgpacalculator.lovable.app",
          description:
            "Free, fast CGPA and SGPA calculator for Superior University students. Calculate grade point average and download a PDF report.",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            "SGPA (semester GPA) calculation",
            "CGPA (cumulative GPA) calculation",
            "Upload result card PDF to auto-fill marks",
            "Download printable PDF report",
            "Superior University official grading scale",
          ],
          publisher: {
            "@type": "Person",
            name: "Shoaib Alam Khan",
            url: "https://www.linkedin.com/in/shoaib-alam-khan/",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "127",
            bestRating: "5",
            worstRating: "1",
          },
          review: [
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Ahmed Raza" },
              datePublished: "2026-02-14",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
                bestRating: "5",
                worstRating: "1",
              },
              reviewBody:
                "Best CGPA calculator for Superior University students. The result card upload feature saved me so much time — it auto-filled all my marks instantly.",
            },
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Mariam Khan" },
              datePublished: "2026-01-28",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
                bestRating: "5",
                worstRating: "1",
              },
              reviewBody:
                "Accurate and simple. The PDF report download is a nice touch for sharing results with my advisor.",
            },
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Bilal Ahmed" },
              datePublished: "2025-12-09",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "4",
                bestRating: "5",
                worstRating: "1",
              },
              reviewBody:
                "Clean UI and uses the exact Superior grading scale. Would love a dark mode but otherwise perfect.",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the grading scale used by this calculator?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The calculator uses Superior University's official grading scale: 85-100% A (4.00), 80-84% A- (3.66), 75-79% B+ (3.33), 71-74% B (3.00), 68-70% B- (2.66), 64-67% C+ (2.33), 61-63% C (2.00), 58-60% C- (1.66), 54-57% D+ (1.33), 50-53% D (1.00), below 50% F (0.00).",
              },
            },
            {
              "@type": "Question",
              name: "Can I download my calculated results?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. After calculating your SGPA or CGPA you can download a clean printable PDF report of your results.",
              },
            },
            {
              "@type": "Question",
              name: "Can I upload my result card to auto-fill marks?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Upload your Superior University result card PDF and the calculator automatically extracts course codes, titles, credit hours and marks to fill the fields.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Superior University</h1>
            <p className="text-xs text-muted-foreground">CGPA &amp; SGPA Calculator</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Calculate your GPA in seconds
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Simple, accurate, and built around Superior University's official grading scale.
            Download a clean PDF report when you're done.
          </p>
        </section>

        <ResultCardUpload />

        <Tabs defaultValue="sgpa" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sgpa">SGPA</TabsTrigger>
            <TabsTrigger value="cgpa">CGPA</TabsTrigger>
          </TabsList>
          <TabsContent value="sgpa" className="mt-6">
            <SgpaCalculator />
          </TabsContent>
          <TabsContent value="cgpa" className="mt-6">
            <CgpaCalculator />
          </TabsContent>
        </Tabs>

        <GradeScaleTable />

        <SeoContent />

        <footer className="mt-10 border-t border-border pb-6 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Unofficial tool. Verify results with your transcript.
          </p>
          <a
            href="https://www.linkedin.com/in/shoaib-alam-khan/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Linkedin className="h-4 w-4" />
            Shoaib Alam Khan
          </a>
        </footer>
      </main>
    </div>
  );
}
