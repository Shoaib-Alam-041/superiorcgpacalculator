import { useEffect, useMemo } from "react";
import { Plus, Trash2, Download, GraduationCap, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { computeGPA, getGradeByName } from "@/lib/grading";
import { downloadCgpaReport } from "@/lib/report";
import { usePersistentState } from "@/hooks/usePersistentState";
import { SummerRepeats, type Repeat } from "@/components/SummerRepeats";

interface Sem {
  id: string;
  label: string;
  sgpa: string;
  credits: string;
}

const newSem = (i: number): Sem => ({
  id: crypto.randomUUID(),
  label: `Semester ${i}`,
  sgpa: "",
  credits: "",
});

export function CgpaCalculator() {
  const [studentName, setStudentName] = usePersistentState<string>("cgpa.studentName", "");
  const [sems, setSems] = usePersistentState<Sem[]>("cgpa.sems", [newSem(1), newSem(2)]);
  const [repeats, setRepeats] = usePersistentState<Repeat[]>("cgpa.repeats", []);

  // Listen for SGPA saves from the SGPA tab and refresh from storage
  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem("cgpa.sems");
        if (raw) setSems(JSON.parse(raw) as Sem[]);
      } catch {
        // ignore
      }
    };
    window.addEventListener("cgpa.sems.updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cgpa.sems.updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [setSems]);

  const rows = useMemo(
    () =>
      sems.map((s) => ({
        ...s,
        credits: Number(s.credits) || 0,
        point: Number(s.sgpa) || 0,
      })),
    [sems],
  );

  const baseCgpa = useMemo(() => computeGPA(rows), [rows]);
  const totalCredits = rows.reduce((a, b) => a + b.credits, 0);

  // Summer / repeated courses: the old grade is replaced by the new one.
  const repeatRows = useMemo(
    () =>
      repeats.map((r) => {
        const credits = Number(r.credits) || 0;
        const oldPoint = getGradeByName(r.oldGrade)?.point ?? 0;
        const newPoint = getGradeByName(r.newGrade)?.point ?? 0;
        return { ...r, credits, oldPoint, newPoint, delta: credits * (newPoint - oldPoint) };
      }),
    [repeats],
  );

  const deltaPoints = repeatRows.reduce((a, r) => a + r.delta, 0);
  const cgpa =
    totalCredits > 0
      ? Math.max(0, Math.min(4, (baseCgpa * totalCredits + deltaPoints) / totalCredits))
      : 0;

  const update = (id: string, patch: Partial<Sem>) =>
    setSems((xs) => xs.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          CGPA Calculator
        </CardTitle>
        <CardDescription>Combine SGPAs across semesters.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="cname">Student name (optional)</Label>
          <Input
            id="cname"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="space-y-3">
          {sems.map((s, i) => (
            <div
              key={s.id}
              className="grid grid-cols-12 gap-2 rounded-lg border border-border bg-card/50 p-3"
            >
              <div className="col-span-12 sm:col-span-5">
                <Label htmlFor={`semester-label-${s.id}`} className="text-xs text-muted-foreground">
                  Label
                </Label>
                <Input
                  id={`semester-label-${s.id}`}
                  value={s.label}
                  onChange={(e) => update(s.id, { label: e.target.value })}
                  placeholder={`Semester ${i + 1}`}
                />
              </div>
              <div className="col-span-5 sm:col-span-3">
                <Label htmlFor={`semester-sgpa-${s.id}`} className="text-xs text-muted-foreground">
                  SGPA
                </Label>
                <Input
                  id={`semester-sgpa-${s.id}`}
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={s.sgpa}
                  onChange={(e) => update(s.id, { sgpa: e.target.value })}
                  placeholder="0.00 - 4.00"
                />
              </div>
              <div className="col-span-5 sm:col-span-3">
                <Label htmlFor={`semester-credits-${s.id}`} className="text-xs text-muted-foreground">
                  Credits
                </Label>
                <Input
                  id={`semester-credits-${s.id}`}
                  type="number"
                  min="0"
                  value={s.credits}
                  onChange={(e) => update(s.id, { credits: e.target.value })}
                  placeholder="e.g. 18"
                />
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-end justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSems((xs) => xs.filter((x) => x.id !== s.id))}
                  disabled={sems.length <= 1}
                  aria-label="Remove semester"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="outline" onClick={() => setSems((xs) => [...xs, newSem(xs.length + 1)])}>
            <Plus className="mr-2 h-4 w-4" /> Add semester
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setStudentName("");
              setSems([newSem(1), newSem(2)]);
              setRepeats([]);
              toast.success("CGPA form reset");
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        <SummerRepeats repeats={repeats} onChange={setRepeats} />

        <div className="grid gap-4 rounded-xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground sm:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-80">Your CGPA</div>
            <div className="text-4xl font-bold">{cgpa.toFixed(2)}</div>
            {repeatRows.length > 0 && (
              <div className="mt-1 text-xs opacity-80">
                Before summer replacement: {baseCgpa.toFixed(2)}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide opacity-80">Total Credits</div>
            <div className="text-4xl font-bold">{totalCredits}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide opacity-80">Semesters</div>
            <div className="text-4xl font-bold">{rows.length}</div>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={() =>
            downloadCgpaReport({
              studentName,
              semesters: rows.map((r) => ({
                label: r.label,
                sgpa: r.point,
                credits: r.credits,
              })),
              repeats: repeatRows.map((r) => ({
                course: r.course || "Repeated course",
                credits: r.credits,
                oldGrade: r.oldGrade,
                newGrade: r.newGrade,
                delta: r.delta,
              })),
              baseCgpa,
              cgpa,
              totalCredits,
            })
          }
        >
          <Download className="mr-2 h-4 w-4" /> Download PDF Report
        </Button>
      </CardContent>
    </Card>
  );
}
