import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GRADE_SCALE } from "@/lib/grading";

export function GradeScaleTable() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Grading Scale</CardTitle>
        <CardDescription>Superior University official grading system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Marks (%)</th>
                <th className="px-4 py-2 text-left font-semibold">Grade</th>
                <th className="px-4 py-2 text-right font-semibold">Grade Point</th>
              </tr>
            </thead>
            <tbody>
              {GRADE_SCALE.map((g) => (
                <tr key={g.grade} className="border-t border-border">
                  <td className="px-4 py-2">
                    {g.grade === "F" ? "Below 50%" : `${g.min} – ${g.max}%`}
                  </td>
                  <td className="px-4 py-2 font-medium">{g.grade}</td>
                  <td className="px-4 py-2 text-right font-mono">{g.point.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
