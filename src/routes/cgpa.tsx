import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { CgpaCalculator } from "@/components/CgpaCalculator";
import { GradeScaleTable } from "@/components/GradeScaleTable";

export const Route = createFileRoute("/cgpa")({
  head: () => ({
    meta: [
      {
        title:
          "Superior University CGPA Calculator – Free Cumulative GPA Tool",
      },
      {
        name: "description",
        content:
          "Calculate your Superior University CGPA (cumulative GPA) free. Combine semester SGPAs and credits, then download a PDF report instantly.",
      },
      {
        property: "og:title",
        content: "Superior University CGPA Calculator – Free Cumulative GPA Tool",
      },
      {
        property: "og:description",
        content:
          "Free Superior University CGPA calculator — combine semester SGPAs and credit hours, compute cumulative GPA instantly, and download a PDF report.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CgpaPage,
});

function CgpaPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Superior University CGPA Calculator
            </h1>
            <p className="text-xs text-muted-foreground">
              Free cumulative GPA tool
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Calculate your cumulative GPA
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Enter each semester's SGPA and credit hours to compute your overall
            CGPA, then download a clean PDF report.
          </p>
          <p className="mt-3 text-sm">
            <Link to="/" className="text-primary hover:underline">
              ← Back to home
            </Link>{" "}
            ·{" "}
            <Link to="/sgpa" className="text-primary hover:underline">
              SGPA Calculator
            </Link>
          </p>
        </section>

        <CgpaCalculator />

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
