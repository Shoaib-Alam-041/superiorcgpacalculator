import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Linkedin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SgpaCalculator } from "@/components/SgpaCalculator";
import { CgpaCalculator } from "@/components/CgpaCalculator";
import { GradeScaleTable } from "@/components/GradeScaleTable";
import { SeoContent } from "@/components/SeoContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Superior University CGPA & SGPA Calculator" },
      {
        name: "description",
        content:
          "Free, fast CGPA and SGPA calculator for Superior University students. Calculate grade point average and download a PDF report.",
      },
      { property: "og:title", content: "Superior University CGPA & SGPA Calculator" },
      {
        property: "og:description",
        content: "Calculate your SGPA and CGPA instantly and download a PDF report.",
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
