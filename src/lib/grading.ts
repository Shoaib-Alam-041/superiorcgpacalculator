export interface GradeInfo {
  grade: string;
  point: number;
  min: number;
  max: number;
}

export const GRADE_SCALE: GradeInfo[] = [
  { grade: "A", point: 4.0, min: 85, max: 100 },
  { grade: "A-", point: 3.66, min: 80, max: 84 },
  { grade: "B+", point: 3.33, min: 75, max: 79 },
  { grade: "B", point: 3.0, min: 71, max: 74 },
  { grade: "B-", point: 2.66, min: 68, max: 70 },
  { grade: "C+", point: 2.33, min: 64, max: 67 },
  { grade: "C", point: 2.0, min: 61, max: 63 },
  { grade: "C-", point: 1.66, min: 58, max: 60 },
  { grade: "D+", point: 1.33, min: 54, max: 57 },
  { grade: "D", point: 1.0, min: 50, max: 53 },
  { grade: "F", point: 0.0, min: 0, max: 49 },
];

export function getGradeFromMarks(marks: number): GradeInfo {
  return GRADE_SCALE.find((g) => marks >= g.min && marks <= g.max) ?? GRADE_SCALE[GRADE_SCALE.length - 1];
}

export function getGradeByName(name: string): GradeInfo | undefined {
  return GRADE_SCALE.find((g) => g.grade === name);
}

export function computeGPA(items: { credits: number; point: number }[]): number {
  const totalCredits = items.reduce((s, i) => s + (Number(i.credits) || 0), 0);
  if (totalCredits === 0) return 0;
  const totalPoints = items.reduce((s, i) => s + (Number(i.credits) || 0) * (Number(i.point) || 0), 0);
  return totalPoints / totalCredits;
}
