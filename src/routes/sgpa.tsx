import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { SgpaCalculator } from "@/components/SgpaCalculator";
import { GradeScaleTable } from "@/components/GradeScaleTable";

export const Route = createFileRoute("/sgpa")({
  head: () => ({
    meta: [
      {
        title:
          "Superior University SGPA Calculator – Free Semester GPA Tool",
      },
      {
        name: "description",
        content:
          "Calculate your Superior University SGPA (semester GPA) free. Enter marks or grades, upload your result card, and download a PDF report instantly.",
      },
      {
        property: "og:title",
        content: "Superior University SGPA Calculator – Free Semester GPA Tool",
      },
      {
        property: "og:description",
        content:
          "Free Superior University SGPA calculator — enter marks or upload your result card, compute semester GPA instantly, and download a PDF report.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SgpaPage,
});

function SgpaPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Superior University SGPA Calculator
            </h1>
            <p className="text-xs text-muted-foreground">
              Free semester GPA tool with result card upload
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Calculate your semester GPA
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Enter marks or grades for each course using Superior University's
            official grading scale, then download a clean PDF report.
          </p>
          <p className="mt-3 text-sm">
            <Link to="/" className="text-primary hover:underline">
              ← Back to home
            </Link>{" "}
            ·{" "}
            <Link to="/cgpa" className="text-primary hover:underline">
              CGPA Calculator
            </Link>
          </p>
        </section>

        <SgpaCalculator />

        <GradeScaleTable />

        <footer className="mt-10 border-t border-border pb-6 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Unofficial tool. Verify results with your transcript.
          </p>
        </footer>
      </main>
    </div>
  );
}
