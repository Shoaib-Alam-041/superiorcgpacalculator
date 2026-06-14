import { useMemo } from "react";
import { Plus, Trash2, Download, Calculator, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { usePersistentState } from "@/hooks/usePersistentState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADE_SCALE, computeGPA, getGradeByName, getGradeFromMarks } from "@/lib/grading";
import { downloadSgpaReport } from "@/lib/report";

interface Course {
  id: string;
  name: string;
  credits: string;
  mode: "grade" | "marks";
  grade: string;
  marks: string;
}

const newCourse = (): Course => ({
  id: crypto.randomUUID(),
  name: "",
  credits: "3",
  mode: "grade",
  grade: "A",
  marks: "",
});

export function SgpaCalculator() {
  const [studentName, setStudentName] = usePersistentState<string>("sgpa.studentName", "");
  const [semester, setSemester] = usePersistentState<string>("sgpa.semester", "");
  const [courses, setCourses] = usePersistentState<Course[]>("sgpa.courses", [newCourse(), newCourse(), newCourse()]);

  const rows = useMemo(
    () =>
      courses.map((c) => {
        const credits = Number(c.credits) || 0;
        let point = 0;
        let gradeName = c.grade;
        if (c.mode === "marks") {
          const m = Number(c.marks);
          if (!isNaN(m) && c.marks !== "") {
            const g = getGradeFromMarks(m);
            point = g.point;
            gradeName = g.grade;
          }
        } else {
          point = getGradeByName(c.grade)?.point ?? 0;
        }
        return { ...c, credits, point, gradeName };
      }),
    [courses],
  );

  const sgpa = useMemo(() => computeGPA(rows), [rows]);
  const totalCredits = rows.reduce((s, r) => s + r.credits, 0);

  const update = (id: string, patch: Partial<Course>) =>
    setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          SGPA Calculator
        </CardTitle>
        <CardDescription>Enter your courses for one semester.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="student">Student name (optional)</Label>
            <Input
              id="student"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <Label htmlFor="sem">Semester (optional)</Label>
            <Input
              id="sem"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g. Fall 2025"
            />
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((c, i) => (
            <div
              key={c.id}
              className="grid grid-cols-12 gap-2 rounded-lg border border-border bg-card/50 p-3"
            >
              <div className="col-span-12 sm:col-span-4">
                <Label className="text-xs text-muted-foreground">Course</Label>
                <Input
                  value={c.name}
                  onChange={(e) => update(c.id, { name: e.target.value })}
                  placeholder={`Course ${i + 1}`}
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Credits</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={c.credits}
                  onChange={(e) => update(c.id, { credits: e.target.value })}
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Input</Label>
                <Select
                  value={c.mode}
                  onValueChange={(v: "grade" | "marks") => update(c.id, { mode: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grade">Grade</SelectItem>
                    <SelectItem value="marks">Marks %</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-4 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">
                  {c.mode === "grade" ? "Grade" : "Marks"}
                </Label>
                {c.mode === "grade" ? (
                  <Select value={c.grade} onValueChange={(v) => update(c.id, { grade: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GRADE_SCALE.map((g) => (
                        <SelectItem key={g.grade} value={g.grade}>
                          {g.grade} ({g.point.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={c.marks}
                    onChange={(e) => update(c.id, { marks: e.target.value })}
                    placeholder="0-100"
                  />
                )}
              </div>
              <div className="col-span-10 sm:col-span-1 flex items-end">
                <div className="text-sm">
                  <div className="text-xs text-muted-foreground">GP</div>
                  <div className="font-semibold text-foreground">{c.point.toFixed(2)}</div>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-end justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCourses((cs) => cs.filter((x) => x.id !== c.id))}
                  disabled={courses.length <= 1}
                  aria-label="Remove course"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={() => setCourses((cs) => [...cs, newCourse()])}>
          <Plus className="mr-2 h-4 w-4" /> Add course
        </Button>

        <div className="grid gap-4 rounded-xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground sm:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-80">Your SGPA</div>
            <div className="text-4xl font-bold">{sgpa.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide opacity-80">Total Credits</div>
            <div className="text-4xl font-bold">{totalCredits}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide opacity-80">Courses</div>
            <div className="text-4xl font-bold">{rows.length}</div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            variant="secondary"
            onClick={() => {
              try {
                const raw = localStorage.getItem("cgpa.sems");
                const list: Array<{ id: string; label: string; sgpa: string; credits: string }> =
                  raw ? JSON.parse(raw) : [];
                list.push({
                  id: crypto.randomUUID(),
                  label: semester || `Semester ${list.length + 1}`,
                  sgpa: sgpa.toFixed(2),
                  credits: String(totalCredits),
                });
                localStorage.setItem("cgpa.sems", JSON.stringify(list));
                window.dispatchEvent(new Event("cgpa.sems.updated"));
                toast.success("SGPA saved to CGPA calculator");
              } catch {
                toast.error("Could not save SGPA");
              }
            }}
          >
            <Save className="mr-2 h-4 w-4" /> Save & Add to CGPA
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setStudentName("");
              setSemester("");
              setCourses([newCourse(), newCourse(), newCourse()]);
              toast.success("SGPA form reset");
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={() =>
            downloadSgpaReport({
              studentName,
              semester,
              courses: rows.map((r) => ({
                name: r.name || "Untitled",
                credits: r.credits,
                grade: r.gradeName,
                point: r.point,
              })),
              sgpa,
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
