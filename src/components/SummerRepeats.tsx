import { Plus, Trash2, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADE_SCALE } from "@/lib/grading";

export interface Repeat {
  id: string;
  course: string;
  credits: string;
  oldGrade: string;
  newGrade: string;
}

export const newRepeat = (): Repeat => ({
  id: crypto.randomUUID(),
  course: "",
  credits: "3",
  oldGrade: "F",
  newGrade: "B",
});

interface Props {
  repeats: Repeat[];
  onChange: (updater: (rs: Repeat[]) => Repeat[]) => void;
}

export function SummerRepeats({ repeats, onChange }: Props) {
  const update = (id: string, patch: Partial<Repeat>) =>
    onChange((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="mb-1 flex items-center gap-2 font-semibold">
        <Sun className="h-4 w-4 text-primary" />
        Summer / Repeated Courses
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Agar koi course regular semester mein fail hua tha aur aapne summer mein dobara liya hai, use
        yahan add karein — purana grade naye grade se replace ho jayega.
      </p>

      <div className="space-y-3">
        {repeats.map((r, i) => (
          <div
            key={r.id}
            className="grid grid-cols-12 gap-2 rounded-lg border border-border bg-card p-3"
          >
            <div className="col-span-12 sm:col-span-4">
              <Label htmlFor={`repeat-course-${r.id}`} className="text-xs text-muted-foreground">
                Course
              </Label>
              <Input
                id={`repeat-course-${r.id}`}
                value={r.course}
                onChange={(e) => update(r.id, { course: e.target.value })}
                placeholder={`Repeated course ${i + 1}`}
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Label htmlFor={`repeat-credits-${r.id}`} className="text-xs text-muted-foreground">
                Credits
              </Label>
              <Input
                id={`repeat-credits-${r.id}`}
                type="number"
                min="0"
                step="0.5"
                value={r.credits}
                onChange={(e) => update(r.id, { credits: e.target.value })}
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Label htmlFor={`repeat-old-${r.id}`} className="text-xs text-muted-foreground">
                Old grade
              </Label>
              <Select value={r.oldGrade} onValueChange={(v) => update(r.id, { oldGrade: v })}>
                <SelectTrigger id={`repeat-old-${r.id}`} aria-label="Old grade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_SCALE.map((g) => (
                    <SelectItem key={g.grade} value={g.grade}>
                      {g.grade} ({g.point.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4 sm:col-span-3">
              <Label htmlFor={`repeat-new-${r.id}`} className="text-xs text-muted-foreground">
                New grade (summer)
              </Label>
              <Select value={r.newGrade} onValueChange={(v) => update(r.id, { newGrade: v })}>
                <SelectTrigger id={`repeat-new-${r.id}`} aria-label="New grade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_SCALE.map((g) => (
                    <SelectItem key={g.grade} value={g.grade}>
                      {g.grade} ({g.point.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-12 flex items-end justify-end sm:col-span-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChange((rs) => rs.filter((x) => x.id !== r.id))}
                aria-label="Remove repeated course"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-3"
        onClick={() => onChange((rs) => [...rs, newRepeat()])}
      >
        <Plus className="mr-2 h-4 w-4" /> Add summer / repeated course
      </Button>
    </div>
  );
}
