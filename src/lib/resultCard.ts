export interface ParsedCourse {
  code: string;
  title: string;
  credits: number;
  marks: number;
  grade: string;
  deficiency: boolean;
}

export interface ParsedTerm {
  term: string;
  sgpa: number | null;
  cgpa: number | null;
  courses: ParsedCourse[];
}

export interface ParsedResultCard {
  studentName: string;
  terms: ParsedTerm[];
}

const GRADE = "(A-|A|B\\+|B-|B|C\\+|C-|C|D\\+|D|F)";
const COURSE_RE = new RegExp(
  `^\\d{1,2}\\s+([A-Z]{2,4}\\d{5,7})\\s*(\\*)?\\s+(.+?)\\s+(\\d+(?:\\.\\d+)?)\\s+\\d+(?:\\.\\d+)?\\s+(\\d+(?:\\.\\d+)?)\\s+${GRADE}$`,
);
const TERM_RE = /Term:\s*([A-Za-z]+\s*\d{4})(?:.*?SGPA:\s*([\d.]+))?(?:.*?CGPA:\s*([\d.]+))?/i;

/** Extracts visual text lines from a PDF file in the browser. */
export async function pdfToLines(file: File): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const lines: string[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const buckets = new Map<number, { x: number; s: string }[]>();

    for (const item of content.items as Array<{ str: string; transform: number[] }>) {
      if (!item.str || !item.str.trim()) continue;
      const y = Math.round(item.transform[5]);
      const key = [...buckets.keys()].find((k) => Math.abs(k - y) <= 2) ?? y;
      const arr = buckets.get(key) ?? [];
      arr.push({ x: item.transform[4], s: item.str });
      buckets.set(key, arr);
    }

    [...buckets.entries()]
      .sort((a, b) => b[0] - a[0])
      .forEach(([, parts]) => {
        const line = parts
          .sort((a, b) => a.x - b.x)
          .map((p2) => p2.s)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        if (line) lines.push(line);
      });
  }

  return lines;
}

export function parseResultCardLines(lines: string[]): ParsedResultCard {
  const terms: ParsedTerm[] = [];
  let studentName = "";
  let current: ParsedTerm | null = null;

  for (const line of lines) {
    if (!studentName && /^Name\s/i.test(line)) {
      const n = line
        .replace(/^Name\s+/i, "")
        .split(/\s+(?:Batch|Program|Shift|Department)\b/i)[0]
        .replace(/^[A-Z0-9]+(?:-[A-Z0-9]+)*-/, "")
        .trim();
      if (n) studentName = n;
    }


    const t = line.match(TERM_RE);
    if (t) {
      current = {
        term: t[1].replace(/\s+/g, " ").trim(),
        sgpa: t[2] ? Number(t[2]) : null,
        cgpa: t[3] ? Number(t[3]) : null,
        courses: [],
      };
      terms.push(current);
      continue;
    }

    const c = line.match(COURSE_RE);
    if (c) {
      const course: ParsedCourse = {
        code: c[1],
        title: c[3].trim(),
        credits: Number(c[4]),
        marks: Number(c[5]),
        grade: c[6],
        deficiency: Boolean(c[2]),
      };
      if (!current) {
        current = { term: "Semester", sgpa: null, cgpa: null, courses: [] };
        terms.push(current);
      }
      current.courses.push(course);
      continue;
    }

    // Wrapped course-title continuation lines
    const last = current?.courses[current.courses.length - 1];
    if (
      last &&
      /^[A-Za-z(]/.test(line) &&
      line.length < 60 &&
      !/^(Total|Term|Sr#|Code|The Superior|Date:|Academic|Page)/i.test(line)
    ) {
      last.title = `${last.title} ${line}`.replace(/\s+/g, " ").trim();
    }
  }


  return { studentName, terms: terms.filter((x) => x.courses.length > 0) };
}

export async function parseResultCard(file: File): Promise<ParsedResultCard> {
  return parseResultCardLines(await pdfToLines(file));
}
