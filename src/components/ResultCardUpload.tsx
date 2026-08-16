import { useRef, useState } from "react";
import { Upload, FileText, Loader2, Wand2, ListPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseResultCard, type ParsedResultCard, type ParsedTerm } from "@/lib/resultCard";

function fillSgpa(name: string, term: ParsedTerm) {
  const courses = term.courses
    .filter((c) => !c.deficiency)
    .map((c) => ({
      id: crypto.randomUUID(),
      name: c.title,
      credits: String(c.credits),
      mode: "marks" as const,
      grade: c.grade,
      marks: String(c.marks),
    }));
  if (courses.length === 0) {
    toast.error("No countable courses in this term");
    return;
  }
  localStorage.setItem("sgpa.courses", JSON.stringify(courses));
  localStorage.setItem("sgpa.semester", JSON.stringify(term.term));
  localStorage.setItem("sgpa.studentName", JSON.stringify(name));
  window.dispatchEvent(new Event("sgpa.data.updated"));
  toast.success(`${term.term} loaded into SGPA calculator`);
}

function fillCgpa(name: string, data: ParsedResultCard) {
  const sems = data.terms.map((t) => {
    const credits = t.courses.filter((c) => !c.deficiency).reduce((s, c) => s + c.credits, 0);
    return {
      id: crypto.randomUUID(),
      label: t.term,
      sgpa: t.sgpa != null ? t.sgpa.toFixed(2) : "",
      credits: String(credits),
    };
  });
  localStorage.setItem("cgpa.sems", JSON.stringify(sems));
  localStorage.setItem("cgpa.studentName", JSON.stringify(name));
  window.dispatchEvent(new Event("cgpa.sems.updated"));
  toast.success(`${sems.length} semesters loaded into CGPA calculator`);
}

export function ResultCardUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ParsedResultCard | null>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const parsed = await parseResultCard(file);
      if (parsed.terms.length === 0) {
        toast.error("Couldn't read any courses from this file");
        setData(null);
      } else {
        setData(parsed);
        toast.success(`Found ${parsed.terms.length} term(s)`);
      }
    } catch {
      toast.error("Could not read this PDF. Try the official result card file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 border-dashed border-primary/40 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5 text-primary" />
          Upload Result Card (auto-fill)
        </CardTitle>
        <CardDescription>
          Upload your Superior University result card PDF — courses, credits, marks and grades fill
          in automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {loading ? "Reading PDF..." : "Choose result card PDF"}
        </Button>

        {data && (
          <div className="space-y-3">
            {data.studentName && (
              <p className="text-sm text-muted-foreground">
                Student: <span className="font-medium text-foreground">{data.studentName}</span>
              </p>
            )}
            <Button variant="secondary" onClick={() => fillCgpa(data.studentName, data)}>
              <ListPlus className="mr-2 h-4 w-4" /> Fill CGPA with all terms
            </Button>
            <div className="space-y-2">
              {data.terms.map((t, i) => (
                <div
                  key={`${t.term}-${i}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-3"
                >
                  <div className="text-sm">
                    <div className="font-medium">{t.term}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.courses.length} courses{t.sgpa != null ? ` · SGPA ${t.sgpa.toFixed(2)}` : ""}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => fillSgpa(data.studentName, t)}>
                    <Wand2 className="mr-2 h-4 w-4" /> Fill SGPA
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
